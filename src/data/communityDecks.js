/**
 * Community Decks Repository with Supabase Cloud Sync
 * Vampire: The Masquerade – Clans of London
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
    localStorage.setItem(LOCAL_STORAGE_COMMUNITY_DECKS, JSON.stringify(decks));
  } catch (e) {
    console.error("Error saving local community decks", e);
  }
}

/**
 * Récupère tous les decks de la communauté depuis le Cloud Supabase
 * et synchronise avec les decks locaux.
 */
export async function fetchCloudCommunityDecks() {
  const localDecks = getLocalCommunityDecks();
  const supabase = getSupabaseClient();
  
  if (!supabase) {
    return localDecks;
  }

  try {
    const { data: cloudDecks, error } = await supabase
      .from('col_community_decks')
      .select('*')
      .order('published_at', { ascending: false });

    if (error) {
      console.warn("Supabase col_community_decks not found or query error, using local fallback", error.message);
      return localDecks;
    }

    if (cloudDecks && Array.isArray(cloudDecks)) {
      const mappedCloud = cloudDecks.map(d => ({
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
      }));

      // Merge cloud with any unsynced local decks
      const cloudIds = new Set(mappedCloud.map(d => d.id));
      const unsyncedLocal = localDecks.filter(ld => !cloudIds.has(ld.id));

      // Auto-upload unsynced local decks to cloud
      for (const unsynced of unsyncedLocal) {
        try {
          await supabase.from('col_community_decks').insert([{
            name: unsynced.name,
            author: unsynced.author,
            clan: unsynced.clan,
            tier: 'Communauté',
            card_ids: unsynced.cardIds,
            strategy_fr: unsynced.strategy_fr,
            strategy_en: unsynced.strategy_en,
            likes: unsynced.likes || 1
          }]);
        } catch (syncErr) {
          console.warn("Error auto-uploading local deck", syncErr);
        }
      }

      const merged = [...mappedCloud, ...unsyncedLocal];
      saveLocalCommunityDecks(merged);
      return merged;
    }
  } catch (err) {
    console.error("Error fetching cloud community decks", err);
  }

  return localDecks;
}

/**
 * Publie un deck dans le Cloud Supabase et le sauvegarde localement
 */
export async function publishCommunityDeck(deckData) {
  const localDecks = getLocalCommunityDecks();
  const newEntry = {
    id: `comm-user-${Date.now()}`,
    name: deckData.name,
    name_en: deckData.name,
    author: deckData.author || "Kindred",
    clan: deckData.clan || "Neutre",
    tier: "Communauté",
    cardIds: deckData.cardIds,
    strategy_fr: deckData.strategy || "Deck partagé par la communauté.",
    strategy_en: deckData.strategy || "Deck shared by the community.",
    publishedAt: new Date().toISOString().split('T')[0],
    likes: 1
  };

  // 1. Save local
  const updatedLocal = [newEntry, ...localDecks];
  saveLocalCommunityDecks(updatedLocal);

  // 2. Push to Supabase Cloud
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('col_community_decks')
        .insert([{
          name: deckData.name,
          author: deckData.author || "Kindred",
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
        newEntry.id = data.id;
      }
    } catch (e) {
      console.warn("Error publishing deck to Supabase cloud", e);
    }
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
