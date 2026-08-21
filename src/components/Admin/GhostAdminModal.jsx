import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Users, Download, Activity, Eye, X, CheckCircle2, 
  Clock, Award, Lock, RefreshCw, Layers, Database, Settings, ExternalLink, Key, Check, Copy
} from 'lucide-react';
import { getTelemetryData } from '../../utils/adminTelemetry';
import { fetchAllCloudTelemetry, getSupabaseConfig, saveSupabaseConfig } from '../../utils/cloudDatabase';

export default function GhostAdminModal({ onClose }) {
  const [telemetry, setTelemetry] = useState(getTelemetryData());
  const [cloudConnected, setCloudConnected] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [configSaved, setConfigSaved] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const loadData = async () => {
    setRefreshing(true);
    const cloudData = await fetchAllCloudTelemetry();
    if (cloudData && cloudData.connected) {
      setTelemetry(prev => ({
        ...prev,
        totalVisits: cloudData.totalVisits,
        totalProfileExports: cloudData.totalProfileExports,
        registeredUsers: cloudData.registeredUsers
      }));
      setCloudConnected(true);
    } else {
      setTelemetry(getTelemetryData());
      setCloudConnected(false);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    const config = getSupabaseConfig();
    setSupabaseUrl(config.url || '');
    setSupabaseKey(config.key || '');
    loadData();
  }, []);

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    saveSupabaseConfig(supabaseUrl, supabaseKey);
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 2000);
    await loadData();
  };

  const handleCopySql = () => {
    const sql = `-- Script SQL Supabase pour Clans of London
CREATE TABLE IF NOT EXISTS col_players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pseudo TEXT NOT NULL,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ DEFAULT NOW(),
  level INT DEFAULT 1,
  rank TEXT DEFAULT 'Néophyte',
  has_exported BOOLEAN DEFAULT FALSE,
  export_count INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS col_visits (
  id BIGSERIAL PRIMARY KEY,
  visited_at TIMESTAMPTZ DEFAULT NOW(),
  user_agent TEXT
);

-- Politiques de sécurité (Lecture & Écriture publiques)
ALTER TABLE col_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE col_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read col_players" ON col_players FOR SELECT USING (true);
CREATE POLICY "Public insert/update col_players" ON col_players FOR ALL USING (true);

CREATE POLICY "Public read col_visits" ON col_visits FOR SELECT USING (true);
CREATE POLICY "Public insert col_visits" ON col_visits FOR INSERT WITH CHECK (true);
`;
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleExportTelemetryJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(telemetry, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `clans_of_london_admin_telemetry_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-fadeIn">
      {/* Ghost Ambient Red Glow */}
      <div className="absolute w-[600px] h-[600px] bg-red-800/15 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0a0c12] border-2 border-red-600/50 shadow-[0_0_80px_rgba(220,38,38,0.35)] p-6 sm:p-8 space-y-6 text-gray-200">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-700 via-black to-slate-900 border-2 border-amber-500/80 flex items-center justify-center shadow-blood text-2xl">
              👁️
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap">
                <h2 className="font-gothic font-extrabold text-2xl text-gray-100 tracking-wider">
                  Espace Fantôme • Administration Privée
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-950/80 border border-red-500/60 text-red-300">
                  MAYKI EXCLUSIVE
                </span>
                {cloudConnected ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Cloud Supabase Connecté</span>
                  </span>
                ) : (
                  <button
                    onClick={() => setShowConfig(!showConfig)}
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-950/80 hover:bg-amber-900 border border-amber-500/60 text-amber-300 transition-all flex items-center space-x-1"
                  >
                    <span>⚡ Configurer Base Cloud</span>
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-400 font-mono">
                {cloudConnected 
                  ? "Télémétrie Cloud Globale en direct (visiteurs mondiaux & Discord)" 
                  : "Télémétrie locale. Cliquez sur 'Configurer Base Cloud' pour synchroniser tous les visiteurs mondiaux."}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className={`p-2 rounded-xl border transition-all ${showConfig ? 'bg-amber-950 text-amber-200 border-amber-500' : 'bg-[#141824] hover:bg-[#1f2538] border-white/15 text-gray-300 hover:text-white'}`}
              title="Paramètres de base de données Cloud"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={loadData}
              className={`p-2 rounded-xl bg-[#141824] hover:bg-[#1f2538] border border-white/15 text-gray-300 hover:text-white transition-all ${refreshing ? 'animate-spin' : ''}`}
              title="Rafraîchir les métriques"
            >
              <RefreshCw className="w-4 h-4 text-amber-400" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-200 hover:text-white transition-all"
              title="Fermer la session"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cloud Config Accordion */}
        {showConfig && (
          <div className="p-5 rounded-2xl bg-[#090b10] border border-amber-500/40 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-amber-400" />
                <h3 className="font-gothic font-bold text-sm text-gray-100">
                  Connexion Base de Données Cloud (Supabase Gratuit)
                </h3>
              </div>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-xs text-amber-400 hover:underline font-mono"
              >
                <span>Ouvrir Supabase</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed font-sans">
              Pour recevoir tous les pseudos et exports de données des utilisateurs du Discord en temps réel, créez un projet gratuit sur <strong>Supabase</strong> et collez vos 2 clés ci-dessous :
            </p>

            <form onSubmit={handleSaveConfig} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-gray-400 mb-1">
                  Project URL (ex: https://xyz.supabase.co)
                </label>
                <input
                  type="url"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://votre-projet.supabase.co"
                  className="w-full px-3 py-2 rounded-xl bg-[#141824] border border-white/15 text-xs text-gray-200 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-400 mb-1">
                  Anon / Public Key (eyJhbGciOiJIUzI1Ni...)
                </label>
                <input
                  type="password"
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                  className="w-full px-3 py-2 rounded-xl bg-[#141824] border border-white/15 text-xs text-gray-200 font-mono"
                  required
                />
              </div>

              <div className="sm:col-span-2 flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#141824] hover:bg-[#1c2233] border border-white/15 text-xs text-gray-300 font-mono"
                  title="Copier le script SQL pour créer les tables automatiquement dans le SQL Editor de Supabase"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{copiedSql ? "Script SQL Copié !" : "Copier le Script SQL des Tables"}</span>
                </button>

                <button
                  type="submit"
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white font-gothic font-bold text-xs shadow-sm"
                >
                  {configSaved ? <Check className="w-4 h-4" /> : null}
                  <span>{configSaved ? "Connecté & Enregistré !" : "Activer la Synchronisation Cloud"}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Total Visits & Clicks */}
          <div className="p-5 rounded-2xl bg-[#0f121a] border border-blue-500/30 space-y-2 relative overflow-hidden shadow-lg">
            <div className="flex items-center justify-between text-blue-400">
              <span className="text-xs font-mono uppercase font-bold">Visites Globales</span>
              <Activity className="w-4 h-4" />
            </div>
            <div className="text-3xl font-extrabold font-mono text-gray-100">
              {telemetry.totalVisits || 1}
            </div>
            <p className="text-[11px] text-gray-400 font-sans">
              {cloudConnected ? "Comptabilisées en temps réel" : "Comptabilisées sur ce navigateur"}
            </p>
          </div>

          {/* Accounts & JSON Exports */}
          <div className="p-5 rounded-2xl bg-[#0f121a] border border-emerald-500/30 space-y-2 relative overflow-hidden shadow-lg">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="text-xs font-mono uppercase font-bold">Profils Exportés</span>
              <Download className="w-4 h-4" />
            </div>
            <div className="text-3xl font-extrabold font-mono text-gray-100">
              {telemetry.totalProfileExports || 0}
            </div>
            <p className="text-[11px] text-gray-400 font-sans">
              Téléchargements de fichiers collection .json
            </p>
          </div>

          {/* Registered Nicknames Count */}
          <div className="p-5 rounded-2xl bg-[#0f121a] border border-amber-500/30 space-y-2 relative overflow-hidden shadow-lg">
            <div className="flex items-center justify-between text-amber-400">
              <span className="text-xs font-mono uppercase font-bold">Joueurs Enregistrés</span>
              <Users className="w-4 h-4" />
            </div>
            <div className="text-3xl font-extrabold font-mono text-gray-100">
              {telemetry.registeredUsers?.length || 0}
            </div>
            <p className="text-[11px] text-gray-400 font-sans">
              Pseudos uniques enregistrés
            </p>
          </div>
        </div>

        {/* Table of Registered Users */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-gothic font-bold text-lg text-gray-100 flex items-center space-x-2">
              <Users className="w-5 h-5 text-amber-400" />
              <span>Registre des Joueurs & Pseudos Choisis ({telemetry.registeredUsers?.length || 0})</span>
            </h3>

            <button
              onClick={handleExportTelemetryJSON}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#141824] hover:bg-[#1f2538] border border-white/15 text-xs text-gray-300 hover:text-white font-gothic transition-all"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Exporter le Registre (.json)</span>
            </button>
          </div>

          <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#0d0f17]">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#121520] border-b border-white/10 text-gray-400 font-mono uppercase text-[10px]">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Pseudo Joueur</th>
                  <th className="px-4 py-3">Première Visite</th>
                  <th className="px-4 py-3">Dernière Activité</th>
                  <th className="px-4 py-3">Niveau / Rang</th>
                  <th className="px-4 py-3 text-right">Export JSON</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {telemetry.registeredUsers?.map((user, idx) => (
                  <tr key={user.id || idx} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-mono text-gray-500">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <span className="font-gothic font-bold text-sm text-amber-300">
                        {user.pseudo}
                      </span>
                      {user.pseudo === 'Mayki' && (
                        <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] font-mono bg-red-950 text-red-300 border border-red-500/40">
                          Créateur
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-400">
                      {user.registeredAt || "Aujourd'hui"}
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-400">
                      {user.lastActive || "Aujourd'hui"}
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-300">
                      Niv. {user.level || 1} • <span className="text-gray-400">{user.rank || "Néophyte"}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {user.hasExported ? (
                        <span className="inline-flex items-center space-x-1 text-emerald-400 font-mono text-[11px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Oui {user.exportCount ? `(${user.exportCount})` : ''}</span>
                        </span>
                      ) : (
                        <span className="text-gray-600 font-mono text-[11px]">Non</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-500 font-mono">
          <span>Session Administrateur active</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-red-950 hover:bg-red-900 border border-red-500 text-white font-gothic font-bold transition-all shadow-blood"
          >
            Quitter l'Espace Administrateur
          </button>
        </div>

      </div>
    </div>
  );
}
