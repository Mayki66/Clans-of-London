/**
 * Clans of London — Configuration Centrale
 * Toutes les constantes de l'application : cles localStorage, valeurs par defaut
 * et parametres globaux centralises ici pour eviter toute dispersion.
 */

// --- localStorage Keys -------------------------------------------------------
export const LS_SAVED_DECKS   = 'col_saved_decks_v1';
export const LS_CURRENT_DECK  = 'col_current_deck_v1';
export const LS_USER_PROFILE  = 'col_user_profile_v1';
export const LS_CUSTOM_IMAGES = 'col_custom_images_v1';
export const LS_LANG          = 'col_lang';
export const LS_ONBOARDING    = 'col_onboarding_completed';
export const LS_WIKI_SYNC     = 'col_wiki_sync_metadata_v1';
export const LS_SUPABASE_CFG  = 'col_supabase_config_v1';

// --- Game Rules ---------------------------------------------------------------
export const MAX_DECK_SIZE      = 15;
export const MAX_SERIES         = 5;
export const TOTAL_BOARD_SPACES = 15;

// --- Wiki & Sync --------------------------------------------------------------
export const WIKI_CARDLIST_URL = 'https://vtm.paradoxwikis.com/CoL_cardlist';
export const WIKI_BASE_URL     = 'https://vtm.paradoxwikis.com/Clans_of_London';
export const EDGE_SYNC_URL     = '/api/wiki-sync';

// --- Default Player Profile ---------------------------------------------------
export const DEFAULT_OWNED_CARD_IDS = [
  "col-001","col-002","col-029","col-003","col-004","col-032","col-028",
  "col-005","col-006","col-007","col-008","col-009","col-033","col-034",
  "col-035","col-010","col-011","col-040","col-051","col-012","col-041",
  "col-013","col-014","col-043","col-044","col-045","col-015","col-016",
  "col-017","col-046","col-047","col-048","col-050","col-052","col-018",
  "col-019","col-053","col-054","col-055","col-056","col-057","col-058",
  "col-059","col-060","col-061","col-020","col-022","col-023","col-153",
  "col-021","col-155","col-024","col-065","col-066","col-067","col-068",
  "col-069","col-025","col-070","col-071","col-026","col-027","col-072",
  "col-160","col-192","col-ing-01","col-ing-02","col-ing-03"
];

export const DEFAULT_USER_PROFILE = {
  playerName: '',
  collectionLevel: 1,
  arenaPoints: 0,
  ownedCardIds: DEFAULT_OWNED_CARD_IDS,
  matchHistory: []
};

// --- Default Starter Deck -----------------------------------------------------
export const DEFAULT_STARTER_DECK_NAME  = "Deck d'Initiation (Serie 0)";
export const DEFAULT_STARTER_DECK_COUNT = 10;

// --- Arena Leaderboard Fallback -----------------------------------------------
export const DEFAULT_LEADERBOARD = [
  { rank: 1, pseudo: "Mayki",          arenaPoints: 1250, level: 14, vampireRank: "Ancilla de Soho",           clan: "Brujah"  },
  { rank: 2, pseudo: "Julian Lys",     arenaPoints: 980,  level: 11, vampireRank: "Nouveau-Ne de Whitechapel", clan: "Toreador"},
  { rank: 3, pseudo: "Lady Elizabeth", arenaPoints: 850,  level: 9,  vampireRank: "Nouveau-Ne de la City",     clan: "Ventrue" },
  { rank: 4, pseudo: "Klinklecut",     arenaPoints: 720,  level: 8,  vampireRank: "Nouveau-Ne de Westminster", clan: "Toreador"},
  { rank: 5, pseudo: "The Huntress",   arenaPoints: 610,  level: 6,  vampireRank: "Nouveau-Ne de Hampstead",   clan: "Gangrel" }
];
