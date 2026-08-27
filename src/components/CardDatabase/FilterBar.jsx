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
  allCount,
  lang = 'fr',
  t
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
            placeholder={t?.database?.searchPlaceholder || "Rechercher une carte, un effet, un mot-clé (ex: Morag, Murder, Violent)..."}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0b0e14] border border-white/15 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm text-gray-100 placeholder-gray-500 transition-all"
          />
          {filters.search && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
            >
              {t?.database?.clearSearch || "Effacer"}
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
              <option value="cost-asc" className="bg-[#121520]">{t?.database?.sortCostAsc || "Coût : Sang (1 → 7)"}</option>
              <option value="cost-desc" className="bg-[#121520]">{t?.database?.sortCostDesc || "Coût : Sang (7 → 1)"}</option>
              <option value="power-desc" className="bg-[#121520]">{t?.database?.sortPowerDesc || "Puissance : Haute → Basse"}</option>
              <option value="power-asc" className="bg-[#121520]">{t?.database?.sortPowerAsc || "Puissance : Basse → Haute"}</option>
              <option value="name-asc" className="bg-[#121520]">{t?.database?.sortNameAsc || "Nom : A → Z"}</option>
              <option value="series-asc" className="bg-[#121520]">{t?.database?.sortSeriesAsc || "Série : S0 → S5"}</option>
              <option value="rarity-desc" className="bg-[#121520]">{t?.database?.sortRarityDesc || "Rareté : Légendaire → Commune"}</option>
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
              title={t?.database?.gridView || "Vue Grille de Cartes"}
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
              title={t?.database?.tableView || "Vue Liste Compacte"}
            >
              <ListFilter className="w-4 h-4" />
            </button>
          </div>

          {/* Reset Filters */}
          <button
            onClick={onResetFilters}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#0b0e14] hover:bg-[#151926] border border-white/15 text-xs text-gray-300 hover:text-white transition-all"
            title={t?.database?.reset || "Réinitialiser tous les filtres"}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t?.database?.reset || "Réinitialiser"}</span>
          </button>
        </div>
      </div>

      {/* Quick Clan Buttons */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono text-gray-400">
          <span className="uppercase tracking-wider font-semibold">{t?.database?.clansFactions || "Clans & Factions"} :</span>
          <span>{totalResults} / {allCount} {t?.database?.cardsCount || "cartes"}</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setFilters(prev => ({ ...prev, clan: 'ALL' }))}
            className={`px-3 py-1.5 rounded-xl text-xs font-gothic font-bold transition-all border ${
              filters.clan === 'ALL'
                ? 'bg-gradient-to-r from-red-800 to-rose-900 text-white border-red-500 shadow-blood'
                : 'bg-[#0e111a] text-gray-400 border-white/10 hover:text-white hover:border-white/20'
            }`}
          >
            {t?.database?.allClans || "Tous les Clans"}
          </button>

          {Object.entries(CLANS).map(([clanKey, clanData]) => {
            const isSelected = filters.clan === clanKey;
            return (
              <button
                key={clanKey}
                onClick={() => handleClanToggle(clanKey)}
                style={isSelected ? { backgroundColor: clanData.bgColor, borderColor: clanData.borderColor, color: clanData.themeColor } : {}}
                className={`px-3 py-1.5 rounded-xl text-xs font-gothic transition-all border flex items-center space-x-1.5 ${
                  isSelected
                    ? 'font-bold shadow-sm'
                    : 'bg-[#0e111a] text-gray-400 border-white/10 hover:text-gray-200 hover:border-white/20'
                }`}
              >
                <span>{clanData.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Filter Chips (Cost, Power, Series, Ownership) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2 border-t border-white/10 text-xs">
        
        {/* Cost Filter */}
        <div>
          <span className="font-mono text-[11px] text-gray-400 uppercase font-semibold block mb-1.5">
            {t?.database?.bloodCost || "Coût en Sang"} :
          </span>
          <div className="flex flex-wrap items-center gap-1">
            <button
              onClick={() => setFilters(prev => ({ ...prev, cost: 'ALL' }))}
              className={`px-2 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                filters.cost === 'ALL'
                  ? 'bg-red-800 text-white border-red-500 shadow-blood'
                  : 'bg-[#0e111a] text-gray-400 border-white/10 hover:text-white'
              }`}
            >
              {t?.database?.allCosts || "Tous"}
            </button>
            {[1, 2, 3, 4, 5, 6, '7+', 'X'].map((c) => (
              <button
                key={c}
                onClick={() => handleCostToggle(c)}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-bold border transition-all flex items-center justify-center ${
                  filters.cost === c
                    ? 'bg-red-600 text-white border-red-400 shadow-blood'
                    : 'bg-[#0e111a] text-gray-400 border-white/10 hover:text-white hover:border-red-500/50'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Series Filter */}
        <div>
          <span className="font-mono text-[11px] text-gray-400 uppercase font-semibold block mb-1.5">
            {t?.database?.releaseSeries || "Série d'extension"} :
          </span>
          <div className="flex flex-wrap items-center gap-1">
            <button
              onClick={() => setFilters(prev => ({ ...prev, series: 'ALL' }))}
              className={`px-2 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                filters.series === 'ALL'
                  ? 'bg-amber-600 text-white border-amber-400 shadow-gold'
                  : 'bg-[#0e111a] text-gray-400 border-white/10 hover:text-white'
              }`}
            >
              {t?.database?.allSeries || "Toutes"}
            </button>
            {SERIES_LIST.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSeriesToggle(s.id)}
                className={`px-2 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                  filters.series === s.id
                    ? 'bg-amber-600 text-white border-amber-400 shadow-gold'
                    : 'bg-[#0e111a] text-gray-400 border-white/10 hover:text-white'
                }`}
              >
                S{s.id}
              </button>
            ))}
          </div>
        </div>

        {/* Archetypes Filter */}
        <div>
          <span className="font-mono text-[11px] text-gray-400 uppercase font-semibold block mb-1.5">
            {t?.database?.archetype || "Archétype Tactique"} :
          </span>
          <select
            value={filters.archetype}
            onChange={(e) => setFilters(prev => ({ ...prev, archetype: e.target.value }))}
            className="w-full px-2.5 py-1.5 rounded-xl bg-[#0e111a] border border-white/15 text-xs text-gray-200 focus:outline-none focus:border-red-500 font-mono"
          >
            <option value="ALL">{t?.database?.allArchetypes || "Tous les Archétypes"}</option>
            {ARCHETYPES.map((arch) => (
              <option key={arch.id} value={arch.id} className="bg-[#121520]">
                {arch.name}
              </option>
            ))}
          </select>
        </div>

        {/* Collection Ownership Filter */}
        <div>
          <span className="font-mono text-[11px] text-gray-400 uppercase font-semibold block mb-1.5">
            {t?.database?.collectionStatus || "Statut de Collection"} :
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFilters(prev => ({ ...prev, ownership: 'ALL' }))}
              className={`flex-1 py-1 rounded-lg text-xs font-gothic font-bold border transition-all ${
                filters.ownership === 'ALL'
                  ? 'bg-slate-700 text-white border-slate-500'
                  : 'bg-[#0e111a] text-gray-400 border-white/10 hover:text-white'
              }`}
            >
              {t?.database?.allStatus || "Toutes"}
            </button>
            <button
              onClick={() => setFilters(prev => ({ ...prev, ownership: 'owned' }))}
              className={`flex-1 py-1 rounded-lg text-xs font-gothic font-bold border transition-all ${
                filters.ownership === 'owned'
                  ? 'bg-emerald-800 text-emerald-100 border-emerald-500 shadow-sm'
                  : 'bg-[#0e111a] text-gray-400 border-white/10 hover:text-white'
              }`}
            >
              {t?.database?.owned || "✔ Possédées"}
            </button>
            <button
              onClick={() => setFilters(prev => ({ ...prev, ownership: 'missing' }))}
              className={`flex-1 py-1 rounded-lg text-xs font-gothic font-bold border transition-all ${
                filters.ownership === 'missing'
                  ? 'bg-red-950 text-red-200 border-red-500 shadow-blood'
                  : 'bg-[#0e111a] text-gray-400 border-white/10 hover:text-white'
              }`}
            >
              {t?.database?.missing || "❌ Manquantes"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
