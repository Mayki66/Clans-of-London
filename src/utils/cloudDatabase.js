import { createClient } from '@supabase/supabase-js';

const LOCAL_STORAGE_SUPABASE_CONFIG = 'col_supabase_config_v1';

export function cleanSupabaseUrl(url) {
  if (!url) return '';
  let cleaned = url.trim();
  cleaned = cleaned.replace(/\/+$/, '');
  cleaned = cleaned.replace(/\/rest\/v1\/?$/, '');
  cleaned = cleaned.replace(/\/rest\/?$/, '');
  return cleaned.replace(/\/+$/, '');
}

const DEFAULT_SUPABASE_URL = 'https://rlsyalcjgointnuyvqwg.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsc3lhbGNqZ29pbnRudXl2cXdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczMDUzNDAsImV4cCI6MjEwMjg4MTM0MH0.jON1BjPJTuTrJEsSLUJ9JdaSg3k13Razvi8m01LRXYw';

export function getSupabaseConfig() {
  const envUrl = import.meta.env?.VITE_SUPABASE_URL;
  const envKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

  if (envUrl && envKey) {
    return { url: cleanSupabaseUrl(envUrl), key: envKey.trim(), source: 'env' };
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SUPABASE_CONFIG);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.url && parsed.key) {
        return { url: cleanSupabaseUrl(parsed.url), key: parsed.key.trim(), source: 'localStorage' };
      }
    }
  } catch (e) {
    console.error("Error reading Supabase config", e);
  }

  return { url: DEFAULT_SUPABASE_URL, key: DEFAULT_SUPABASE_ANON_KEY, source: 'default' };
}

export function saveSupabaseConfig(url, key) {
  try {
    const cleanedUrl = cleanSupabaseUrl(url);
    const cleanedKey = key.trim();
    localStorage.setItem(LOCAL_STORAGE_SUPABASE_CONFIG, JSON.stringify({ url: cleanedUrl, key: cleanedKey }));
    supabaseInstance = null; // reset cached instance
  } catch (e) {
    console.error("Error saving Supabase config", e);
  }
}

let supabaseInstance = null;

export function getSupabaseClient() {
  const config = getSupabaseConfig();
  if (!config.url || !config.key) {
    return null;
  }

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(config.url, config.key);
    } catch (e) {
      console.error("Error creating Supabase client", e);
      return null;
    }
  }
  return supabaseInstance;
}

/**
 * Cloud Sync Functions
 */

export async function syncCloudVisit() {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    // Insert a visit log entry
    await supabase
      .from('col_visits')
      .insert([{ visited_at: new Date().toISOString(), user_agent: navigator.userAgent.slice(0, 80) }]);
  } catch (e) {
    console.warn("Cloud visit sync skipped", e.message);
  }
}

export async function syncCloudUser(pseudo, level = 1, rank = "Néophyte") {
  if (!pseudo || pseudo.trim() === '') return;
  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    const cleanPseudo = pseudo.trim();
    const now = new Date().toISOString();

    // Check if player exists
    const { data: existing } = await supabase
      .from('col_players')
      .select('id, pseudo, has_exported, export_count')
      .eq('pseudo', cleanPseudo)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('col_players')
        .update({
          last_active: now,
          level,
          rank
        })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('col_players')
        .insert([{
          pseudo: cleanPseudo,
          registered_at: now,
          last_active: now,
          level,
          rank,
          has_exported: false,
          export_count: 0
        }]);
    }
  } catch (e) {
    console.warn("Cloud user sync error", e.message);
  }
}

export async function syncCloudExport(pseudo, level = 1, rank = "Néophyte") {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    const cleanPseudo = (pseudo || 'Kindred').trim();
    const now = new Date().toISOString();

    const { data: existing } = await supabase
      .from('col_players')
      .select('id, pseudo, export_count')
      .eq('pseudo', cleanPseudo)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('col_players')
        .update({
          has_exported: true,
          export_count: (existing.export_count || 0) + 1,
          last_active: now
        })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('col_players')
        .insert([{
          pseudo: cleanPseudo,
          registered_at: now,
          last_active: now,
          level,
          rank,
          has_exported: true,
          export_count: 1
        }]);
    }
  } catch (e) {
    console.warn("Cloud export sync error", e.message);
  }
}

export async function fetchAllCloudTelemetry() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { connected: false, error: "Clé Supabase Anon manquante pour les visiteurs mondiaux." };
  }

  try {
    // 1. Fetch registered players
    const { data: players, error: playersError } = await supabase
      .from('col_players')
      .select('*')
      .order('last_active', { ascending: false });

    // 2. Fetch visit counts
    const { count: visitsCount, error: visitsError } = await supabase
      .from('col_visits')
      .select('*', { count: 'exact', head: true });

    if (playersError) {
      console.error("Error fetching players from Supabase", playersError);
      return { connected: false, error: `Erreur Supabase: ${playersError.message} (${playersError.details || 'Vérifiez les règles RLS'})` };
    }

    const totalExports = (players || []).reduce((acc, p) => acc + (p.has_exported ? (p.export_count || 1) : 0), 0);

    return {
      connected: true,
      totalVisits: (typeof visitsCount === 'number' && visitsCount > 0) ? visitsCount : (players?.length || 1),
      totalProfileExports: totalExports,
      registeredUsers: (players || []).map(p => ({
        id: p.id,
        pseudo: p.pseudo,
        registeredAt: p.registered_at ? new Date(p.registered_at).toLocaleDateString('fr-FR') : "Aujourd'hui",
        lastActive: p.last_active ? new Date(p.last_active).toLocaleDateString('fr-FR') : "Aujourd'hui",
        level: p.level || 1,
        rank: p.rank || "Néophyte",
        hasExported: !!p.has_exported,
        exportCount: p.export_count || 0
      }))
    };
  } catch (e) {
    console.error("Error fetching cloud telemetry", e);
    return { connected: false, error: e.message };
  }
}

/**
 * Synchronise les résultats d'un duel d'arène (victoires, défaites, points) dans col_players
 */
export async function syncCloudArenaMatch({ pseudo, result, pointsChange, newTotalPoints, level = 1, rank = "Néophyte" }) {
  if (!pseudo || pseudo.trim() === '') return;
  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    const cleanPseudo = pseudo.trim();
    const now = new Date().toISOString();

    const { data: existing } = await supabase
      .from('col_players')
      .select('id, pseudo, arena_points, level, rank, last_active')
      .eq('pseudo', cleanPseudo)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('col_players')
        .update({
          arena_points: newTotalPoints,
          level: Math.max(existing.level || 1, level),
          rank: rank || existing.rank || "Néophyte",
          last_active: now
        })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('col_players')
        .insert([{
          pseudo: cleanPseudo,
          arena_points: newTotalPoints,
          level,
          rank,
          registered_at: now,
          last_active: now,
          has_exported: false,
          export_count: 0
        }]);
    }
  } catch (e) {
    console.warn("syncCloudArenaMatch error", e.message);
  }
}

/**
 * Récupère le classement public (Leaderboard) des joueurs de Londres
 */
export async function fetchCloudLeaderboard() {
  const supabase = getSupabaseClient();
  
  // Classement par défaut / fallback si hors-ligne
  const defaultLeaderboard = [
    { rank: 1, pseudo: "Mayki", arenaPoints: 1250, level: 14, vampireRank: "Ancilla de Soho", clan: "Brujah" },
    { rank: 2, pseudo: "Julian Lys", arenaPoints: 980, level: 11, vampireRank: "Nouveau-Né de Whitechapel", clan: "Toreador" },
    { rank: 3, pseudo: "Lady Elizabeth", arenaPoints: 850, level: 9, vampireRank: "Nouveau-Né de la City", clan: "Ventrue" },
    { rank: 4, pseudo: "Klinklecut", arenaPoints: 720, level: 8, vampireRank: "Nouveau-Né de Westminster", clan: "Toreador" },
    { rank: 5, pseudo: "The Huntress", arenaPoints: 610, level: 6, vampireRank: "Nouveau-Né de Hampstead", clan: "Gangrel" }
  ];

  if (!supabase) {
    return defaultLeaderboard;
  }

  try {
    const { data: players, error } = await supabase
      .from('col_players')
      .select('id, pseudo, arena_points, level, rank, last_active')
      .order('arena_points', { ascending: false, nullsFirst: false })
      .limit(50);

    if (error || !players || players.length === 0) {
      return defaultLeaderboard;
    }

    return players.map((p, index) => {
      const points = p.arena_points !== undefined && p.arena_points !== null ? p.arena_points : 100;
      let vampireTitle = "Néophyte";
      if (points >= 2000) vampireTitle = "Prince de Londres 👑";
      else if (points >= 1500) vampireTitle = "Primogène ⚜️";
      else if (points >= 1000) vampireTitle = "Ancilla 🗡️";
      else if (points >= 500) vampireTitle = "Nouveau-Né 🛡️";
      else vampireTitle = "Néophyte 🩸";

      return {
        id: p.id,
        rank: index + 1,
        pseudo: p.pseudo || "Kindred Anonyme",
        arenaPoints: points,
        level: p.level || 1,
        vampireRank: p.rank || vampireTitle,
        lastActive: p.last_active ? new Date(p.last_active).toLocaleDateString('fr-FR') : "Récemment"
      };
    });
  } catch (err) {
    console.error("fetchCloudLeaderboard error", err);
    return defaultLeaderboard;
  }
}

