/**
 * Community Decks Repository with Supabase Cloud Sync
 * Vampire: The Masquerade – Clans of London
 *
 * Règles anti-doublon :
 *  - La source de vérité est TOUJOURS Supabase (UUID comme identifiant canonique).
 *  - Lors d'une publication, on attend l'UUID Supabase AVANT de sauvegarder localement.
 *  - Lors d'un fetch, on ne remonte JAMAIS un deck local qui a déjà un doublon (name+author) dans le cloud.
 *  - Le cache local est REMPLACÉ intégralement par la liste cloud dédupliquée à chaque fetch.
 */
import { getSupabaseClient } from '../utils/cloudDatabase';

export const INITIAL_COMMUNITY_DECKS = [];

const LOCAL_STORAGE_COMMUNITY_DECKS = 'col_community_decks_v1';

export function getLocalCommunityDecks() {
  try {
    const custom = localStorage.getItem(LOCAL_STORAGE_COMMUNITY_DECKS);
    if (custom) {
      const parsed = JSON.parse(custom);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (e) {
    console.error("Error reading local community decks", e);
  }
  return INITIAL_COMMUNITY_DECKS;
}

export function saveLocalCommunityDecks(decks) {
  try {
    // Dédupliquer par id avant de sauvegarder
    const seen = new Set();
    const unique = decks.filter(d => {
      if (!d.id || seen.has(d.id)) return false;
      seen.add(d.id);
      return true;
    });
    localStorage.setItem(LOCAL_STORAGE_COMMUNITY_DECKS, JSON.stringify(unique));
  } catch (e) {
    console.error("Error saving local community decks", e);
  }
}

/**
 * Mappe une ligne Supabase vers l'objet deck utilisé par l'UI.
 */
function mapCloudDeck(d) {
  return {
    id: d.id,
    name: d.name,
    name_en: d.name,
    author: d.author || "Kindred",
    clan: d.clan || "Brujah",
    tier: d.tier || "Communauté",
    cardIds: Array.isArray(d.card_ids) ? d.card_ids : [],
    strategy_fr: d.strategy_fr || "Deck partagé par la communauté.",
    strategy_en: d.strategy_en || "Deck shared by the community.",
    publishedAt: d.published_at ? new Date(d.published_at).toISOString().split('T')[0] : "Récemment",
    likes: d.likes || 1
  };
}

/**
 * Récupère tous les decks depuis Supabase et met à jour le cache local.
 * Le cloud est la source de vérité — le cache local est écrasé.
 * N'effectue AUCUN auto-upload : seul publishCommunityDeck() publie.
 */
export async function fetchCloudCommunityDecks() {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return getLocalCommunityDecks();
  }

  try {
    const { data: cloudDecks, error } = await supabase
      .from('col_community_decks')
      .select('*')
      .order('published_at', { ascending: false });

    if (error) {
      console.warn("Supabase community decks fetch error, using local cache", error.message);
      return getLocalCommunityDecks();
    }

    if (cloudDecks && Array.isArray(cloudDecks)) {
      // Dédupliquer côté cloud par (name + author) — garder la plus récente
      const seenNameAuthor = new Map();
      for (const d of cloudDecks) {
        const key = `${(d.name || '').toLowerCase()}|${(d.author || '').toLowerCase()}`;
        if (!seenNameAuthor.has(key)) {
          seenNameAuthor.set(key, d);
        }
        // Les doublons sont ignorés (la liste est triée par published_at DESC, donc on garde la plus récente)
      }

      const deduped = Array.from(seenNameAuthor.values()).map(mapCloudDeck);

      // Écraser le cache local avec la vérité cloud dédupliquée
      saveLocalCommunityDecks(deduped);
      return deduped;
    }
  } catch (err) {
    console.error("Error fetching cloud community decks", err);
  }

  return getLocalCommunityDecks();
}

/**
 * Publie un deck dans Supabase PUIS sauvegarde localement avec le vrai UUID.
 * Anti-doublon : vérifie d'abord si un deck (même nom + même auteur) existe déjà.
 */
export async function publishCommunityDeck(deckData) {
  const supabase = getSupabaseClient();

  const cleanName = (deckData.name || '').trim();
  const cleanAuthor = (deckData.author || 'Kindred').trim();

  // Vérification anti-doublon : existe-t-il déjà un deck avec ce nom+auteur ?
  if (supabase) {
    try {
      const { data: existing } = await supabase
        .from('col_community_decks')
        .select('id, name, author')
        .ilike('name', cleanName)
        .ilike('author', cleanAuthor)
        .limit(1);

      if (existing && existing.length > 0) {
        console.warn("publishCommunityDeck: deck already exists in cloud, skipping upload", existing[0]);
        // Retourner l'entrée existante sans créer de doublon
        const existingEntry = mapCloudDeck({
          ...existing[0],
          clan: deckData.clan,
          card_ids: deckData.cardIds,
          strategy_fr: deckData.strategy,
          strategy_en: deckData.strategy,
          published_at: new Date().toISOString(),
          likes: 1
        });
        return existingEntry;
      }
    } catch (e) {
      console.warn("Error checking for duplicate deck", e);
    }
  }

  // Publier dans Supabase (source de vérité) d'abord
  let newEntry = null;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('col_community_decks')
        .insert([{
          name: cleanName,
          author: cleanAuthor,
          clan: deckData.clan || "Neutre",
          tier: "Communauté",
          card_ids: deckData.cardIds,
          strategy_fr: deckData.strategy || "Deck partagé par la communauté.",
          strategy_en: deckData.strategy || "Deck shared by the community.",
          likes: 1
        }])
        .select()
        .single();

      if (!error && data) {
        newEntry = mapCloudDeck(data);
      }
    } catch (e) {
      console.warn("Error publishing deck to Supabase cloud", e);
    }
  }

  // Fallback local uniquement si Supabase a échoué (hors ligne)
  if (!newEntry) {
    newEntry = {
      id: `local-${Date.now()}`,
      name: cleanName,
      name_en: cleanName,
      author: cleanAuthor,
      clan: deckData.clan || "Neutre",
      tier: "Communauté",
      cardIds: deckData.cardIds,
      strategy_fr: deckData.strategy || "Deck partagé par la communauté.",
      strategy_en: deckData.strategy || "Deck shared by the community.",
      publishedAt: new Date().toISOString().split('T')[0],
      likes: 1
    };
  }

  // Ajouter au cache local (en tête de liste) après avoir l'ID définitif
  const localDecks = getLocalCommunityDecks();
  const alreadyInLocal = localDecks.some(d => d.id === newEntry.id);
  if (!alreadyInLocal) {
    saveLocalCommunityDecks([newEntry, ...localDecks]);
  }

  return newEntry;
}

/**
 * Vote / Like un deck dans le cloud
 */
export async function likeCommunityDeck(deckId, currentLikes = 1) {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase
        .from('col_community_decks')
        .update({ likes: currentLikes + 1 })
        .eq('id', deckId);
    } catch (e) {
      console.warn("Error liking deck in cloud", e);
    }
  }
}

/**
 * Écoute en temps réel les changements sur la table col_community_decks via WebSocket.
 * @param {Function} onChange Callback appelé lors d'un événement Realtime { type: 'INSERT'|'UPDATE'|'DELETE', deck?, deckId? }
 * @param {Function} onStatus Callback optionnel pour connaître le statut de connexion WebSocket
 * @returns {Function} Fonction de nettoyage (cleanup) pour désabonner le canal
 */
export function subscribeToCommunityDecks(onChange, onStatus) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    if (onStatus) onStatus('disconnected');
    return () => {};
  }

  const channelName = `col-decks-realtime-${Date.now()}`;
  const channel = supabase
    .channel(channelName)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'col_community_decks' },
      (payload) => {
        const { eventType, new: newRow, old: oldRow } = payload;
        if (eventType === 'INSERT' && newRow) {
          const mapped = mapCloudDeck(newRow);
          onChange({ type: 'INSERT', deck: mapped });
        } else if (eventType === 'UPDATE' && newRow) {
          const mapped = mapCloudDeck(newRow);
          onChange({ type: 'UPDATE', deck: mapped });
        } else if (eventType === 'DELETE' && oldRow) {
          onChange({ type: 'DELETE', deckId: oldRow.id });
        }
      }
    )
    .subscribe((status) => {
      if (onStatus) {
        if (status === 'SUBSCRIBED') {
          onStatus('connected');
        } else if (status === 'TIMED_OUT' || status === 'CHANNEL_ERROR') {
          onStatus('error');
        } else if (status === 'CLOSED') {
          onStatus('disconnected');
        }
      }
    });

  return () => {
    try {
      supabase.removeChannel(channel);
    } catch (e) {
      console.warn("Error unsubscribing Realtime channel", e);
    }
  };
}
