import React from 'react';
import { Droplets, Shield, Sparkles, PieChart, BarChart3, Users, Zap } from 'lucide-react';
import { CLANS, ARCHETYPES } from '../../data/clansData';

export default function DeckStats({ deckCards, lang = 'fr', t }) {
  const totalCount = deckCards.length;

  if (totalCount === 0) {
    return (
      <div className="glass-panel rounded-2xl p-6 text-center border border-white/10 text-gray-500">
        <PieChart className="w-10 h-10 mx-auto text-gray-600 mb-2 opacity-50" />
        <p className="text-sm font-gothic">{t?.stats?.emptyMessage || "Ajoutez des cartes à votre deck pour afficher les analyses et courbes."}</p>
      </div>
    );
  }

  // Calculate Blood curve (1 to 7+)
  const curve = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, '7+': 0 };
  let totalCost = 0;
  let totalPower = 0;

  // Clan breakdown
  const clanCounts = {};
  // Archetype breakdown
  const archetypeCounts = {};
  // Type breakdown
  const typeCounts = { Vampire: 0, Mortal: 0, Retainer: 0, Tactic: 0 };

  deckCards.forEach(card => {
    // Cost
    const costKey = card.cost >= 7 ? '7+' : card.cost;
    curve[costKey] = (curve[costKey] || 0) + 1;
    totalCost += card.cost;
    totalPower += card.power;

    // Clan
    clanCounts[card.clan] = (clanCounts[card.clan] || 0) + 1;

    // Archetype
    if (card.archetype) {
      archetypeCounts[card.archetype] = (archetypeCounts[card.archetype] || 0) + 1;
    }

    // Type
    if (typeCounts[card.type] !== undefined) {
      typeCounts[card.type]++;
    }
  });

  const avgCost = (totalCost / totalCount).toFixed(1);
  const avgPower = (totalPower / totalCount).toFixed(1);
  const maxCurveVal = Math.max(...Object.values(curve), 1);

  // Dominant Clan & Archetype
  const dominantClan = Object.entries(clanCounts).sort((a, b) => b[1] - a[1])[0] || ['-', 0];
  const dominantArch = Object.entries(archetypeCounts).sort((a, b) => b[1] - a[1])[0] || ['-', 0];

  return (
    <div className="glass-panel rounded-2xl p-5 space-y-5 border border-white/10 shadow-2xl">
      {/* Header Stat Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 rounded-xl bg-[#0c0e15] border border-white/5 text-center">
          <div className="flex items-center justify-center space-x-1 text-red-400 text-xs font-semibold">
            <Droplets className="w-3.5 h-3.5" />
            <span>{t?.stats?.avgCost || "Coût Moyen"}</span>
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1">{avgCost}</div>
        </div>

        <div className="p-3 rounded-xl bg-[#0c0e15] border border-white/5 text-center">
          <div className="flex items-center justify-center space-x-1 text-amber-400 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5" />
            <span>{t?.stats?.avgPower || "Puissance Moy."}</span>
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1">{avgPower}</div>
        </div>

        <div className="p-3 rounded-xl bg-[#0c0e15] border border-white/5 text-center">
          <div className="flex items-center justify-center space-x-1 text-purple-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>{t?.stats?.dominantClan || "Clan Majeur"}</span>
          </div>
          <div className="text-sm font-bold text-white mt-1 truncate">{dominantClan[0]} ({dominantClan[1]})</div>
        </div>

        <div className="p-3 rounded-xl bg-[#0c0e15] border border-white/5 text-center">
          <div className="flex items-center justify-center space-x-1 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t?.stats?.synergy || "Synergie"}</span>
          </div>
          <div className="text-sm font-bold text-white mt-1 truncate">{dominantArch[0]} ({dominantArch[1]})</div>
        </div>
      </div>

      {/* Blood Mana Curve Histogram */}
      <div className="space-y-2 pt-2 border-t border-white/10">
        <div className="flex items-center justify-between text-xs text-gray-300 font-gothic font-semibold uppercase tracking-wider">
          <span className="flex items-center space-x-1.5">
            <BarChart3 className="w-4 h-4 text-red-500" />
            <span>{t?.stats?.bloodCurveTitle || "Courbe de Coût en Sang"}</span>
          </span>
          <span className="text-[11px] font-mono text-gray-500">{totalCount} {t?.stats?.cardCount || "cartes"}</span>
        </div>

        <div className="h-28 flex items-end justify-between gap-2 pt-4 px-2 bg-[#090b10] rounded-xl border border-white/5">
          {Object.entries(curve).map(([cost, count]) => {
            const heightPercent = (count / maxCurveVal) * 100;
            return (
              <div key={cost} className="flex-1 flex flex-col items-center h-full justify-end group">
                <span className="text-[10px] font-mono font-bold text-gray-400 mb-1 group-hover:text-white transition-colors">
                  {count > 0 ? count : ''}
                </span>
                <div 
                  className="w-full max-w-[28px] rounded-t-md bg-gradient-to-t from-red-950 via-red-700 to-rose-500 border-t border-red-400/80 transition-all duration-300 group-hover:brightness-125"
                  style={{ height: `${Math.max(heightPercent, 4)}%` }}
                />
                <div className="mt-2 text-xs font-mono font-bold text-gray-400 border-t border-white/10 w-full text-center pt-1">
                  {cost}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Clans Distribution & Archetypes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/10">
        
        {/* Clan breakdown bars */}
        <div className="space-y-2">
          <h4 className="text-xs font-gothic font-semibold uppercase tracking-wider text-gray-300 flex items-center space-x-1.5">
            <Users className="w-4 h-4 text-amber-400" />
            <span>{t?.stats?.clanDistribution || "Répartition par Clan"}</span>
          </h4>
          <div className="space-y-1.5 bg-[#090b10] p-3 rounded-xl border border-white/5 max-h-40 overflow-y-auto">
            {Object.entries(clanCounts).map(([clanName, count]) => {
              const clanInfo = CLANS[clanName] || CLANS.Mortal;
              const pct = Math.round((count / totalCount) * 100);
              return (
                <div key={clanName} className="space-y-0.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold" style={{ color: clanInfo.themeColor }}>
                      {clanName}
                    </span>
                    <span className="font-mono text-gray-400">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${pct}%`,
                        backgroundColor: clanInfo.themeColor 
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card Types & Archetypes */}
        <div className="space-y-2">
          <h4 className="text-xs font-gothic font-semibold uppercase tracking-wider text-gray-300 flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>{t?.stats?.archetypeBreakdown || "Répartition par Archétype"}</span>
          </h4>
          <div className="space-y-1.5 bg-[#090b10] p-3 rounded-xl border border-white/5 max-h-40 overflow-y-auto">
            {Object.entries(archetypeCounts).map(([archName, count]) => {
              const archInfo = ARCHETYPES.find(a => a.id === archName) || { color: '#a855f7' };
              const pct = Math.round((count / totalCount) * 100);
              return (
                <div key={archName} className="space-y-0.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-gray-200">
                      {archName}
                    </span>
                    <span className="font-mono text-gray-400">
                      {count} {t?.stats?.cardCount || "cartes"} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${pct}%`,
                        backgroundColor: archInfo.color 
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
