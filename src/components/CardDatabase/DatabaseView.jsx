import React, { useState, useEffect } from 'react';
import { BookOpen, Layers, Sparkles, Droplets, Shield, Award, RefreshCw, CheckCircle2, Globe, ExternalLink } from 'lucide-react';
import FilterBar from './FilterBar';
import TableView from './TableView';
import CardFrame from '../Card/CardFrame';
import { CARDS_DATA } from '../../data/cardsData';
import { CLANS } from '../../data/clansData';
import { syncCardsWithParadoxWiki, getLastSyncMetadata } from '../../utils/wikiSync';

export default function DatabaseView({ 
  onInspectCard, 
  onAddCard, 
  onRemoveCard, 
  deckCards = [], 
  ownedCardIds = [],
  lang = 'fr',
  t
}) {
  const isEn = lang === 'en';

  const [filters, setFilters] = useState({
    search: '',
    clan: 'ALL',
    series: 'ALL',
    cost: 'ALL',
    archetype: 'ALL',
    rarity: 'ALL',
    type: 'ALL',
    ownership: 'ALL',
    sortBy: 'cost-asc'
  });
  const [viewMode, setViewMode] = useState('grid');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMeta, setSyncMeta] = useState(getLastSyncMetadata());
  const [syncSuccessMsg, setSyncSuccessMsg] = useState(null);

  useEffect(() => {
    setSyncMeta(getLastSyncMetadata());
  }, []);

  const handleWikiSync = async () => {
    setIsSyncing(true);
    try {
      const res = await syncCardsWithParadoxWiki();
      if (res.success) {
        setSyncMeta(res.metadata);
        setSyncSuccessMsg(res.message);
        setTimeout(() => setSyncSuccessMsg(null), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  const onResetFilters = () => {
    setFilters({
      search: '',
      clan: 'ALL',
      series: 'ALL',
      cost: 'ALL',
      archetype: 'ALL',
      rarity: 'ALL',
      type: 'ALL',
      ownership: 'ALL',
      sortBy: 'cost-asc'
    });
  };

  const filteredCards = CARDS_DATA.filter(card => {
    const isOwned = ownedCardIds.includes(card.id);
    if (filters.ownership === 'owned' && !isOwned) return false;
    if (filters.ownership === 'missing' && isOwned) return false;
    
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
      case 'cost-asc':
        return costA - costB || a.name.localeCompare(b.name);
      case 'cost-desc':
        return costB - costA || a.name.localeCompare(b.name);
      case 'power-desc':
        return b.power - a.power || costA - costB;
      case 'power-asc':
        return a.power - b.power || costA - costB;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'series-asc':
        return a.series - b.series || costA - costB;
      case 'rarity-desc': {
        const rarityOrder = { 'Légendaire': 4, 'Legendary': 4, 'Épique': 3, 'Epic': 3, 'Rare': 2, 'Commune': 1, 'Common': 1 };
        return (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0);
      }
      default:
        return costA - costB;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <h1 className="font-gothic font-extrabold text-2xl md:text-3xl text-gray-100">
                {isEn ? "Complete London Card Database" : "Base de Données Complète de Londres"}
              </h1>
            </div>
            <p className="text-xs md:text-sm text-gray-400 font-sans">
              {isEn 
                ? "Official catalog aligned with Paradox Wiki. Complete with card art, verified abilities and full clan/faction tags."
                : "Catalogue officiel certifié et aligné sur le Wiki Paradox. Illustrations officielles, textes de règles littéraux et factions vérifiées."}
            </p>
          </div>

          {/* Sync & Stats Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <button
              onClick={handleWikiSync}
              disabled={isSyncing}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-700 via-red-800 to-rose-900 hover:from-amber-600 hover:to-rose-800 text-white text-xs font-gothic font-bold border border-amber-500/60 shadow-blood transition-all transform active:scale-98 disabled:opacity-50"
              title="Vérifier en direct les nouveautés et ajustements depuis le Wiki Paradox"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-300 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? (isEn ? "Syncing Wiki..." : "Vérification Wiki...") : (isEn ? "🔄 Sync Paradox Wiki" : "🔄 Synchroniser Wiki Paradox")}</span>
            </button>

            <div className="px-3 py-2 rounded-xl bg-[#090b10] border border-white/10 text-xs font-mono text-gray-300">
              <strong className="text-amber-400 font-bold">{filteredCards.length}</strong> / {CARDS_DATA.length} {isEn ? "cards" : "cartes"}
            </div>
          </div>
        </div>

        {/* Sync Success Toast */}
        {syncSuccessMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs flex items-center space-x-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="font-semibold">{syncSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* Interactive Filters Panel */}
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        onResetFilters={onResetFilters}
        viewMode={viewMode}
        setViewMode={setViewMode}
        totalResults={filteredCards.length}
        allCount={CARDS_DATA.length}
        lang={lang}
      />

      {/* Grid or Table Card Listing */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredCards.map((card) => {
            const countInDeck = deckCards.filter(c => c.id === card.id).length;
            return (
              <CardFrame
                key={card.id}
                card={card}
                onInspect={onInspectCard}
                onAdd={onAddCard}
                onRemove={() => onRemoveCard(card.id)}
                countInDeck={countInDeck}
                showActions={true}
                lang={lang}
              />
            );
          })}
        </div>
      ) : (
        <TableView
          cards={filteredCards}
          onInspectCard={onInspectCard}
          onAddCard={onAddCard}
          onRemoveCard={onRemoveCard}
          deckCards={deckCards}
          lang={lang}
        />
      )}

      {/* Empty State */}
      {filteredCards.length === 0 && (
        <div className="text-center py-16 px-4 glass-panel rounded-2xl border border-white/10 space-y-3">
          <p className="text-gray-400 text-sm">
            {isEn ? "No cards match the selected criteria." : "Aucune carte ne correspond aux critères sélectionnés."}
          </p>
          <button
            onClick={onResetFilters}
            className="px-4 py-2 rounded-xl bg-red-900 hover:bg-red-800 text-white font-gothic text-xs font-bold"
          >
            {isEn ? "Reset Filters" : "Réinitialiser les Filtres"}
          </button>
        </div>
      )}
    </div>
  );
}
