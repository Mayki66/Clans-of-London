/**
 * Community Decks Repository
 * Vampire: The Masquerade – Clans of London
 */

export const INITIAL_COMMUNITY_DECKS = [
  {
    id: "comm-duskborn-alchemy",
    name: "Alchimie Explosive du Crépuscule",
    name_en: "Duskborn Alchemy Burst",
    author: "Mayki",
    clan: "Duskborn",
    tier: "Tier 1",
    cardIds: [
      "col-192", // Cormac Flynn (X cost)
      "col-ing-01", // Blood Bag
      "col-ing-02", // Bleach
      "col-ing-03", // Caffeine Powder
      "col-115", // Natalya Volkova
      "col-116", // Jax Cook
      "col-001", // Luis Castaño
      "col-002", // Katie Dixon
      "col-003", // Mrs Fitzgerald
      "col-004", // Hope Ekaette
      "col-005", // Amy West
      "col-006", // Daniel Varney
      "col-007", // Archie
      "col-008", // Morag
      "col-009"  // Thomas
    ],
    strategy_fr: "Exploite Cormac Flynn pour dépenser tout le Sang restant et déclencher une pluie d'ingrédients corrosifs (Bleach, Caffeine Powder, Blood Bag). Jax Cook et Natalya Volkova maximisent les points.",
    strategy_en: "Unleashes Cormac Flynn to consume all remaining Blood, triggering an avalanche of Alchemical ingredients (Bleach, Caffeine Powder, Blood Bag). Jax Cook and Natalya Volkova maximize points.",
    publishedAt: "2026-08-20",
    likes: 42
  },
  {
    id: "comm-hecata-necromancy",
    name: "Moisson Funéraire d'Alsatia",
    name_en: "Alsatia Graveyard Harvest",
    author: "MortisLord",
    clan: "Hecata",
    tier: "Tier 1",
    cardIds: [
      "col-020", // Roger de Camden
      "col-022", // Thomas Thorne
      "col-023", // Morag
      "col-153", // Shifa
      "col-021", // Bianca
      "col-155", // Lord Colville
      "col-001", // Luis Castaño
      "col-002", // Katie Dixon
      "col-003", // Mrs Fitzgerald
      "col-005", // Amy West
      "col-006", // Daniel Varney
      "col-007", // Archie
      "col-008", // Morag
      "col-009", // Thomas
      "col-010"  // Stephen Fane
    ],
    strategy_fr: "Sacrifie continuellement les pions pour déclencher les capacités post-mortem de Thomas Thorne et Roger de Camden. Shifa s'infiltre sur les cases non contestées.",
    strategy_en: "Continuously sacrifices backline Pawns to trigger on-death abilities of Thomas Thorne and Roger de Camden. Shifa slips into uncontested spaces.",
    publishedAt: "2026-08-19",
    likes: 35
  },
  {
    id: "comm-ventrue-siphon",
    name: "Siphon Royal de Westminster",
    name_en: "Westminster Royal Siphon",
    author: "LadyVentrue",
    clan: "Ventrue",
    tier: "Tier 1",
    cardIds: [
      "col-014", // Cynthia Hargreaves
      "col-015", // Mr Moore
      "col-016", // Jürgen Mayer
      "col-017", // Horatio Drake
      "col-018", // Adrian Yu
      "col-019", // Stephen Fane
      "col-046", // Abigail Smith
      "col-001", // Luis Castaño
      "col-002", // Katie Dixon
      "col-003", // Mrs Fitzgerald
      "col-004", // Hope Ekaette
      "col-005", // Amy West
      "col-006", // Daniel Varney
      "col-007", // Archie
      "col-008"  // Morag
    ],
    strategy_fr: "La chaîne parfaite d'influence Ventrue. Cynthia Hargreaves et Mr Moore propulsent Horatio Drake à 17+ Puissance sur le Trône du Prince.",
    strategy_en: "The quintessential Ventrue support chain. Cynthia Hargreaves and Mr Moore boost Horatio Drake to 17+ Power on the Prince Throne.",
    publishedAt: "2026-08-18",
    likes: 29
  },
  {
    id: "comm-brujah-blitz",
    name: "Assaut Furieux de Whitechapel",
    name_en: "Whitechapel Fury Blitz",
    author: "AnarchRebel",
    clan: "Brujah",
    tier: "Tier 2",
    cardIds: [
      "col-010", // Dukaul
      "col-011", // Tyler
      "col-012", // Theo Conti
      "col-013", // Lennox
      "col-040", // Jeremy MacNeil
      "col-041", // Juggernaut
      "col-001", // Luis Castaño
      "col-002", // Katie Dixon
      "col-003", // Mrs Fitzgerald
      "col-004", // Hope Ekaette
      "col-005", // Amy West
      "col-006", // Daniel Varney
      "col-007", // Archie
      "col-008", // Morag
      "col-009"  // Thomas
    ],
    strategy_fr: "Offensive brutale visant à écraser les cavaliers adverses dès les tours 2 et 3 grâce à Tyler et Dukaul.",
    strategy_en: "Brutal direct assault aiming to overwhelm enemy Knights on rounds 2 and 3 using Tyler and Dukaul.",
    publishedAt: "2026-08-17",
    likes: 19
  }
];

const LOCAL_STORAGE_COMMUNITY_DECKS = 'col_community_decks_v1';

export function getCommunityDecks() {
  try {
    const custom = localStorage.getItem(LOCAL_STORAGE_COMMUNITY_DECKS);
    if (custom) {
      const parsed = JSON.parse(custom);
      return [...parsed, ...INITIAL_COMMUNITY_DECKS.filter(d => !parsed.some(p => p.id === d.id))];
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
      author: deckData.author || "Anonyme (Kindred)",
      clan: deckData.clan || "Neutre",
      tier: "Communauté",
      cardIds: deckData.cardIds,
      strategy_fr: deckData.strategy || "Deck partagé par la communauté.",
      strategy_en: deckData.strategy || "Deck shared by the community.",
      publishedAt: new Date().toISOString().split('T')[0],
      likes: 1
    };

    const updated = [newEntry, ...existing];
    localStorage.setItem(LOCAL_STORAGE_COMMUNITY_DECKS, JSON.stringify(updated.filter(d => d.id.startsWith('comm-user-'))));
    return newEntry;
  } catch (e) {
    console.error("Error publishing community deck", e);
    return null;
  }
}
