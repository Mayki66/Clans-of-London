import React, { useState } from 'react';
import { Trophy, Sparkles, Layers, ArrowRight, Shield, Droplets, CheckCircle2, XCircle, Filter, Check, Eye, RefreshCw, Zap, HelpCircle } from 'lucide-react';
import { META_DECKS } from '../../data/metaDecks';
import { CARDS_DATA } from '../../data/cardsData';
import { CLANS } from '../../data/clansData';
import { buildSubstitutedDeck, getSmartSubstitutes } from '../../utils/deckSubstitutions';

export default function MetaDecksView({ onLoadMetaDeck, onInspectCard, ownedCardIds = [] }) {
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'ready' | 'almost'
  const [expandedSubstitutions, setExpandedSubstitutions] = useState({});

  const toggleSubstitutions = (deckId) => {
    setExpandedSubstitutions(prev => ({
      ...prev,
      [deckId]: !prev[deckId]
    }));
  };

  const getTierBadge = (tier) => {
    switch (tier) {
      case 'S-Tier':
        return 'bg-gradient-to-r from-red-600 to-amber-600 text-white border-amber-400 shadow-gold';
      case 'A-Tier':
        return 'bg-purple-900 text-purple-200 border-purple-400';
      case 'B-Tier':
        return 'bg-blue-900 text-blue-200 border-blue-400';
      default:
        return 'bg-slate-800 text-gray-300 border-slate-700';
    }
  };

  // Compute deck completion metrics and smart substitutions
  const enhancedDecks = META_DECKS.map((deck) => {
    const cardsInDeck = deck.cardIds.map(id => CARDS_DATA.find(c => c.id === id)).filter(Boolean);
    const ownedCount = cardsInDeck.filter(c => ownedCardIds.includes(c.id)).length;
    const isFullyReady = ownedCount === 15 && cardsInDeck.length === 15;
    const isAlmostReady = ownedCount >= 10 && !isFullyReady;
    const completionPercent = Math.round((ownedCount / (cardsInDeck.length || 15)) * 100);
    const avgCost = (cardsInDeck.reduce((acc, c) => acc + c.cost, 0) / (cardsInDeck.length || 1)).toFixed(1);
    const totalPower = cardsInDeck.reduce((acc, c) => acc + c.power, 0);

    // Compute smart replacements for missing cards
    const { completedCardIds, substitutions } = buildSubstitutedDeck(deck, ownedCardIds);

    return {
      ...deck,
      cardsInDeck,
      ownedCount,
      isFullyReady,
      isAlmostReady,
      completionPercent,
      avgCost,
      totalPower,
      completedCardIds,
      substitutions
    };
  });

  const readyDecksCount = enhancedDecks.filter(d => d.isFullyReady).length;
  const almostDecksCount = enhancedDecks.filter(d => d.isAlmostReady).length;

  const filteredDecks = enhancedDecks.filter(deck => {
    if (filterMode === 'ready') return deck.isFullyReady;
    if (filterMode === 'almost') return deck.isAlmostReady || deck.isFullyReady;
    return true;
  });

  const handleLoadWithSubstitutions = (deck) => {
    onLoadMetaDeck?.({
      ...deck,
      name: `${deck.name} (Adapté)`,
      cardIds: deck.completedCardIds
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative rounded-2xl overflow-hidden glass-panel p-6 md:p-8 border border-white/10 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Méta Compétitive & Tier List</span>
          </div>
          <h1 className="font-gothic font-extrabold text-3xl md:text-4xl text-gray-100">
            Decks Méta Officiels (15 Cartes)
          </h1>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed">
            Compositions optimisées du format compétitif de Londres. Vos cartes possédées sont <strong className="text-emerald-400">surlignées en vert</strong>. S'il vous manque des cartes, l'application vous propose automatiquement les <strong>meilleurs remplacements équivalents</strong> parmi vos cartes possédées !
          </p>
        </div>
      </div>

      {/* Filter / Constructibility Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs font-gothic text-gray-300">
          <Filter className="w-4 h-4 text-amber-400" />
          <span>Filtrer par constructibilité :</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
              filterMode === 'all'
                ? 'bg-gradient-to-r from-red-800 to-rose-900 text-white border-red-500 shadow-blood'
                : 'bg-[#10131d] text-gray-400 border-white/10 hover:text-white'
            }`}
          >
            Tous les Decks ({META_DECKS.length})
          </button>

          <button
            onClick={() => setFilterMode('ready')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
              filterMode === 'ready'
                ? 'bg-emerald-900 text-emerald-200 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                : 'bg-[#10131d] text-emerald-400/80 border-emerald-500/30 hover:bg-emerald-950'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>✨ 100% Constructibles ({readyDecksCount})</span>
          </button>

          <button
            onClick={() => setFilterMode('almost')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
              filterMode === 'almost'
                ? 'bg-amber-900 text-amber-200 border-amber-400 shadow-gold'
                : 'bg-[#10131d] text-amber-400/80 border-amber-500/30 hover:bg-amber-950'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>⚡ Presque Complets 10+ ({almostDecksCount + readyDecksCount})</span>
          </button>
        </div>
      </div>

      {/* Meta Decks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDecks.map((deck) => {
          const clanInfo = CLANS[deck.clan] || CLANS.Mortal;
          const isExpanded = !!expandedSubstitutions[deck.id];
          const missingCount = 15 - deck.ownedCount;

          return (
            <div
              key={deck.id}
              className={`glass-panel rounded-2xl p-5 border transition-all space-y-4 flex flex-col justify-between shadow-xl group ${
                deck.isFullyReady
                  ? 'border-emerald-500/70 shadow-[0_0_25px_rgba(16,185,129,0.2)] bg-gradient-to-b from-[#0e1713] to-[#0a0f16]'
                  : 'border-white/10 hover:border-amber-500/40'
              }`}
            >
              <div className="space-y-3">
                {/* Header with Tier & Constructibility Pill */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${getTierBadge(deck.tier)}`}>
                      {deck.tier}
                    </span>
                    <span className="text-xs font-mono text-gray-400">
                      Difficulté : <strong className="text-amber-400">{deck.difficulty}</strong>
                    </span>
                  </div>

                  {/* Constructibility Badge */}
                  {deck.isFullyReady ? (
                    <div className="flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-emerald-950 border border-emerald-400 text-emerald-300 text-xs font-mono font-bold animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>100% CONSTRUCTIBLE !</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#121520] border border-white/10 text-xs font-mono">
                      <span className="text-gray-400">Collection :</span>
                      <span className={deck.ownedCount >= 10 ? 'text-amber-400 font-bold' : 'text-gray-300'}>
                        {deck.ownedCount}/15 ({deck.completionPercent}%)
                      </span>
                    </div>
                  )}
                </div>

                {/* Title & Clan */}
                <div>
                  <h3 className="font-gothic font-bold text-xl text-gray-100 group-hover:text-amber-300 transition-colors">
                    {deck.name}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span 
                      className="text-xs font-semibold px-2 py-0.5 rounded-md border"
                      style={{ backgroundColor: clanInfo.bgColor, borderColor: clanInfo.borderColor, color: clanInfo.themeColor }}
                    >
                      Clan {deck.clan}
                    </span>
                    <span className="text-xs text-gray-400">• {deck.playstyle}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed">
                  {deck.description}
                </p>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[#090b10] border border-white/5 text-center text-xs">
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase font-mono">Coût Moyen</span>
                    <span className="font-bold font-mono text-red-400">{deck.avgCost} Sang</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase font-mono">Puissance Totale</span>
                    <span className="font-bold font-mono text-amber-400">{deck.totalPower} Pts</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase font-mono">Archétype</span>
                    <span className="font-bold font-mono text-purple-400">{deck.archetype}</span>
                  </div>
                </div>

                {/* Interactive Card Previews with Highlighting */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] uppercase font-mono text-gray-400 font-bold">
                    <span>Composition des 15 Cartes :</span>
                    <span className="text-[9px] text-emerald-400">
                      Vert = Possédé ({deck.ownedCount}) • Gris = Manquant ({missingCount})
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {deck.cardsInDeck.map((c) => {
                      const isOwned = ownedCardIds.includes(c.id);

                      return (
                        <div
                          key={c.id}
                          onClick={() => onInspectCard?.(c)}
                          className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-gothic cursor-pointer transition-all border ${
                            isOwned
                              ? 'bg-emerald-950/70 border-emerald-500/70 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.25)] hover:border-emerald-300'
                              : 'bg-[#0e111a] border-white/10 text-gray-500 hover:text-gray-300 hover:border-white/25'
                          }`}
                          title={`${c.name} (${c.cost} Sang / ${c.power} Puissance) - ${isOwned ? 'Possédée dans votre jeu' : 'Non possédée (cliquez pour inspecter)'}`}
                        >
                          <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-mono font-bold ${
                            isOwned ? 'bg-emerald-500/30 text-emerald-200' : 'bg-white/5 text-gray-600'
                          }`}>
                            {isOwned ? '✓' : '•'}
                          </span>
                          <span className="truncate max-w-[125px]">{c.name}</span>
                          <span className="text-[10px] font-mono opacity-60">({c.cost})</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Smart Substitutions Accordion (when missing cards exist) */}
                {!deck.isFullyReady && deck.substitutions.length > 0 && (
                  <div className="pt-2">
                    <button
                      onClick={() => toggleSubstitutions(deck.id)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/40 text-purple-300 text-xs font-gothic transition-all"
                    >
                      <div className="flex items-center space-x-2">
                        <RefreshCw className={`w-3.5 h-3.5 text-purple-400 ${isExpanded ? 'rotate-180' : ''} transition-transform`} />
                        <span className="font-bold">
                          {isExpanded ? 'Masquer les suggestions de remplacement' : `Voir les ${deck.substitutions.length} remplacements suggérés`}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono bg-purple-900 px-2 py-0.5 rounded-full text-purple-200">
                        {deck.substitutions.length} cartes
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="mt-2 p-3 rounded-xl bg-[#0b0e15] border border-purple-500/30 space-y-2 text-xs animate-fadeIn">
                        <p className="text-[11px] text-gray-400 font-mono">
                          Équivalents optimaux trouvés dans votre collection ({ownedCardIds.length} cartes) :
                        </p>
                        <div className="space-y-2">
                          {deck.substitutions.map((sub, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5 gap-2">
                              {/* Missing Card */}
                              <div
                                onClick={() => onInspectCard?.(sub.missing)}
                                className="flex items-center space-x-1.5 text-gray-400 line-through cursor-pointer hover:text-gray-200"
                                title="Carte manquante"
                              >
                                <span className="w-5 h-5 rounded-full bg-red-950/80 border border-red-500/50 flex items-center justify-center text-[10px] font-bold text-red-300">
                                  {sub.missing.cost}
                                </span>
                                <span className="font-gothic">{sub.missing.name}</span>
                              </div>

                              <span className="text-purple-400 font-bold self-center text-xs">➔</span>

                              {/* Substitute Card */}
                              <div
                                onClick={() => onInspectCard?.(sub.substitute)}
                                className="flex items-center justify-between sm:justify-end space-x-2 cursor-pointer group/sub"
                              >
                                <div className="text-right">
                                  <div className="font-gothic font-bold text-emerald-300 group-hover/sub:text-white flex items-center space-x-1">
                                    <span>{sub.substitute.name}</span>
                                    <span className="text-[10px] text-amber-400 font-mono">P{sub.substitute.power}</span>
                                  </div>
                                  <span className="text-[9px] text-purple-300 block font-mono">{sub.reason}</span>
                                </div>
                                <span className="w-5 h-5 rounded-full bg-emerald-900 border border-emerald-400 flex items-center justify-center text-[10px] font-bold text-emerald-200">
                                  {sub.substitute.cost}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                {!deck.isFullyReady && deck.substitutions.length > 0 && (
                  <button
                    onClick={() => handleLoadWithSubstitutions(deck)}
                    className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-800 hover:from-purple-700 hover:to-indigo-700 text-white font-gothic font-bold text-xs shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all transform active:scale-98"
                  >
                    <Zap className="w-4 h-4 text-amber-300 animate-pulse" />
                    <span>⚡ Charger avec Remplacements Intelligents (15/15)</span>
                  </button>
                )}

                <button
                  onClick={() => onLoadMetaDeck?.(deck)}
                  className={`w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl text-white font-gothic font-bold text-xs shadow-blood transition-all transform active:scale-98 ${
                    deck.isFullyReady
                      ? 'bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 hover:from-emerald-600 hover:to-teal-600 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                      : 'bg-[#141824] hover:bg-[#1c2233] border border-white/10 text-gray-300 hover:text-white'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>{deck.isFullyReady ? '👑 Charger ce Deck Prêt à Jouer (15/15)' : 'Charger la composition originale'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDecks.length === 0 && (
        <div className="text-center py-12 glass-panel rounded-2xl border border-white/10 space-y-3">
          <Trophy className="w-10 h-10 text-gray-600 mx-auto" />
          <h3 className="font-gothic font-bold text-lg text-gray-300">Aucun deck méta correspondant</h3>
          <p className="text-xs text-gray-500">
            Ajoutez davantage de cartes possédées dans l'onglet "Mon Profil & Arène" ou modifiez vos filtres.
          </p>
        </div>
      )}
    </div>
  );
}
