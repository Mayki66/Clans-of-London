/**
 * Clans of London — Cloud Service (Supabase)
 *
 * Toutes les operations cloud (Supabase) sont centralisees ici.
 * Les credentials sont lus UNIQUEMENT depuis les variables d'environnement
 * (Vercel Env Vars en production, .env.local en developpement).
 * Aucune cle secrete n'est codee en dur dans le code source.
 */

import { createClient } from '@supabase/supabase-js';
import { ENV, isCloudAvailable } from '../config/env';
import { LS_SUPABASE_CFG } from '../config/constants';
import { DEFAULT_LEADERBOARD } from '../config/constants';
import { storageGet, storageSet, storageGetRaw } from './storageService';

// Nettoyage de l'URL Supabase
export function cleanSupabaseUrl(url) {
  return cleanUrl(url);
}

function cleanUrl(url) {
  if (!url) return '';
  return url.trim()
    .replace(/\/+$/, '')
    .replace(/\/rest\/v1\/?$/, '')
    .replace(/\/rest\/?$/, '')
    .replace(/\/+$/, '');
}

// Lecture de la configuration (env > localStorage > absent)
export function getSupabaseConfig() {
  // Priorite 1 : variables d'environnement Vercel
  if (ENV.supabaseUrl && ENV.supabaseAnonKey) {
    return { url: cleanUrl(ENV.supabaseUrl), key: ENV.supabaseAnonKey.trim(), source: 'env' };
  }
  // Priorite 2 : configuration sauvegardee par l'admin via le panneau
  const saved = storageGet(LS_SUPABASE_CFG);
  if (saved?.url && saved?.key) {
    return { url: cleanUrl(saved.url), key: saved.key.trim(), source: 'localStorage' };
  }
  return { url: null, key: null, source: 'none' };
}

export function saveSupabaseConfig(url, key) {
  storageSet(LS_SUPABASE_CFG, { url: cleanUrl(url), key: key.trim() });
  supabaseInstance = null; // reset de l'instance en cache
}

let supabaseInstance = null;

export function getSupabaseClient() {
  const config = getSupabaseConfig();
  if (!config.url || !config.key) return null;
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(config.url, config.key);
    } catch (e) {
      console.error('[CloudService] Impossible de creer le client Supabase:', e);
      return null;
    }
  }
  return supabaseInstance;
}

// ─── Visites ─────────────────────────────────────────────────────────────────

export async function syncCloudVisit(visitorId = 'anon') {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  try {
    await supabase.from('col_visits').insert([{
      visited_at: new Date().toISOString(),
      visitor_id: visitorId,
      user_agent: navigator.userAgent.slice(0, 80)
    }]);
  } catch (e) {
    console.warn('[CloudService] syncCloudVisit skipped:', e.message);
  }
}

// ─── Joueurs ─────────────────────────────────────────────────────────────────

export async function syncCloudUser(pseudo, level = 1, rank = 'Neophyte') {
  if (!pseudo?.trim()) return;
  const supabase = getSupabaseClient();
  if (!supabase) return;
  try {
    const cleanPseudo = pseudo.trim();
    const now = new Date().toISOString();
    const { data: existing } = await supabase
      .from('col_players').select('id, pseudo, has_exported, export_count')
      .eq('pseudo', cleanPseudo).maybeSingle();
    if (existing) {
      await supabase.from('col_players').update({ last_active: now, level, rank }).eq('id', existing.id);
    } else {
      await supabase.from('col_players').insert([{
        pseudo: cleanPseudo, registered_at: now, last_active: now,
        level, rank, has_exported: false, export_count: 0
      }]);
    }
  } catch (e) {
    console.warn('[CloudService] syncCloudUser error:', e.message);
  }
}

export async function syncCloudExport(pseudo, level = 1, rank = 'Neophyte') {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  try {
    const cleanPseudo = (pseudo || 'Kindred').trim();
    const now = new Date().toISOString();
    const { data: existing } = await supabase
      .from('col_players').select('id, export_count').eq('pseudo', cleanPseudo).maybeSingle();
    if (existing) {
      await supabase.from('col_players').update({
        has_exported: true, export_count: (existing.export_count || 0) + 1, last_active: now
      }).eq('id', existing.id);
    } else {
      await supabase.from('col_players').insert([{
        pseudo: cleanPseudo, registered_at: now, last_active: now,
        level, rank, has_exported: true, export_count: 1
      }]);
    }
  } catch (e) {
    console.warn('[CloudService] syncCloudExport error:', e.message);
  }
}

// ─── Telemetrie Admin ─────────────────────────────────────────────────────────

export async function fetchAllCloudTelemetry() {
  const supabase = getSupabaseClient();
  if (!supabase) return { connected: false, error: 'Cle Supabase Anon manquante.' };
  try {
    const { data: players, error: playersError } = await supabase
      .from('col_players').select('*').order('last_active', { ascending: false });
    const { data: visitsList, error: visitsError } = await supabase
      .from('col_visits').select('id, visitor_id, user_agent');
    if (playersError) return { connected: false, error: `Erreur Supabase: ${playersError.message}` };

    let uniqueVisitorsCount = 1;
    let totalVisitsCount = 1;
    if (!visitsError && Array.isArray(visitsList)) {
      totalVisitsCount = visitsList.length;
      const uniqueIds = new Set();
      visitsList.forEach(v => {
        if (v.visitor_id && v.visitor_id !== 'anon' && !v.visitor_id.startsWith('legacy_')) {
          uniqueIds.add(v.visitor_id);
        } else if (v.user_agent) {
          uniqueIds.add(v.user_agent);
        } else {
          uniqueIds.add(`v_${v.id}`);
        }
      });
      uniqueVisitorsCount = Math.max(uniqueIds.size, players?.length || 1);
    }

    const totalExports = (players || []).reduce((acc, p) => acc + (p.has_exported ? (p.export_count || 1) : 0), 0);
    return {
      connected: true,
      uniqueVisitors: uniqueVisitorsCount,
      totalVisits: totalVisitsCount,
      totalProfileExports: totalExports,
      registeredUsers: (players || []).map(p => ({
        id: p.id, pseudo: p.pseudo,
        registeredAt: p.registered_at ? new Date(p.registered_at).toLocaleDateString('fr-FR') : "Aujourd'hui",
        lastActive:   p.last_active   ? new Date(p.last_active).toLocaleDateString('fr-FR')   : "Aujourd'hui",
        level: p.level || 1, rank: p.rank || 'Neophyte',
        hasExported: !!p.has_exported, exportCount: p.export_count || 0
      }))
    };
  } catch (e) {
    console.error('[CloudService] fetchAllCloudTelemetry error:', e);
    return { connected: false, error: e.message };
  }
}

// ─── Arena ────────────────────────────────────────────────────────────────────

export async function syncCloudArenaMatch({ pseudo, result, pointsChange, newTotalPoints, level = 1, rank = 'Neophyte' }) {
  if (!pseudo?.trim()) return;
  const supabase = getSupabaseClient();
  if (!supabase) return;
  try {
    const cleanPseudo = pseudo.trim();
    const now = new Date().toISOString();
    const { data: existing } = await supabase
      .from('col_players').select('id, pseudo, arena_points, level, rank, last_active')
      .eq('pseudo', cleanPseudo).maybeSingle();
    if (existing) {
      await supabase.from('col_players').update({
        arena_points: newTotalPoints,
        level: Math.max(existing.level || 1, level),
        rank: rank || existing.rank || 'Neophyte',
        last_active: now
      }).eq('id', existing.id);
    } else {
      await supabase.from('col_players').insert([{
        pseudo: cleanPseudo, arena_points: newTotalPoints, level, rank,
        registered_at: now, last_active: now, has_exported: false, export_count: 0
      }]);
    }
  } catch (e) {
    console.warn('[CloudService] syncCloudArenaMatch error:', e.message);
  }
}

export async function fetchCloudLeaderboard() {
  const supabase = getSupabaseClient();
  if (!supabase) return DEFAULT_LEADERBOARD;
  try {
    const { data: players, error } = await supabase
      .from('col_players').select('id, pseudo, arena_points, level, rank, last_active')
      .order('arena_points', { ascending: false, nullsFirst: false }).limit(50);
    if (error || !players || players.length === 0) return DEFAULT_LEADERBOARD;
    return players.map((p, index) => {
      const points = p.arena_points ?? 100;
      let vampireTitle = 'Neophyte';
      if (points >= 2000)      vampireTitle = 'Prince de Londres';
      else if (points >= 1500) vampireTitle = 'Primogene';
      else if (points >= 1000) vampireTitle = 'Ancilla';
      else if (points >= 500)  vampireTitle = 'Nouveau-Ne';
      return {
        id: p.id, rank: index + 1, pseudo: p.pseudo || 'Kindred Anonyme',
        arenaPoints: points, level: p.level || 1,
        vampireRank: p.rank || vampireTitle,
        lastActive: p.last_active ? new Date(p.last_active).toLocaleDateString('fr-FR') : 'Recemment'
      };
    });
  } catch (err) {
    console.error('[CloudService] fetchCloudLeaderboard error:', err);
    return DEFAULT_LEADERBOARD;
  }
}

// ─── Compat aliases (pour migration progressive) ──────────────────────────────
// Les anciens fichiers qui importent depuis cloudDatabase.js peuvent etre
// migres progressivement en remplacant l'import par cloudService.
export { getSupabaseConfig as getSupabaseConfigLegacy };
export { saveSupabaseConfig as saveSupabaseConfigLegacy };
export { getSupabaseClient as getSupabaseClientLegacy };
