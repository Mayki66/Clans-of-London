import React, { useState } from 'react';
import { BookOpen, Layers, Sparkles, Droplets, Shield, Award } from 'lucide-react';
import FilterBar from './FilterBar';
import TableView from './TableView';
import CardFrame from '../Card/CardFrame';
import { CARDS_DATA } from '../../data/cardsData';
import { CLANS } from '../../data/clansData';

export default function DatabaseView({ onInspectCard, onAddCard, onRemoveCard, deckCards = [], ownedCardIds = [] }) {
  const [filters, setFilters] = useState({
    search: '',
    clan: 'ALL',
    series: 'ALL',
    cost: 'ALL',
    archetype: 'ALL',
    rarity: 'ALL',
    type: 'ALL',
    onlyOwned: false,
    sortBy: 'cost-asc'
  });
  const [viewMode, setViewMode] = useState('grid');

  const onResetFilters = () => {
    setFilters({
      search: '',
      clan: 'ALL',
      series: 'ALL',
      cost: 'ALL',
      archetype: 'ALL',
      rarity: 'ALL',
      type: 'ALL',
      onlyOwned: false,
      sortBy: 'cost-asc'
    });
  };

  const filteredCards = CARDS_DATA.filter(card => {
    if (filters.onlyOwned && !ownedCardIds.includes(card.id)) return false;
    if (filters.clan !== 'ALL' && card.clan !== filters.clan) return false;
    if (filters.series !== 'ALL' && card.series !== filters.series) return false;
    if (filters.cost !== 'ALL') {
      if (filters.cost === '7+' && card.cost < 7) return false;
      if (typeof filters.cost === 'number' && card.cost !== filters.cost) return false;
    }
    if (filters.archetype !== 'ALL' && card.archetype !== filters.archetype) return false;
    if (filters.rarity !== 'ALL' && card.rarity !== filters.rarity) return false;
    if (filters.type !== 'ALL' && card.type !== filters.type) return false;

    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchName = card.name.toLowerCase().includes(q);
      const matchAbility = card.ability.toLowerCase().includes(q);
      const matchFlavor = card.flavorText?.toLowerCase().includes(q);
      const matchKeywords = card.keywords?.some(k => k.toLowerCase().includes(q));
      const matchClan = card.clan.toLowerCase().includes(q);
      const matchWiki = card.wikiUrl?.toLowerCase().includes(q) || (q === 'kate' && card.name.toLowerCase().includes('katie'));
      if (!matchName && !matchAbility && !matchFlavor && !matchKeywords && !matchClan && !matchWiki) return false;
    }

    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'cost-asc': return a.cost - b.cost || a.name.localeCompare(b.name);
      case 'cost-desc': return b.cost - a.cost || a.name.localeCompare(b.name);
      case 'power-desc': return b.power - a.power;
      case 'power-asc': return a.power - b.power;
      case 'name-asc': return a.name.localeCompare(b.name);
      case 'series-asc': return a.series - b.series;
      case 'rarity-desc': {
        const rOrder = { 'Légendaire': 4, 'Legendary': 4, 'Épique': 3, 'Epic': 3, 'Rare': 2, 'Commune': 1, 'Common': 1 };
        return (rOrder[b.rarity] || 0) - (rOrder[a.rarity] || 0);
      }
      default: return a.cost - b.cost;
    }
  });

  const deckCardsMap = deckCards.reduce((acc, card) => {
    acc[card.id] = (acc[card.id] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden glass-panel-blood p-6 md:p-8 border border-red-500/30 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-red-400" />
            <span>Encyclopédie & Base Complète</span>
          </div>
          <h1 className="font-gothic font-extrabold text-3xl md:text-4xl text-gray-100 text-shadow-md">
            Base de Données des Cartes <span className="text-red-500 font-normal">Clans of London</span>
          </h1>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed">
            Explorez l'intégralité des vampires, goules, nécromanciens et tactiques de Londres. Filtrez par Clan, Série (S0 à S5), Coût en Sang, Rareté ou Mots-clés pour concevoir la stratégie parfaite.
          </p>

          {/* Quick Stats Pill */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span className="px-3 py-1 rounded-xl bg-black/50 border border-white/10 text-xs font-mono text-amber-400">
              {CARDS_DATA.length} Cartes Répertoriées
            </span>
            <span className="px-3 py-1 rounded-xl bg-black/50 border border-white/10 text-xs font-mono text-purple-400">
              6 Séries (S0 - S5)
            </span>
            <span className="px-3 py-1 rounded-xl bg-black/50 border border-white/10 text-xs font-mono text-emerald-400">
              8 Clans & Factions
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        onResetFilters={onResetFilters}
        viewMode={viewMode}
        setViewMode={setViewMode}
        totalResults={filteredCards.length}
        allCount={CARDS_DATA.length}
      />

      {/* Results View */}
      {filteredCards.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center text-gray-400 border border-white/10 space-y-3">
          <BookOpen className="w-12 h-12 mx-auto text-red-500/50" />
          <h3 className="font-gothic font-bold text-lg text-gray-200">Aucune carte trouvée</h3>
          <p className="text-xs text-gray-400">Essayez d'ajuster vos critères de recherche ou réinitialisez les filtres.</p>
          <button
            onClick={onResetFilters}
            className="px-5 py-2 rounded-xl bg-red-950 text-red-200 border border-red-500/40 text-xs font-gothic font-bold"
          >
            Réinitialiser les Filtres
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <TableView
          cards={filteredCards}
          onInspect={onInspectCard}
          onAdd={onAddCard}
          onRemove={onRemoveCard}
          deckCardsMap={deckCardsMap}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCards.map((card) => (
            <CardFrame
              key={card.id}
              card={card}
              countInDeck={deckCardsMap[card.id] || 0}
              onInspect={onInspectCard}
              onAdd={onAddCard}
              onRemove={onRemoveCard}
            />
          ))}
        </div>
      )}
    </div>
  );
}
