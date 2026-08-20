import React from 'react';
import { Search, RotateCcw, LayoutGrid, ListFilter, ArrowUpDown, Filter, Sparkles } from 'lucide-react';
import { CLANS, ARCHETYPES, SERIES_LIST } from '../../data/clansData';

export default function FilterBar({
  filters,
  setFilters,
  onResetFilters,
  viewMode,
  setViewMode,
  totalResults,
  allCount
}) {
  const handleClanToggle = (clanName) => {
    if (filters.clan === clanName) {
      setFilters(prev => ({ ...prev, clan: 'ALL' }));
    } else {
      setFilters(prev => ({ ...prev, clan: clanName }));
    }
  };

  const handleSeriesToggle = (s) => {
    if (filters.series === s) {
      setFilters(prev => ({ ...prev, series: 'ALL' }));
    } else {
      setFilters(prev => ({ ...prev, series: s }));
    }
  };

  const handleCostToggle = (cost) => {
    if (filters.cost === cost) {
      setFilters(prev => ({ ...prev, cost: 'ALL' }));
    } else {
      setFilters(prev => ({ ...prev, cost }));
    }
  };

  const handleArchetypeToggle = (archId) => {
    if (filters.archetype === archId) {
      setFilters(prev => ({ ...prev, archetype: 'ALL' }));
    } else {
      setFilters(prev => ({ ...prev, archetype: archId }));
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-4 md:p-5 space-y-4 border border-white/10 shadow-2xl">
      {/* Top Search & Primary Sort Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            placeholder="Rechercher une carte, un effet, un mot-clé (ex: Morag, Murder, Violent)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0b0e14] border border-white/15 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm text-gray-100 placeholder-gray-500 transition-all"
          />
          {filters.search && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
            >
              Effacer
            </button>
          )}
        </div>

        {/* View Mode & Sort Dropdown & Reset */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          {/* Sort Selector */}
          <div className="relative flex items-center bg-[#0b0e14] border border-white/15 rounded-xl px-3 py-2 text-xs text-gray-200">
            <ArrowUpDown className="w-3.5 h-3.5 text-amber-400 mr-2" />
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
              className="bg-transparent border-none text-xs text-gray-200 focus:outline-none cursor-pointer pr-2 font-mono"
            >
              <option value="cost-asc" className="bg-[#121520]">Coût : Sang (1 → 7)</option>
              <option value="cost-desc" className="bg-[#121520]">Coût : Sang (7 → 1)</option>
              <option value="power-desc" className="bg-[#121520]">Puissance : Haute → Basse</option>
              <option value="power-asc" className="bg-[#121520]">Puissance : Basse → Haute</option>
              <option value="name-asc" className="bg-[#121520]">Nom : A → Z</option>
              <option value="series-asc" className="bg-[#121520]">Série : S0 → S5</option>
              <option value="rarity-desc" className="bg-[#121520]">Rareté : Légendaire → Commune</option>
            </select>
          </div>

          {/* View Mode Grid / Table Switch */}
          <div className="flex items-center rounded-xl bg-[#0b0e14] border border-white/15 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-red-800 to-rose-900 text-white shadow-blood'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Vue Grille de Cartes"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'table'
                  ? 'bg-gradient-to-r from-red-800 to-rose-900 text-white shadow-blood'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Vue Tableau Compact"
            >
              <ListFilter className="w-4 h-4" />
            </button>
          </div>

          {/* Reset Filters */}
          <button
            onClick={onResetFilters}
            className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-gray-300 hover:text-white text-xs font-semibold transition-all"
            title="Réinitialiser tous les filtres"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Réinitialiser</span>
          </button>
        </div>
      </div>

      {/* Quick Collection Toggle */}
      <div className="flex items-center justify-between p-2 rounded-xl bg-[#090b10] border border-white/5">
        <span className="text-xs text-gray-400 font-gothic">
          Filtrer par statut de possession (Mon Jeu) :
        </span>
        <button
          onClick={() => setFilters(prev => ({ ...prev, onlyOwned: !prev.onlyOwned }))}
          className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all border ${
            filters.onlyOwned
              ? 'bg-emerald-950 text-emerald-300 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
              : 'bg-[#121520] text-gray-400 border-white/10 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>{filters.onlyOwned ? '✔ Uniquement mes cartes possédées' : 'Toutes les cartes (Possédées + Non possédées)'}</span>
        </button>
      </div>

      {/* Clan Filter Pills */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-gray-400 font-gothic uppercase tracking-wider font-semibold">
          <span>Filtrer par Clan / Faction :</span>
          <span className="text-amber-400/90 font-mono font-normal">
            {totalResults} / {allCount} cartes
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setFilters(prev => ({ ...prev, clan: 'ALL' }))}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-gothic transition-all border ${
              filters.clan === 'ALL'
                ? 'bg-red-800/80 text-white border-red-500 shadow-blood'
                : 'bg-[#10131d] text-gray-400 border-white/10 hover:text-white hover:border-white/20'
            }`}
          >
            Tous les Clans
          </button>

          {Object.entries(CLANS).map(([clanKey, clan]) => {
            const isSelected = filters.clan === clanKey;
            return (
              <button
                key={clanKey}
                onClick={() => handleClanToggle(clanKey)}
                style={isSelected ? {
                  backgroundColor: clan.bgColor,
                  borderColor: clan.borderColor,
                  color: clan.themeColor,
                  boxShadow: `0 0 10px ${clan.borderColor}40`
                } : {}}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  isSelected
                    ? 'font-bold'
                    : 'bg-[#10131d] text-gray-400 border-white/10 hover:text-gray-200 hover:border-white/20'
                }`}
              >
                {clan.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Row with Series, Blood Cost, Archetypes & Rarity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-white/10">
        
        {/* Series Filter */}
        <div>
          <label className="block text-[11px] font-mono text-gray-400 mb-1.5">
            SÉRIES DU JEU
          </label>
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setFilters(prev => ({ ...prev, series: 'ALL' }))}
              className={`px-2 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                filters.series === 'ALL'
                  ? 'bg-amber-600/80 text-white border-amber-400 shadow-gold'
                  : 'bg-[#10131d] text-gray-400 border-white/10 hover:text-white'
              }`}
            >
              Toutes
            </button>
            {SERIES_LIST.map(s => (
              <button
                key={s}
                onClick={() => handleSeriesToggle(s)}
                className={`px-2 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                  filters.series === s
                    ? 'bg-amber-600/80 text-white border-amber-400 shadow-gold'
                    : 'bg-[#10131d] text-gray-400 border-white/10 hover:text-white'
                }`}
              >
                S{s}
              </button>
            ))}
          </div>
        </div>

        {/* Blood Cost Filter */}
        <div>
          <label className="block text-[11px] font-mono text-gray-400 mb-1.5">
            COÛT EN SANG
          </label>
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setFilters(prev => ({ ...prev, cost: 'ALL' }))}
              className={`px-2 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                filters.cost === 'ALL'
                  ? 'bg-red-700 text-white border-red-400 shadow-blood'
                  : 'bg-[#10131d] text-gray-400 border-white/10 hover:text-white'
              }`}
            >
              Tous
            </button>
            {[1, 2, 3, 4, 5, 6, '7+', 'X'].map(c => (
              <button
                key={c}
                onClick={() => handleCostToggle(c)}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-bold border flex items-center justify-center transition-all ${
                  filters.cost === c
                    ? 'bg-gradient-to-br from-red-600 to-rose-950 text-white border-red-400 shadow-blood'
                    : 'bg-[#10131d] text-gray-400 border-white/10 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Archetype / Keyword Filter */}
        <div>
          <label className="block text-[11px] font-mono text-gray-400 mb-1.5">
            MOTS-CLÉS & ARCHÉTYPES
          </label>
          <div className="relative">
            <select
              value={filters.archetype}
              onChange={(e) => setFilters(prev => ({ ...prev, archetype: e.target.value }))}
              className="w-full bg-[#10131d] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-red-500 font-sans"
            >
              <option value="ALL" className="bg-[#121520]">Tous les Archétypes</option>
              {ARCHETYPES.map(arch => (
                <option key={arch.id} value={arch.id} className="bg-[#121520]">
                  {arch.name} ({arch.clan})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Rarity & Card Type */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-mono text-gray-400 mb-1.5">
              RARETÉ
            </label>
            <select
              value={filters.rarity}
              onChange={(e) => setFilters(prev => ({ ...prev, rarity: e.target.value }))}
              className="w-full bg-[#10131d] border border-white/15 rounded-xl px-2 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-red-500"
            >
              <option value="ALL" className="bg-[#121520]">Toutes</option>
              <option value="Common" className="bg-[#121520]">Commune</option>
              <option value="Rare" className="bg-[#121520]">Rare</option>
              <option value="Epic" className="bg-[#121520]">Épique</option>
              <option value="Legendary" className="bg-[#121520]">Légendaire</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-gray-400 mb-1.5">
              TYPE
            </label>
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="w-full bg-[#10131d] border border-white/15 rounded-xl px-2 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-red-500"
            >
              <option value="ALL" className="bg-[#121520]">Tous</option>
              <option value="Vampire" className="bg-[#121520]">Vampire</option>
              <option value="Mortal" className="bg-[#121520]">Mortel</option>
              <option value="Retainer" className="bg-[#121520]">Retainer / Bête</option>
              <option value="Tactic" className="bg-[#121520]">Tactique / Sort</option>
            </select>
          </div>
        </div>

      </div>
    </div>
  );
}
