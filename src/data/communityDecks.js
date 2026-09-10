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
import { LS_LIKED_DECKS } from '../config/constants';

export const INITIAL_COMMUNITY_DECKS = [];

const LOCAL_STORAGE_COMMUNITY_DECKS = 'col_community_decks_v1';

/**
 * Nettoie et sécurise un objet deck (garantit cardIds comme tableau)
 */
export function sanitizeDeck(d) {
  if (!d || typeof d !== 'object') return null;
  const rawCards = Array.isArray(d.cardIds) 
    ? d.cardIds 
    : (Array.isArray(d.card_ids) 
        ? d.card_ids 
        : (typeof d.cardIds === 'string' 
            ? d.cardIds.split(',').map(s => s.trim()).filter(Boolean) 
            : (typeof d.card_ids === 'string' 
                ? d.card_ids.split(',').map(s => s.trim()).filter(Boolean) 
                : [])));

  return {
    id: String(d.id || `deck-${Date.now()}`),
    name: d.name || "Deck sans nom",
    name_en: d.name_en || d.name || "Untitled Deck",
    author: d.author || "Kindred",
    clan: d.clan || "Brujah",
    tier: d.tier || "Communauté",
    cardIds: rawCards,
    strategy_fr: d.strategy_fr || d.strategy || "Deck partagé par la communauté.",
    strategy_en: d.strategy_en || d.strategy || "Deck shared by the community.",
    publishedAt: d.publishedAt || (d.published_at ? new Date(d.published_at).toISOString().split('T')[0] : "Récemment"),
    likes: typeof d.likes === 'number' ? d.likes : 1
  };
}

export function getLocalCommunityDecks() {
  try {
    const custom = localStorage.getItem(LOCAL_STORAGE_COMMUNITY_DECKS);
    if (custom) {
      const parsed = JSON.parse(custom);
      if (Array.isArray(parsed)) {
        return parsed.map(sanitizeDeck).filter(Boolean);
      }
    }
  } catch (e) {
    console.error("Error reading local community decks", e);
  }
  return INITIAL_COMMUNITY_DECKS.map(sanitizeDeck).filter(Boolean);
}

export function saveLocalCommunityDecks(decks) {
  try {
    // Dédupliquer par id avant de sauvegarder
    const seen = new Set();
    const unique = decks
      .map(sanitizeDeck)
      .filter(d => {
        if (!d || !d.id || seen.has(d.id)) return false;
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
  return sanitizeDeck(d);
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
      .neq('tier', 'ARCHIVED_TEST')
      .order('published_at', { ascending: false });

    if (error) {
      console.warn("Supabase community decks fetch error, using local cache", error.message);
      return getLocalCommunityDecks();
    }

    if (cloudDecks && Array.isArray(cloudDecks)) {
      // Préserver tous les decks légitimes en dédupliquant uniquement par identifiant unique (id)
      const seenIds = new Set();
      const validDecks = [];

      for (const d of cloudDecks) {
        if (!d.id || seenIds.has(d.id) || d.tier === 'ARCHIVED_TEST') continue;
        seenIds.add(d.id);
        validDecks.push(mapCloudDeck(d));
      }

      // Mettre à jour le cache local avec tous les decks en ligne
      saveLocalCommunityDecks(validDecks);
      return validDecks;
    }
  } catch (err) {
    console.error("Error fetching cloud community decks", err);
  }

  return getLocalCommunityDecks();
}

/**
 * Publie un deck dans Supabase PUIS sauvegarde localement avec le vrai UUID.
 */
export async function publishCommunityDeck(deckData) {
  const supabase = getSupabaseClient();

  const cleanName = (deckData.name || '').trim() || 'Deck sans titre';
  const cleanAuthor = (deckData.author || '').trim() || 'Kindred';

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
          card_ids: deckData.cardIds || [],
          strategy_fr: deckData.strategy || "Deck partagé par la communauté.",
          strategy_en: deckData.strategy || "Deck shared by the community.",
          likes: 1
        }])
        .select()
        .single();

      if (!error && data) {
        newEntry = mapCloudDeck(data);
      } else if (error) {
        console.error("Error publishing deck to Supabase cloud:", error.message);
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
      cardIds: deckData.cardIds || [],
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
 * Récupère l'ensemble (Set) des identifiants de decks déjà likés par l'utilisateur.
 * Combine le stockage local permanent (localStorage) et le profil utilisateur.
 */
export function getLikedDeckIds(userProfile = null) {
  const ids = new Set();
  try {
    const raw = localStorage.getItem(LS_LIKED_DECKS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        parsed.forEach(id => {
          if (id) ids.add(String(id));
        });
      }
    }
  } catch (e) {
    console.warn("Error reading liked deck ids from localStorage", e);
  }

  if (userProfile && Array.isArray(userProfile.likedDeckIds)) {
    userProfile.likedDeckIds.forEach(id => {
      if (id) ids.add(String(id));
    });
  }

  return ids;
}

/**
 * Enregistre un deckId comme liké (dans localStorage).
 */
export function saveLikedDeckId(deckId) {
  if (!deckId) return;
  const strId = String(deckId);
  try {
    const current = getLikedDeckIds();
    current.add(strId);
    localStorage.setItem(LS_LIKED_DECKS, JSON.stringify(Array.from(current)));
  } catch (e) {
    console.warn("Error saving liked deck id to localStorage", e);
  }
}

/**
 * Vérifie si un deck a déjà été liké par le joueur / compte.
 */
export function hasLikedDeck(deckId, userProfile = null) {
  if (!deckId) return false;
  const set = getLikedDeckIds(userProfile);
  return set.has(String(deckId));
}

/**
 * Vote / Like un deck dans le cloud (1 seul vote par joueur, synchronisé avec Supabase)
 */
export async function likeCommunityDeck(deckId, fallbackLikes = 1) {
  const supabase = getSupabaseClient();
  if (supabase && deckId) {
    try {
      // Récupérer la dernière valeur de likes dans Supabase pour éviter tout écrasement stale
      const { data, error } = await supabase
        .from('col_community_decks')
        .select('likes')
        .eq('id', deckId)
        .single();

      const currentLikes = (!error && data && typeof data.likes === 'number')
        ? data.likes
        : (Number(fallbackLikes) || 1);

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
