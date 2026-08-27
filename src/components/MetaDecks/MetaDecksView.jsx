import React, { useState } from 'react';
import { Trophy, Sparkles, Layers, ArrowRight, Shield, Droplets, CheckCircle2, XCircle, Filter, Check, Eye, RefreshCw, Zap, HelpCircle } from 'lucide-react';
import CardArtwork from '../Card/CardArtwork';
import { META_DECKS } from '../../data/metaDecks';
import { CARDS_DATA } from '../../data/cardsData';
import { CLANS } from '../../data/clansData';
import { buildSubstitutedDeck, getSmartSubstitutes } from '../../utils/deckSubstitutions';

export default function MetaDecksView({ 
  onLoadMetaDeck, 
  onInspectCard, 
  ownedCardIds = [],
  lang = 'fr',
  t
}) {
  const isFrench = lang === 'fr';
  const [filterMode, setFilterMode] = useState('all');
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
    const avgCost = (cardsInDeck.reduce((acc, c) => acc + (typeof c.cost === 'number' ? c.cost : 2), 0) / (cardsInDeck.length || 1)).toFixed(1);
    const totalPower = cardsInDeck.reduce((acc, c) => acc + (c.power || 0), 0);

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
      name: `${deck.name} (${isFrench ? 'Adapté' : 'Adapted'})`,
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
            <span>{t?.metadecks?.badge || "Méta Compétitive & Tier List"}</span>
          </div>
          <h1 className="font-gothic font-extrabold text-3xl md:text-4xl text-gray-100">
            {t?.metadecks?.title || "Decks Méta Officiels (15 Cartes)"}
          </h1>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed">
            {t?.metadecks?.description || "Compositions optimisées du format compétitif de Londres. Vos cartes possédées sont surlignées en vert. S'il vous manque des cartes, l'application vous propose automatiquement les meilleurs remplacements équivalents !"}
          </p>
        </div>
      </div>

      {/* Filter / Constructibility Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs font-gothic text-gray-300">
          <Filter className="w-4 h-4 text-amber-400" />
          <span>{t?.metadecks?.filterReadiness || "Filtrer par constructibilité :"}</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-gothic font-bold transition-all border ${
              filterMode === 'all'
                ? 'bg-red-800 text-white border-red-500 shadow-blood'
                : 'bg-[#141824] text-gray-400 border-white/10 hover:text-white'
            }`}
          >
            {t?.metadecks?.allDecks ? `${t?.metadecks?.allDecks} (${enhancedDecks.length})` : `Tous les Decks (${enhancedDecks.length})`}
          </button>

          <button
            onClick={() => setFilterMode('ready')}
            className={`px-3 py-1.5 rounded-xl text-xs font-gothic font-bold transition-all border ${
              filterMode === 'ready'
                ? 'bg-emerald-800 text-white border-emerald-500 shadow-sm'
                : 'bg-[#141824] text-gray-400 border-white/10 hover:text-white'
            }`}
          >
            {t?.metadecks?.readyToPlay ? `${t?.metadecks?.readyToPlay} (${readyDecksCount})` : `✔ Prêts à Jouer (${readyDecksCount})`}
          </button>

          <button
            onClick={() => setFilterMode('almost')}
            className={`px-3 py-1.5 rounded-xl text-xs font-gothic font-bold transition-all border ${
              filterMode === 'almost'
                ? 'bg-amber-700 text-white border-amber-400 shadow-gold'
                : 'bg-[#141824] text-gray-400 border-white/10 hover:text-white'
            }`}
          >
            {t?.metadecks?.almostComplete ? `${t?.metadecks?.almostComplete} (${almostDecksCount})` : `⚡ Presque Complets (${almostDecksCount})`}
          </button>
        </div>
      </div>

      {/* Meta Decks Cards List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDecks.map((deck) => {
          const clanInfo = CLANS[deck.clan] || CLANS.Mortal;
          const hasSubstitutions = deck.substitutions.length > 0;
          const isExpanded = expandedSubstitutions[deck.id];

          return (
            <div
              key={deck.id}
              className="glass-panel rounded-2xl border border-white/10 p-5 space-y-4 hover:border-white/20 transition-all flex flex-col justify-between shadow-xl"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-2 flex-wrap gap-1">
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase tracking-wider"
                        style={{ backgroundColor: clanInfo.bgColor, borderColor: clanInfo.borderColor, color: clanInfo.themeColor }}
                      >
                        {deck.clan}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${getTierBadge(deck.tier)}`}>
                        {deck.tier}
                      </span>
                      <span className="text-xs text-gray-400 font-gothic">{deck.archetype}</span>
                    </div>

                    <h3 className="font-gothic font-extrabold text-xl text-gray-100 mt-1">
                      {!isFrench && deck.name_en ? deck.name_en : deck.name}
                    </h3>
                  </div>

                  {/* Readiness Progress Ring */}
                  <div className="text-right flex-shrink-0">
                    <span className={`text-xs font-mono font-bold block ${
                      deck.isFullyReady ? 'text-emerald-400' : deck.isAlmostReady ? 'text-amber-400' : 'text-gray-400'
                    }`}>
                      {deck.ownedCount}/15 {t?.database?.cardsCount || "cartes"}
                    </span>
                    <span className="text-[10px] font-mono text-gray-500">
                      {deck.completionPercent}% {isFrench ? "possédé" : "owned"}
                    </span>
                  </div>
                </div>

                {/* Strategy Text */}
                <p className="text-xs text-gray-300 leading-relaxed bg-[#090b10] p-3 rounded-xl border border-white/5 font-sans">
                  {!isFrench && deck.strategy_en ? deck.strategy_en : deck.strategy}
                </p>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="p-2 rounded-lg bg-[#141824] border border-white/5">
                    <span className="text-[10px] text-gray-400 block uppercase">{t?.metadecks?.cards || "Cartes"}</span>
                    <span className="font-bold text-gray-200">15</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#141824] border border-white/5">
                    <span className="text-[10px] text-gray-400 block uppercase">{t?.metadecks?.totalPower || "Puissance"}</span>
                    <span className="font-bold text-amber-400">{deck.totalPower}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#141824] border border-white/5">
                    <span className="text-[10px] text-gray-400 block uppercase">{t?.metadecks?.avgCost || "Coût Moyen"}</span>
                    <span className="font-bold text-rose-400">{deck.avgCost}</span>
                  </div>
                </div>

                {/* 15 Cards Mini Visual Strip (Clean & Immediate Owned Outline) */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
                    <span>{isFrench ? "Composition du Deck (15 Cartes) :" : "Deck Composition (15 Cards) :"}</span>
                    <span className="text-gray-500">{isFrench ? "Cliquer pour inspecter" : "Click to inspect"}</span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {deck.cardsInDeck.map((card) => {
                      const isOwned = ownedCardIds.includes(card.id);
                      return (
                        <div
                          key={card.id}
                          onClick={() => onInspectCard(card)}
                          className={`group relative rounded-xl p-2 transition-all duration-200 cursor-pointer flex flex-col justify-between text-center select-none ${
                            isOwned
                              ? 'border-2 border-emerald-400/90 bg-gradient-to-b from-emerald-950/60 to-[#0c1612] text-emerald-200 shadow-[0_0_14px_rgba(16,185,129,0.35)] hover:border-emerald-300 hover:scale-[1.03]'
                              : 'border border-white/10 bg-[#0c0f17] text-gray-400 opacity-60 hover:opacity-100 hover:border-amber-400/60 hover:scale-[1.02]'
                          }`}
                          title={`${card.name} (${card.costDisplay || card.cost} Sang • P${card.power} • ${isOwned ? 'Possédée' : 'Manquante'})`}
                        >
                          {/* Top Badges: Cost & Power */}
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="w-5 h-5 rounded-full bg-red-950 border border-red-500/60 flex items-center justify-center font-mono font-bold text-[10px] text-red-300">
                              {card.costDisplay || card.cost}
                            </span>
                            <span className="w-5 h-5 rounded-lg bg-amber-950 border border-amber-500/60 flex items-center justify-center font-mono font-bold text-[10px] text-amber-300">
                              {card.power}
                            </span>
                          </div>

                          {/* Card Name */}
                          <p className={`font-gothic font-bold text-xs truncate leading-snug my-1 ${
                            isOwned ? 'text-gray-100 group-hover:text-emerald-300' : 'text-gray-300 group-hover:text-amber-300'
                          }`}>
                            {card.name}
                          </p>

                          {/* Status Badge */}
                          <div className="pt-1 border-t border-white/5">
                            {isOwned ? (
                              <span className="inline-flex items-center space-x-0.5 text-[9px] font-mono font-bold text-emerald-400">
                                <span>✓</span>
                                <span>{isFrench ? "Possédée" : "Owned"}</span>
                              </span>
                            ) : (
                              <span className="text-[9px] font-mono text-gray-500">
                                {isFrench ? "Manquante" : "Missing"}
                              </span>
                            )}
                          </div>
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
                          {isExpanded 
                            ? (isFrench ? 'Masquer les suggestions de remplacement' : 'Hide substitute suggestions') 
                            : (isFrench ? `Voir les ${deck.substitutions.length} remplacements suggérés` : `View ${deck.substitutions.length} suggested substitutes`)}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono bg-purple-900 px-2 py-0.5 rounded-full text-purple-200">
                        {deck.substitutions.length} {t?.database?.cardsCount || "cartes"}
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="mt-2 p-3 rounded-xl bg-[#0b0e15] border border-purple-500/30 space-y-2 text-xs animate-fadeIn">
                        <p className="text-[11px] text-gray-400 font-mono">
                          {isFrench ? `Équivalents optimaux trouvés dans votre collection (${ownedCardIds.length} cartes) :` : `Optimal substitutes found in your collection (${ownedCardIds.length} cards):`}
                        </p>
                        <div className="space-y-2">
                          {deck.substitutions.map((sub, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5 gap-2">
                              {/* Missing Card */}
                              <div
                                onClick={() => onInspectCard?.(sub.missing)}
                                className="flex items-center space-x-1.5 text-gray-400 line-through cursor-pointer hover:text-gray-200"
                                title={isFrench ? "Carte manquante" : "Missing card"}
                              >
                                <span className="w-5 h-5 rounded-full bg-red-950/80 border border-red-500/50 flex items-center justify-center text-[10px] font-bold text-red-300">
                                  {sub.missing.costDisplay || sub.missing.cost}
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
                                  {sub.substitute.costDisplay || sub.substitute.cost}
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
              <div className="flex items-center space-x-2 pt-2 border-t border-white/10">
                <button
                  onClick={() => onLoadMetaDeck(deck)}
                  className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-gradient-to-r from-red-800 to-rose-900 hover:from-red-700 hover:to-rose-800 text-white font-gothic font-bold text-xs shadow-blood transition-all"
                >
                  <Layers className="w-4 h-4" />
                  <span>{t?.metadecks?.loadInDeckbuilder || "Charger dans le Deck Builder"}</span>
                </button>

                {hasSubstitutions && !deck.isFullyReady && (
                  <button
                    onClick={() => handleLoadWithSubstitutions(deck)}
                    className="px-3 py-2.5 rounded-xl bg-amber-950 hover:bg-amber-900 border border-amber-500/50 text-amber-200 font-gothic font-bold text-xs transition-all"
                    title={isFrench ? "Charger avec les remplacements intelligents pour cartes manquantes" : "Load with smart replacements for missing cards"}
                  >
                    <Zap className="w-4 h-4 text-amber-400 inline mr-1" />
                    <span>{isFrench ? "Adapter" : "Adapt"}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
