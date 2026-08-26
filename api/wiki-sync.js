/**
 * Vercel Edge Function — Proxy Wiki Paradox
 * Clans of London
 *
 * Contourne le blocage CORS/Cloudflare du Wiki MediaWiki côté serveur.
 * Route : /api/wiki-sync
 */

const WIKI_API_BASE = 'https://vtm.paradoxwikis.com/api.php';
const WIKI_CATEGORY = 'Clans_of_London_cards';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  // CORS headers pour autoriser les appels depuis clans-of-london.vercel.app
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 1. Récupérer les membres de la catégorie (liste des cartes)
    const categoryUrl = `${WIKI_API_BASE}?action=query&list=categorymembers&cmtitle=Category:${WIKI_CATEGORY}&cmlimit=500&format=json`;

    const categoryRes = await fetch(categoryUrl, {
      headers: {
        'User-Agent': 'ClansOfLondon-App/1.0 (https://clans-of-london.vercel.app)',
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!categoryRes.ok) {
      throw new Error(`Wiki API responded with ${categoryRes.status}`);
    }

    const categoryData = await categoryRes.json();
    const members = categoryData?.query?.categorymembers || [];

    // 2. Extraire les titres et compter
    const cardTitles = members
      .filter(m => m.ns === 0) // namespace 0 = articles principaux
      .map(m => m.title);

    // 3. Retourner les métadonnées de sync
    return new Response(JSON.stringify({
      success: true,
      fetchedAt: new Date().toISOString(),
      wikiSource: `https://vtm.paradoxwikis.com/Category:${WIKI_CATEGORY}`,
      totalWikiCards: cardTitles.length,
      cardTitles: cardTitles,
    }), {
      headers: corsHeaders,
    });

  } catch (error) {
    // Fallback : retourner une réponse d'erreur propre
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      fetchedAt: new Date().toISOString(),
      wikiSource: `https://vtm.paradoxwikis.com/Category:${WIKI_CATEGORY}`,
      totalWikiCards: 0,
      cardTitles: [],
    }), {
      status: 503,
      headers: corsHeaders,
    });
  }
}
