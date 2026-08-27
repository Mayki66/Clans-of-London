import React, { useState } from 'react';
import { Plus, Minus, Layers, Play, BarChart3, Search, Sparkles, Filter, ChevronRight, X } from 'lucide-react';
import CardFrame from '../Card/CardFrame';
import DeckStats from './DeckStats';
import TurnSimulator from './TurnSimulator';
import DeckManager from './DeckManager';
import FilterBar from '../CardDatabase/FilterBar';
import TableView from '../CardDatabase/TableView';
import { CARDS_DATA } from '../../data/cardsData';

export default function DeckBuilderView({
  deckName,
  setDeckName,
  deckCards,
  onAddCard,
  onRemoveCard,
  onClearDeck,
  onLoadDeck,
  savedDecks,
  onSaveDeck,
  onDeleteSavedDeck,
  onInspectCard,
  ownedCardIds = [],
  userProfile,
  lang = 'fr',
  t
}) {
  const [activeTab, setActiveTab] = useState('cards'); // 'cards' | 'stats' | 'simulator'
  
  // Card Library Search & Filter State inside Deckbuilder
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

  // Filter and sort catalog cards
  const filteredCards = CARDS_DATA.filter(card => {
    if (filters.onlyOwned && !ownedCardIds.includes(card.id)) return false;
    
    // Clan / Faction filter (with Mortal and Duskborn support)
    if (filters.clan !== 'ALL') {
      if (filters.clan === 'Mortal' || filters.clan === 'Mortel') {
        const isMortal = card.clan === 'Mortel' || card.clan === 'Mortal' || card.type === 'Mortel' || card.type === 'Mortal' || card.keywords?.some(k => k.toLowerCase().includes('mortal') || k.toLowerCase().includes('mortel'));
        if (!isMortal) return false;
      } else if (filters.clan === 'Duskborn') {
        const isDuskborn = card.clan === 'Duskborn' || card.keywords?.some(k => k.toLowerCase().includes('duskborn'));
        if (!isDuskborn) return false;
      } else {
        if (card.clan !== filters.clan && card.clan?.toLowerCase() !== filters.clan.toLowerCase()) return false;
      }
    }

    if (filters.series !== 'ALL' && card.series !== filters.series) return false;

    // Cost filter (handling X and 7+)
    if (filters.cost !== 'ALL') {
      if (filters.cost === 'X') {
        if (card.cost !== 'X' && card.costDisplay !== 'X') return false;
      } else if (filters.cost === '7+') {
        const numCost = typeof card.cost === 'number' ? card.cost : 0;
        if (numCost < 7) return false;
      } else if (typeof filters.cost === 'number') {
        if (card.cost !== filters.cost) return false;
      }
    }

    // Archetype filter
    if (filters.archetype !== 'ALL') {
      if (filters.archetype === 'Alchimie') {
        const isAlch = card.archetype === 'Alchimie' || card.keywords?.some(k => k.toLowerCase().includes('ingrédient') || k.toLowerCase().includes('ingredient') || k.toLowerCase().includes('alchimie'));
        if (!isAlch) return false;
      } else if (filters.archetype === 'Neutral' || filters.archetype === 'Neutre') {
        const isNeut = card.archetype === 'Neutral' || card.archetype === 'Neutre';
        if (!isNeut) return false;
      } else if (card.archetype !== filters.archetype) {
        return false;
      }
    }

    if (filters.rarity !== 'ALL' && card.rarity !== filters.rarity) return false;

    // Type filter (Vampire / Mortel)
    if (filters.type !== 'ALL') {
      if (filters.type === 'Mortal' || filters.type === 'Mortel') {
        const isMortal = card.type === 'Mortel' || card.type === 'Mortal' || card.clan === 'Mortel' || card.clan === 'Mortal' || card.keywords?.some(k => k.toLowerCase().includes('mortal') || k.toLowerCase().includes('mortel'));
        if (!isMortal) return false;
      } else if (card.type !== filters.type) {
        return false;
      }
    }

    // Text search
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      const matchName = card.name?.toLowerCase().includes(q);
      const matchOriginal = card.originalName?.toLowerCase().includes(q);
      const matchAbility = card.ability?.toLowerCase().includes(q);
      const matchAbilityEn = card.ability_en?.toLowerCase().includes(q);
      const matchClan = card.clan?.toLowerCase().includes(q);
      const matchKeywords = card.keywords?.some(k => k.toLowerCase().includes(q));

      if (!matchName && !matchOriginal && !matchAbility && !matchAbilityEn && !matchClan && !matchKeywords) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    const costA = typeof a.cost === 'number' ? a.cost : 0;
    const costB = typeof b.cost === 'number' ? b.cost : 0;

    switch (filters.sortBy) {
      case 'cost-asc': return costA - costB || a.name.localeCompare(b.name);
      case 'cost-desc': return costB - costA || a.name.localeCompare(b.name);
      case 'power-desc': return b.power - a.power;
      case 'power-asc': return a.power - b.power;
      case 'name-asc': return a.name.localeCompare(b.name);
      case 'series-asc': return a.series - b.series;
      case 'rarity-desc': {
        const rOrder = { 'Légendaire': 4, 'Legendary': 4, 'Épique': 3, 'Epic': 3, 'Rare': 2, 'Commune': 1, 'Common': 1 };
        return (rOrder[b.rarity] || 0) - (rOrder[a.rarity] || 0);
      }
      default: return costA - costB;
    }
  });

  // Map of card counts in deck
  const deckCardsMap = deckCards.reduce((acc, card) => {
    acc[card.id] = (acc[card.id] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Top Deck Management Header */}
      <DeckManager
        deckName={deckName}
        setDeckName={setDeckName}
        deckCards={deckCards}
        onClearDeck={onClearDeck}
        onLoadDeck={onLoadDeck}
        savedDecks={savedDecks}
        onSaveDeck={onSaveDeck}
        onDeleteSavedDeck={onDeleteSavedDeck}
        userProfile={userProfile}
        lang={lang}
        t={t}
      />

      {/* Main Builder Grid (Deck on Left / Catalog on Right on Large Screens) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column : Current Deck Area (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Tabs: Cartes du Deck / Stats Analytiques / Simulateur de Match */}
          <div className="flex items-center space-x-1 p-1 rounded-xl bg-[#0e111a] border border-white/10">
            <button
              onClick={() => setActiveTab('cards')}
              className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-gothic font-bold transition-all ${
                activeTab === 'cards'
                  ? 'bg-gradient-to-r from-red-800 to-rose-900 text-white shadow-blood'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Deck ({deckCards.length}/15)</span>
            </button>

            <button
              onClick={() => setActiveTab('stats')}
              className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-gothic font-bold transition-all ${
                activeTab === 'stats'
                  ? 'bg-gradient-to-r from-red-800 to-rose-900 text-white shadow-blood'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{lang === 'fr' ? 'Courbes & Stats' : 'Stats & Mana Curve'}</span>
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-gothic font-bold transition-all ${
                activeTab === 'simulator'
                  ? 'bg-gradient-to-r from-red-800 to-rose-900 text-white shadow-blood'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>{lang === 'fr' ? 'Simulateur 7 Tours' : '7-Round Simulator'}</span>
            </button>
          </div>

          {/* TAB 1: Visual Card Slots in Deck */}
          {activeTab === 'cards' && (
            <div className="glass-panel rounded-2xl p-4 border border-white/10 space-y-3 shadow-2xl">
              <div className="flex items-center justify-between text-xs text-gray-300 font-gothic font-semibold uppercase tracking-wider pb-2 border-b border-white/10">
                <span>{lang === 'fr' ? 'Cartes dans votre Deck :' : 'Cards in your Deck:'}</span>
                <span className="font-mono text-amber-400 font-bold">{deckCards.length} / 15 {t?.database?.cardsCount || "cartes"}</span>
              </div>

              {deckCards.length === 0 ? (
                <div className="p-8 text-center text-gray-500 space-y-2">
                  <Layers className="w-8 h-8 mx-auto text-gray-600 opacity-50" />
                  <p className="text-sm font-gothic">{t?.deckbuilder?.emptyDeckTitle || "Votre deck est actuellement vide"}</p>
                  <p className="text-xs text-gray-500">
                    {t?.deckbuilder?.emptyDeckSubtitle || "Sélectionnez des cartes ci-dessous pour composer votre stratégie (15 cartes exactement)."}
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
                  {deckCards
                    .sort((a, b) => a.cost - b.cost || a.name.localeCompare(b.name))
                    .map((card) => (
                      <CardFrame
                        key={card.id}
                        card={card}
                        compact={true}
                        countInDeck={deckCardsMap[card.id] || 0}
                        onInspect={onInspectCard}
                        onAdd={onAddCard}
                        onRemove={onRemoveCard}
                        lang={lang}
                        t={t}
                      />
                    ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Stats & Mana Curve */}
          {activeTab === 'stats' && (
            <DeckStats deckCards={deckCards} lang={lang} t={t} />
          )}

          {/* TAB 3: 7-Turn Conflict Simulator */}
          {activeTab === 'simulator' && (
            <TurnSimulator deckCards={deckCards} onInspectCard={onInspectCard} lang={lang} t={t} />
          )}

        </div>

        {/* Right Column : Card Catalog & Filters (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Card Filter Bar */}
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            onResetFilters={onResetFilters}
            viewMode={viewMode}
            setViewMode={setViewMode}
            totalResults={filteredCards.length}
            allCount={CARDS_DATA.length}
            lang={lang}
            t={t}
          />

          {/* Results Grid / Table */}
          {filteredCards.length === 0 ? (
            <div className="glass-panel rounded-2xl p-8 text-center text-gray-500 border border-white/10 space-y-2">
              <p className="text-sm font-gothic">{t?.database?.noCardsMatch || "Aucune carte ne correspond aux critères sélectionnés."}</p>
              <button
                onClick={onResetFilters}
                className="px-4 py-1.5 rounded-lg bg-red-950 text-red-200 border border-red-500/40 text-xs font-semibold"
              >
                {t?.database?.resetFiltersBtn || "Réinitialiser les Filtres"}
              </button>
            </div>
          ) : viewMode === 'table' ? (
            <TableView
              cards={filteredCards}
              onInspectCard={onInspectCard}
              onAddCard={onAddCard}
              onRemoveCard={onRemoveCard}
              deckCards={deckCards}
              lang={lang}
              t={t}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
              {filteredCards.map((card) => (
                <CardFrame
                  key={card.id}
                  card={card}
                  countInDeck={deckCardsMap[card.id] || 0}
                  onInspect={onInspectCard}
                  onAdd={onAddCard}
                  onRemove={onRemoveCard}
                  lang={lang}
                  t={t}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
