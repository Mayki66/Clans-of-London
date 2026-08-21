/**
 * Community Decks Repository (Clean & Ready for User Submissions)
 * Vampire: The Masquerade – Clans of London
 */

export const INITIAL_COMMUNITY_DECKS = [];

const LOCAL_STORAGE_COMMUNITY_DECKS = 'col_community_decks_v1';

export function getCommunityDecks() {
  try {
    const custom = localStorage.getItem(LOCAL_STORAGE_COMMUNITY_DECKS);
    if (custom) {
      const parsed = JSON.parse(custom);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (e) {
    console.error("Error reading community decks", e);
  }
  return INITIAL_COMMUNITY_DECKS;
}

export function publishCommunityDeck(deckData) {
  try {
    const existing = getCommunityDecks();
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

    const updated = [newEntry, ...existing];
    localStorage.setItem(LOCAL_STORAGE_COMMUNITY_DECKS, JSON.stringify(updated));
    return newEntry;
  } catch (e) {
    console.error("Error publishing community deck", e);
    return null;
  }
}
