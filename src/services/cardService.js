/**
 * Clans of London — Card Service (Source Unique de Verite pour les Cartes)
 *
 * TOUTES les donnees de cartes passent par ce service.
 * Aucun composant ne doit importer directement CARDS_DATA.
 *
 * Ce service :
 * - Expose les accesseurs de donnees (getAllCards, getCardById, etc.)
 * - Gere la traduction des champs traduits (ability, rarity, archetype)
 * - Fournit le moteur de recherche et de filtrage unifie
 */

import { CARDS_DATA } from '../data/cardsData';

// ─── Accesseurs de base ───────────────────────────────────────────────────────

/** Retourne toutes les cartes de la base de donnees. */
export function getAllCards() {
  return CARDS_DATA;
}

/** Retourne une carte par son identifiant unique. */
export function getCardById(id) {
  if (!id) return null;
  const normalId = id.toLowerCase();
  return CARDS_DATA.find(c => c.id.toLowerCase() === normalId) || null;
}

/** Retourne plusieurs cartes a partir d'un tableau d'identifiants. */
export function getCardsByIds(ids = []) {
  if (!Array.isArray(ids)) return [];
  return ids.map(id => getCardById(id)).filter(Boolean);
}

/** Retourne le nombre total de cartes dans la base. */
export function getTotalCardsCount() {
  return CARDS_DATA.length;
}

// ─── Traduction des champs ────────────────────────────────────────────────────

/**
 * Retourne la capacite/description d'une carte dans la langue demandee.
 * Fallback : ability_en > ability (fr) > chaine vide.
 */
export function getCardAbility(card, lang = 'en') {
  if (!card) return '';
  const langKey = `ability_${lang}`;
  return card[langKey] || card.ability_en || card.ability || '';
}

/**
 * Retourne la rarity traduite selon la langue active.
 * Les raretés dans cardsData sont en francais — on les mappe ici.
 */
const RARITY_MAP = {
  'Commune':    { fr: 'Commune',    en: 'Common',    it: 'Comune',      de: 'Gewöhnlich',  es: 'Común',     pt: 'Comum'     },
  'Rare':       { fr: 'Rare',       en: 'Rare',      it: 'Rara',        de: 'Selten',      es: 'Rara',      pt: 'Rara'      },
  'Épique':     { fr: 'Épique',     en: 'Epic',      it: 'Epica',       de: 'Episch',      es: 'Épica',     pt: 'Épica'     },
  'Légendaire': { fr: 'Légendaire', en: 'Legendary', it: 'Leggendaria', de: 'Legendär',    es: 'Legendaria',pt: 'Lendária'  },
};

export function getCardRarity(card, lang = 'en') {
  if (!card) return '';
  const raw = card.rarity || '';
  return RARITY_MAP[raw]?.[lang] || raw;
}

/**
 * Retourne l'archetype traduit selon la langue active.
 */
const ARCHETYPE_MAP = {
  'Élitiste':   { fr: 'Élitiste',   en: 'Elitist',    it: 'Elitista',    de: 'Elitist',     es: 'Elitista',    pt: 'Elitista'    },
  'Sorcier':    { fr: 'Sorcier',    en: 'Sorcerer',   it: 'Stregone',    de: 'Zauberer',    es: 'Hechicero',   pt: 'Feiticeiro'  },
  'Acolyte':    { fr: 'Acolyte',    en: 'Acolyte',    it: 'Accolito',    de: 'Akolyt',      es: 'Acólito',     pt: 'Acólito'     },
  'Bête':       { fr: 'Bête',       en: 'Beast',      it: 'Bestia',      de: 'Bestie',      es: 'Bestia',      pt: 'Besta'       },
  'Violent':    { fr: 'Violent',    en: 'Violent',    it: 'Violento',    de: 'Gewalttätig', es: 'Violento',    pt: 'Violento'    },
  'Séduit':     { fr: 'Séduit',     en: 'Seduced',    it: 'Sedotto',     de: 'Verführt',    es: 'Seducido',    pt: 'Seduzido'    },
  'Charme':     { fr: 'Charme',     en: 'Charm',      it: 'Fascino',     de: 'Charme',      es: 'Encanto',     pt: 'Charme'      },
  'Démence':    { fr: 'Démence',    en: 'Delusion',   it: 'Delirio',     de: 'Wahn',        es: 'Delirio',     pt: 'Delírio'     },
  'Alchimiste': { fr: 'Alchimiste', en: 'Alchemist',  it: 'Alchimista',  de: 'Alchemist',   es: 'Alquimista',  pt: 'Alquimista'  },
  'N/A':        { fr: 'N/A',        en: 'N/A',        it: 'N/D',         de: 'N/V',         es: 'N/D',         pt: 'N/D'         },
};

export function getCardArchetype(card, lang = 'en') {
  if (!card) return '';
  const raw = card.archetype || 'N/A';
  return ARCHETYPE_MAP[raw]?.[lang] || card.archetype_en || raw;
}

/**
 * Retourne le nom de la carte (actuellement identique dans toutes les langues,
 * mais la structure est prete pour une internationalisation future).
 */
export function getCardName(card, lang = 'en') {
  if (!card) return '';
  return card[`name_${lang}`] || card.originalName || card.name || '';
}

// ─── Recherche et Filtrage ────────────────────────────────────────────────────

/**
 * Moteur de recherche unifie utilise par la Base de Cartes, le Deck Builder
 * et tous les autres composants.
 *
 * @param {Object} options
 * @param {string}   options.query        - Recherche textuelle libre
 * @param {string}   options.lang         - Langue active ('fr', 'en', etc.)
 * @param {string[]} options.clans        - Filtre par clans ([] = tous)
 * @param {string}   options.cost         - Filtre par cout ('all' ou chiffre)
 * @param {string}   options.series       - Filtre par serie ('all' ou chiffre)
 * @param {string}   options.archetype    - Filtre par archetype ('all' ou nom)
 * @param {string}   options.rarity       - Filtre par rarete ('all' ou nom)
 * @param {string}   options.ownership    - 'all' | 'owned' | 'missing'
 * @param {string[]} options.ownedIds     - IDs possedes par le joueur
 * @param {string}   options.sort         - Cle de tri
 * @returns {Card[]} Liste filtree et triee
 */
export function searchCards({
  query = '',
  lang = 'en',
  clans = [],
  cost = 'all',
  series = 'all',
  archetype = 'all',
  rarity = 'all',
  ownership = 'all',
  ownedIds = [],
  sort = 'name-asc'
} = {}) {
  let results = [...CARDS_DATA];

  // Filtre texte
  if (query.trim()) {
    const q = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    results = results.filter(card => {
      const ability = getCardAbility(card, lang).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const name    = (card.name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const clan    = (card.clan || '').toLowerCase();
      const kw      = (card.keywords || []).join(' ').toLowerCase();
      return name.includes(q) || ability.includes(q) || clan.includes(q) || kw.includes(q);
    });
  }

  // Filtre clans
  if (clans.length > 0) {
    results = results.filter(c => clans.includes(c.clan));
  }

  // Filtre cout
  if (cost !== 'all') {
    const costNum = parseInt(cost, 10);
    results = results.filter(c => c.cost === costNum);
  }

  // Filtre serie
  if (series !== 'all') {
    const seriesNum = parseInt(series, 10);
    results = results.filter(c => c.series === seriesNum);
  }

  // Filtre archetype
  if (archetype !== 'all') {
    results = results.filter(c => (c.archetype || '').toLowerCase() === archetype.toLowerCase() ||
                                  (c.archetype_en || '').toLowerCase() === archetype.toLowerCase());
  }

  // Filtre rarete
  if (rarity !== 'all') {
    results = results.filter(c => (c.rarity || '').toLowerCase() === rarity.toLowerCase());
  }

  // Filtre collection
  if (ownership === 'owned') {
    results = results.filter(c => ownedIds.includes(c.id));
  } else if (ownership === 'missing') {
    results = results.filter(c => !ownedIds.includes(c.id));
  }

  // Tri
  switch (sort) {
    case 'cost-asc':    results.sort((a, b) => a.cost - b.cost);   break;
    case 'cost-desc':   results.sort((a, b) => b.cost - a.cost);   break;
    case 'power-desc':  results.sort((a, b) => b.power - a.power); break;
    case 'power-asc':   results.sort((a, b) => a.power - b.power); break;
    case 'name-asc':    results.sort((a, b) => (a.name || '').localeCompare(b.name || '')); break;
    case 'series-asc':  results.sort((a, b) => a.series - b.series); break;
    case 'rarity-desc': {
      const order = { 'Légendaire': 4, 'Épique': 3, 'Rare': 2, 'Commune': 1 };
      results.sort((a, b) => (order[b.rarity] || 0) - (order[a.rarity] || 0));
      break;
    }
    default: break;
  }

  return results;
}

/**
 * Retourne la liste des clans uniques presents dans la base.
 */
export function getUniqueClansList() {
  const clans = [...new Set(CARDS_DATA.map(c => c.clan).filter(Boolean))];
  return clans.sort();
}

/**
 * Retourne la liste des archetyoes uniques presents dans la base.
 */
export function getUniqueArchetypesList() {
  const archetypes = [...new Set(CARDS_DATA.map(c => c.archetype).filter(a => a && a !== 'N/A'))];
  return archetypes.sort();
}
