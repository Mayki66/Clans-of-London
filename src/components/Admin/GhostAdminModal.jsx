import React, { useState } from 'react';
import { 
  ShieldAlert, Users, Download, Activity, Eye, X, CheckCircle2, 
  Clock, Award, Lock, RefreshCw, Layers 
} from 'lucide-react';
import { getTelemetryData } from '../../utils/adminTelemetry';

export default function GhostAdminModal({ onClose }) {
  const [telemetry, setTelemetry] = useState(getTelemetryData());
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTelemetry(getTelemetryData());
    setTimeout(() => setRefreshing(false), 500);
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
              <div className="flex items-center space-x-2">
                <h2 className="font-gothic font-extrabold text-2xl text-gray-100 tracking-wider">
                  Espace Fantôme • Administration Privée
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-950/80 border border-red-500/60 text-red-300">
                  MAYKI EXCLUSIVE
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono">
                Télémétrie en temps réel & Registre des Pseudos Joueurs
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
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

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Total Visits & Clicks */}
          <div className="p-5 rounded-2xl bg-[#0f121a] border border-blue-500/30 space-y-2 relative overflow-hidden shadow-lg">
            <div className="flex items-center justify-between text-blue-400">
              <span className="text-xs font-mono uppercase font-bold">Visites / Lancements</span>
              <Activity className="w-4 h-4" />
            </div>
            <div className="text-3xl font-extrabold font-mono text-gray-100">
              {telemetry.totalVisits || 1}
            </div>
            <p className="text-[11px] text-gray-400 font-sans">
              Interactions globales : <strong className="text-blue-300">{telemetry.totalInteractions || 0} clics</strong>
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
              Pseudos uniques choisis dans l'application
            </p>
          </div>
        </div>

        {/* Table of Registered Users */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-gothic font-bold text-lg text-gray-100 flex items-center space-x-2">
              <Users className="w-5 h-5 text-amber-400" />
              <span>Registre des Joueurs & Pseudos Choisis</span>
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
                  <th className="px-4 py-3">Date d'Enregistrement</th>
                  <th className="px-4 py-3">Niveau / Rang</th>
                  <th className="px-4 py-3 text-right">Export JSON</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {telemetry.registeredUsers?.map((user, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-mono text-gray-500">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <span className="font-gothic font-bold text-sm text-amber-300">
                        {user.pseudo}
                      </span>
                      {user.pseudo === 'Mayki' && (
                        <span className="ml-2 px-1.5 py-0.2 rounded text-[9px] font-mono bg-red-950 text-red-300 border border-red-500/40">
                          Créateur
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-400">
                      {user.registeredAt || "Aujourd'hui"}
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-300">
                      Niv. {user.level || 1} • <span className="text-gray-400">{user.rank || "Néophyte"}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {user.hasExported ? (
                        <span className="inline-flex items-center space-x-1 text-emerald-400 font-mono text-[11px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Oui</span>
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
