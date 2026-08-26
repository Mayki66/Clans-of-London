/**
 * Client-Side Router & Deep-Linking Engine
 * Vampire: The Masquerade – Clans of London
 */

export const VALID_VIEWS = [
  'rules',
  'deckbuilder',
  'database',
  'community',
  'metadecks',
  'arena',
  'profile'
];

/**
 * Analyse l'URL actuelle (path, search params et hash fallback)
 * @returns {{ view: string, cardId: string|null, deckId: string|null }}
 */
export function parseCurrentRoute() {
  if (typeof window === 'undefined') {
    return { view: 'rules', cardId: null, deckId: null };
  }

  const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '');
  const searchParams = new URLSearchParams(window.location.search);

  // Support fallback hash (ex: #/community?deck=123)
  let hashPath = '';
  let hashParams = new URLSearchParams();
  if (window.location.hash) {
    const cleanHash = window.location.hash.replace(/^#\/?/, '');
    const [hPath, hQuery] = cleanHash.split('?');
    hashPath = (hPath || '').trim();
    if (hQuery) {
      hashParams = new URLSearchParams(hQuery);
    }
  }

  // 1. Déterminer la vue
  let view = 'rules';
  const candidatePath = pathname || hashPath || searchParams.get('view') || hashParams.get('view') || '';

  if (VALID_VIEWS.includes(candidatePath.toLowerCase())) {
    view = candidatePath.toLowerCase();
  }

  // 2. Déterminer les paramètres profonds (cardId, deckId)
  const cardId = searchParams.get('card') || hashParams.get('card') || null;
  const deckId = searchParams.get('deck') || hashParams.get('deck') || null;

  return {
    view,
    cardId: cardId ? cardId.trim() : null,
    deckId: deckId ? deckId.trim() : null
  };
}

/**
 * Met à jour l'URL sans recharger la page
 * @param {string} view
 * @param {{ cardId?: string|null, deckId?: string|null, replace?: boolean }} options
 */
export function navigateTo(view, options = {}) {
  if (typeof window === 'undefined') return;

  const targetView = VALID_VIEWS.includes(view) ? view : 'rules';
  const path = targetView === 'rules' ? '/' : `/${targetView}`;
  
  const searchParams = new URLSearchParams();
  if (options.cardId) {
    searchParams.set('card', options.cardId);
  }
  if (options.deckId) {
    searchParams.set('deck', options.deckId);
  }

  const queryString = searchParams.toString();
  const fullUrl = queryString ? `${path}?${queryString}` : path;

  if (options.replace) {
    window.history.replaceState({ view: targetView, ...options }, '', fullUrl);
  } else {
    window.history.pushState({ view: targetView, ...options }, '', fullUrl);
  }

  // Dispatch an event so components listening to route changes can react
  window.dispatchEvent(new CustomEvent('col-route-change', {
    detail: { view: targetView, cardId: options.cardId || null, deckId: options.deckId || null }
  }));
}

/**
 * Génère une URL absolue prête à être partagée pour une carte
 */
export function getShareableCardUrl(cardId) {
  if (typeof window === 'undefined') return '';
  const origin = window.location.origin;
  return `${origin}/database?card=${encodeURIComponent(cardId)}`;
}

/**
 * Génère une URL absolue prête à être partagée pour un deck communautaire
 */
export function getShareableCommunityDeckUrl(deckId) {
  if (typeof window === 'undefined') return '';
  const origin = window.location.origin;
  return `${origin}/community?deck=${encodeURIComponent(deckId)}`;
}

/**
 * Génère une URL absolue prête à être partagée pour un deck méta
 */
export function getShareableMetaDeckUrl(metaDeckId) {
  if (typeof window === 'undefined') return '';
  const origin = window.location.origin;
  return `${origin}/metadecks?deck=${encodeURIComponent(metaDeckId)}`;
}
