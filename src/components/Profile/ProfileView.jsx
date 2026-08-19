import React, { useState } from 'react';
import { User, Shield, Trophy, Award, CheckCircle2, Circle, Flame, Sparkles, Droplets, ArrowRight, Download, Upload, RefreshCw, Layers, Zap, Info, Plus, Search, RotateCcw, ArrowUpDown, Filter } from 'lucide-react';
import { CARDS_DATA } from '../../data/cardsData';
import { CLANS } from '../../data/clansData';

const GAME_TOTAL_CARDS = 217;

const ARENA_RANKS = [
  { id: 'neophyte', name: 'Néophyte de Whitechapel', minPts: 0, icon: '🩸' },
  { id: 'initiate', name: 'Initié des Ombres', minPts: 500, icon: '🗡️' },
  { id: 'ancilla', name: 'Ancilla de Soho', minPts: 1200, icon: '⚡' },
  { id: 'elder', name: 'Ancien de la City', minPts: 2200, icon: '🛡️' },
  { id: 'primogen', name: 'Primogène de Westminster', minPts: 3500, icon: '⚜️' },
  { id: 'prince', name: 'Prince de Londres', minPts: 5000, icon: '👑' }
];

export default function ProfileView({
  userProfile,
  onUpdateProfile,
  onToggleOwnedCard,
  onUnlockBatch,
  deckCards,
  savedDecks
}) {
  const [matchResult, setMatchResult] = useState('victory'); // 'victory' | 'defeat'
  const [matchDeck, setMatchDeck] = useState(savedDecks[0]?.name || 'Deck Actuel');
  const [matchOpponentClan, setMatchOpponentClan] = useState('Brujah');
  const [showSyncInfo, setShowSyncInfo] = useState(false);

  // Advanced Collection Filters
  const [filters, setFilters] = useState({
    search: '',
    clan: 'ALL',
    cost: 'ALL',
    power: 'ALL',
    ownership: 'ALL', // 'ALL' | 'owned' | 'unowned'
    sortBy: 'cost-asc' // 'cost-asc' | 'cost-desc' | 'power-desc' | 'power-asc' | 'name-asc' | 'clan'
  });

  const ownedCardIds = userProfile.ownedCardIds || [];
  const ownedCount = ownedCardIds.length;
  const gameCompletionPct = Math.round((ownedCount / GAME_TOTAL_CARDS) * 100);
  const dbCompletionPct = Math.round((ownedCount / CARDS_DATA.length) * 100);

  // Filter & sort cards in collection checklist
  const displayedCards = CARDS_DATA.filter(card => {
    const isOwned = ownedCardIds.includes(card.id);

    // Ownership filter
    if (filters.ownership === 'owned' && !isOwned) return false;
    if (filters.ownership === 'unowned' && isOwned) return false;

    // Clan filter
    if (filters.clan !== 'ALL' && card.clan !== filters.clan) return false;

    // Cost filter
    if (filters.cost !== 'ALL') {
      if (filters.cost === '7+' && card.cost < 7) return false;
      if (typeof filters.cost === 'number' && card.cost !== filters.cost) return false;
    }

    // Power filter
    if (filters.power !== 'ALL') {
      if (filters.power === '1-3' && (card.power < 1 || card.power > 3)) return false;
      if (filters.power === '4-6' && (card.power < 4 || card.power > 6)) return false;
      if (filters.power === '7-9' && (card.power < 7 || card.power > 9)) return false;
      if (filters.power === '10+' && card.power < 10) return false;
    }

    // Search query
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchName = card.name.toLowerCase().includes(q);
      const matchClan = card.clan.toLowerCase().includes(q);
      const matchArch = card.archetype.toLowerCase().includes(q);
      const matchAbility = card.ability.toLowerCase().includes(q);
      const matchKeywords = card.keywords?.some(k => k.toLowerCase().includes(q));
      const matchWiki = card.wikiUrl?.toLowerCase().includes(q) || (q.includes('kate') && card.name.toLowerCase().includes('katie'));
      if (!matchName && !matchClan && !matchArch && !matchAbility && !matchKeywords && !matchWiki) return false;
    }

    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'cost-asc': return a.cost - b.cost || a.name.localeCompare(b.name);
      case 'cost-desc': return b.cost - a.cost || a.name.localeCompare(b.name);
      case 'power-desc': return b.power - a.power || a.name.localeCompare(b.name);
      case 'power-asc': return a.power - b.power || a.name.localeCompare(b.name);
      case 'clan': return a.clan.localeCompare(b.clan) || a.cost - b.cost;
      case 'name-asc': return a.name.localeCompare(b.name);
      default: return a.cost - b.cost;
    }
  });

  const resetFilters = () => {
    setFilters({
      search: '',
      clan: 'ALL',
      cost: 'ALL',
      power: 'ALL',
      ownership: 'ALL',
      sortBy: 'cost-asc'
    });
  };

  // Match stats
  const history = userProfile.matchHistory || [];
  const totalMatches = history.length;
  const victories = history.filter(m => m.result === 'victory').length;
  const winrate = totalMatches > 0 ? Math.round((victories / totalMatches) * 100) : 0;

  const currentRank = ARENA_RANKS.slice().reverse().find(r => (userProfile.arenaPoints || 0) >= r.minPts) || ARENA_RANKS[0];

  const handleAddMatch = (e) => {
    e.preventDefault();
    const ptsDelta = matchResult === 'victory' ? 35 : -15;
    const newPts = Math.max(0, (userProfile.arenaPoints || 0) + ptsDelta);
    
    const newMatch = {
      id: `match-${Date.now()}`,
      date: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      result: matchResult,
      deckName: matchDeck,
      opponentClan: matchOpponentClan,
      pointsChange: ptsDelta > 0 ? `+${ptsDelta}` : `${ptsDelta}`
    };

    onUpdateProfile({
      ...userProfile,
      arenaPoints: newPts,
      matchHistory: [newMatch, ...history]
    });
  };

  return (
    <div className="space-y-6">
      {/* Profile & Sync Top Header */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 via-red-800 to-slate-950 border-2 border-amber-400/80 flex items-center justify-center text-3xl shadow-gold">
              {currentRank.icon}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-gothic font-extrabold text-2xl text-gray-100">
                  {userProfile.playerName || 'Mayki (Kindred)'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300">
                  Niveau de Collection {userProfile.collectionLevel || 14}
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                Rang : <strong className="text-amber-400">{currentRank.name}</strong> • {userProfile.arenaPoints || 1250} Points d'Arène
              </p>
            </div>
          </div>

          {/* Quick Bridge Information Button */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSyncInfo(!showSyncInfo)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#141824] hover:bg-[#1e2538] border border-white/15 text-xs text-gray-300 hover:text-white font-gothic transition-all"
            >
              <Info className="w-4 h-4 text-amber-400" />
              <span>Comment fonctionne le Pont de Jeu ?</span>
            </button>
          </div>
        </div>

        {/* Sync Info Modal / Callout */}
        {showSyncInfo && (
          <div className="mt-4 p-4 rounded-xl bg-[#090b10] border border-amber-500/30 text-xs text-gray-300 space-y-2 animate-fadeIn">
            <div className="flex items-center space-x-2 text-amber-400 font-bold font-gothic">
              <Zap className="w-4 h-4" />
              <span>Synchronisation & Fonctionnement du Hub</span>
            </div>
            <p className="leading-relaxed">
              Le jeu <em>Vampire: The Masquerade – Clans of London</em> utilise les comptes officiels mobiles (Google Play Games / Game Center). Comme les serveurs du jeu sont fermés sans API publique, ce hub vous permet de <strong>cocher vos cartes obtenues en jeu</strong> et de <strong>suivre vos victoires d'arène</strong>.
            </p>
            <p className="text-emerald-400 leading-relaxed font-semibold">
              ✔ Vos données sont automatiquement enregistrées dans votre navigateur (LocalStorage). Vous pouvez filtrer tout le Deck Builder et les Decks Méta pour n'afficher que les cartes que vous possédez !
            </p>
          </div>
        )}
      </div>

      {/* Main Grid: Arena & Stats (Left) + Collection Tracker (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Arena Stats & Match Logger (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Arena Stats Card */}
          <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-4 shadow-xl">
            <h3 className="font-gothic font-bold text-base text-gray-100 flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Statistiques d'Arène</span>
            </h3>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-xl bg-[#0a0d14] border border-white/5">
                <span className="text-[10px] font-mono text-gray-400 block uppercase">Points</span>
                <span className="text-lg font-bold font-mono text-amber-400">{userProfile.arenaPoints || 1250}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0a0d14] border border-white/5">
                <span className="text-[10px] font-mono text-gray-400 block uppercase">Matchs</span>
                <span className="text-lg font-bold font-mono text-gray-200">{totalMatches}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0a0d14] border border-white/5">
                <span className="text-[10px] font-mono text-gray-400 block uppercase">Winrate</span>
                <span className="text-lg font-bold font-mono text-emerald-400">{winrate}%</span>
              </div>
            </div>

            {/* Ranks Ladder */}
            <div className="space-y-1.5 pt-2 border-t border-white/10">
              <span className="text-[11px] font-mono text-gray-400 uppercase font-bold">Ligue de Londres :</span>
              {ARENA_RANKS.map((rank) => {
                const isReached = (userProfile.arenaPoints || 0) >= rank.minPts;
                const isCurrent = currentRank.id === rank.id;

                return (
                  <div
                    key={rank.id}
                    className={`flex items-center justify-between p-2 rounded-lg transition-all ${
                      isCurrent
                        ? 'bg-amber-950/40 border border-amber-500/60 shadow-gold'
                        : isReached
                        ? 'bg-[#10131d] border border-white/5 opacity-80'
                        : 'bg-[#08090f] opacity-40'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="text-lg">{rank.icon}</span>
                      <span className="font-gothic font-semibold text-xs text-gray-200">
                        {rank.name}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-gray-400">
                      {rank.minPts} Pts
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Match Logger */}
          <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-4 shadow-xl">
            <h3 className="font-gothic font-bold text-base text-gray-100 flex items-center space-x-2">
              <Award className="w-5 h-5 text-red-500" />
              <span>Enregistrer un Match d'Arène</span>
            </h3>

            <form onSubmit={handleAddMatch} className="space-y-3">
              {/* Victory / Defeat switch */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMatchResult('victory')}
                  className={`py-2 rounded-xl text-xs font-gothic font-bold border transition-all ${
                    matchResult === 'victory'
                      ? 'bg-emerald-900 border-emerald-400 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                      : 'bg-slate-900 border-white/10 text-gray-400'
                  }`}
                >
                  🏆 Victoire (+35 Pts)
                </button>
                <button
                  type="button"
                  onClick={() => setMatchResult('defeat')}
                  className={`py-2 rounded-xl text-xs font-gothic font-bold border transition-all ${
                    matchResult === 'defeat'
                      ? 'bg-red-950 border-red-500 text-white shadow-blood'
                      : 'bg-slate-900 border-white/10 text-gray-400'
                  }`}
                >
                  💀 Défaite (-15 Pts)
                </button>
              </div>

              {/* Deck Used */}
              <div>
                <label className="block text-[11px] font-mono text-gray-400 mb-1">
                  Deck Utilisé
                </label>
                <input
                  type="text"
                  value={matchDeck}
                  onChange={(e) => setMatchDeck(e.target.value)}
                  placeholder="Ex: Hecata Murder, Brujah Rush..."
                  className="w-full px-3 py-1.5 rounded-xl bg-[#090b10] border border-white/15 text-xs text-gray-200"
                />
              </div>

              {/* Opponent Clan */}
              <div>
                <label className="block text-[11px] font-mono text-gray-400 mb-1">
                  Clan Adverse Affronté
                </label>
                <select
                  value={matchOpponentClan}
                  onChange={(e) => setMatchOpponentClan(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-[#090b10] border border-white/15 text-xs text-gray-200"
                >
                  {Object.keys(CLANS).map(c => (
                    <option key={c} value={c} className="bg-[#121520]">{c}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-800 to-rose-900 hover:from-red-700 hover:to-rose-800 text-white font-gothic font-bold text-xs shadow-blood transition-all"
              >
                Valider & Actualiser mes Stats
              </button>
            </form>

            {/* Match History Logs */}
            {history.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-white/10 max-h-48 overflow-y-auto pr-1">
                <div className="text-[10px] font-mono text-gray-500 uppercase">Derniers Matchs :</div>
                {history.slice(0, 8).map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#0a0d14] border border-white/5 text-xs"
                  >
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${m.result === 'victory' ? 'bg-emerald-400' : 'bg-red-500'}`} />
                      <span className="font-semibold text-gray-200 truncate max-w-[120px]">{m.deckName}</span>
                      <span className="text-[10px] text-gray-500">vs {m.opponentClan}</span>
                    </div>
                    <span className={`font-mono font-bold ${m.result === 'victory' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {m.pointsChange} Pts
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Collection Manager Checklist with Clan/Cost/Power Filters (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-4 shadow-2xl">
            
            {/* Header & Global Progress */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <h3 className="font-gothic font-bold text-lg text-gray-100 flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-purple-400" />
                  <span>Ma Collection de Cartes ({ownedCount} / {GAME_TOTAL_CARDS})</span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Progression Globale Jeu : <strong className="text-emerald-400">{gameCompletionPct}%</strong> • Actuellement affichées : <strong>{displayedCards.length} cartes</strong>
                </p>
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => onUnlockBatch([0, 1, 2, 3, 4, 5])}
                  className="px-2.5 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-all"
                >
                  Tout Cocher
                </button>
                <button
                  onClick={() => onUnlockBatch([])}
                  className="px-2.5 py-1 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 text-xs font-semibold transition-all"
                >
                  Tout Décocher
                </button>
              </div>
            </div>

            {/* Quick Filter Controls: Search & Sort */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <div className="sm:col-span-8 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  placeholder="Rechercher une carte (nom, mot-clé, capacité)..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#090b10] border border-white/15 text-xs text-gray-200 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="sm:col-span-4 flex items-center space-x-1.5">
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                  className="w-full px-2.5 py-2 rounded-xl bg-[#090b10] border border-white/15 text-xs text-gray-200 focus:outline-none focus:border-red-500"
                >
                  <option value="cost-asc">Tri : Coût (1 → 7+)</option>
                  <option value="cost-desc">Tri : Coût (7+ → 1)</option>
                  <option value="power-desc">Tri : Puissance Max</option>
                  <option value="power-asc">Tri : Puissance Min</option>
                  <option value="name-asc">Tri : Nom A-Z</option>
                  <option value="clan">Tri : Par Clan</option>
                </select>

                <button
                  onClick={resetFilters}
                  className="p-2 rounded-xl bg-[#090b10] hover:bg-[#141824] border border-white/15 text-gray-400 hover:text-white"
                  title="Réinitialiser les filtres"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Ownership Filter Tabs */}
            <div className="flex items-center space-x-1 p-1 rounded-xl bg-[#08090f] border border-white/5">
              <button
                onClick={() => setFilters(prev => ({ ...prev, ownership: 'ALL' }))}
                className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  filters.ownership === 'ALL'
                    ? 'bg-[#181d2e] text-white border border-white/15 shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Toutes ({CARDS_DATA.length})
              </button>
              <button
                onClick={() => setFilters(prev => ({ ...prev, ownership: 'owned' }))}
                className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  filters.ownership === 'owned'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/60 shadow-sm'
                    : 'text-gray-400 hover:text-emerald-300'
                }`}
              >
                ✔ Possédées ({ownedCount})
              </button>
              <button
                onClick={() => setFilters(prev => ({ ...prev, ownership: 'unowned' }))}
                className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  filters.ownership === 'unowned'
                    ? 'bg-red-950 text-red-300 border border-red-500/60 shadow-sm'
                    : 'text-gray-400 hover:text-red-300'
                }`}
              >
                ✗ Non Possédées ({CARDS_DATA.length - ownedCount})
              </button>
            </div>

            {/* Clan / Family Filter Pills */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-gray-400 uppercase font-bold block">
                Filtrer par Famille / Clan :
              </span>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, clan: 'ALL' }))}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-gothic font-bold transition-all border ${
                    filters.clan === 'ALL'
                      ? 'bg-red-700 text-white border-red-400'
                      : 'bg-[#090b10] text-gray-400 border-white/5 hover:text-white'
                  }`}
                >
                  Tous les Clans
                </button>
                {Object.keys(CLANS).map(c => {
                  const isSelected = filters.clan === c;
                  const cInfo = CLANS[c];

                  return (
                    <button
                      key={c}
                      onClick={() => setFilters(prev => ({ ...prev, clan: isSelected ? 'ALL' : c }))}
                      className={`px-2 py-1 rounded-lg text-[11px] font-gothic font-semibold transition-all border ${
                        isSelected
                          ? 'text-white border-white/40 shadow-sm'
                          : 'bg-[#090b10] text-gray-400 border-white/5 hover:text-white'
                      }`}
                      style={{
                        backgroundColor: isSelected ? cInfo.themeColor : undefined,
                        borderColor: isSelected ? cInfo.themeColor : undefined
                      }}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Blood Cost & Power Multi-Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-white/5">
              {/* Cost Filter */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-gray-400 uppercase font-bold flex items-center space-x-1">
                  <Droplets className="w-3 h-3 text-red-400" />
                  <span>Coût en Sang :</span>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, cost: 'ALL' }))}
                    className={`flex-1 py-1 rounded-md text-[11px] font-mono font-bold border ${
                      filters.cost === 'ALL' ? 'bg-red-800 text-white border-red-500' : 'bg-[#090b10] text-gray-400 border-white/5'
                    }`}
                  >
                    Tous
                  </button>
                  {[1, 2, 3, 4, 5, 6, '7+'].map(cost => (
                    <button
                      key={cost}
                      onClick={() => setFilters(prev => ({ ...prev, cost: filters.cost === cost ? 'ALL' : cost }))}
                      className={`w-7 py-1 rounded-md text-[11px] font-mono font-bold border transition-all ${
                        filters.cost === cost
                          ? 'bg-red-600 text-white border-red-400 shadow-blood'
                          : 'bg-[#090b10] text-gray-400 border-white/5 hover:text-white'
                      }`}
                    >
                      {cost}
                    </button>
                  ))}
                </div>
              </div>

              {/* Power Filter */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-gray-400 uppercase font-bold flex items-center space-x-1">
                  <Shield className="w-3 h-3 text-amber-400" />
                  <span>Puissance :</span>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, power: 'ALL' }))}
                    className={`flex-1 py-1 rounded-md text-[11px] font-mono font-bold border ${
                      filters.power === 'ALL' ? 'bg-amber-800 text-white border-amber-500' : 'bg-[#090b10] text-gray-400 border-white/5'
                    }`}
                  >
                    Tous
                  </button>
                  {['1-3', '4-6', '7-9', '10+'].map(pw => (
                    <button
                      key={pw}
                      onClick={() => setFilters(prev => ({ ...prev, power: filters.power === pw ? 'ALL' : pw }))}
                      className={`flex-1 py-1 rounded-md text-[10px] font-mono font-bold border transition-all ${
                        filters.power === pw
                          ? 'bg-amber-600 text-white border-amber-400 shadow-gold'
                          : 'bg-[#090b10] text-gray-400 border-white/5 hover:text-white'
                      }`}
                    >
                      {pw}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Cards Checklist */}
            <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1 pt-1">
              {displayedCards.map((card) => {
                const isOwned = ownedCardIds.includes(card.id);
                const clanInfo = CLANS[card.clan] || CLANS.Mortal;

                return (
                  <div
                    key={card.id}
                    onClick={() => onToggleOwnedCard(card.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                      isOwned
                        ? 'bg-[#121622] hover:bg-[#181d2e] border-emerald-500/50 shadow-sm'
                        : 'bg-[#08090f] hover:bg-[#0d1017] border-white/5 opacity-55 hover:opacity-85'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      {/* Checkbox Icon */}
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                        isOwned ? 'bg-emerald-600 text-white shadow-sm' : 'border border-gray-600 bg-black/40'
                      }`}>
                        {isOwned && <CheckCircle2 className="w-4 h-4" />}
                      </div>

                      {/* Blood Cost & Name */}
                      <div className="w-6 h-6 rounded-full bg-red-900 border border-red-500 text-[11px] font-bold text-white flex items-center justify-center font-mono shadow-sm">
                        {card.cost}
                      </div>

                      <div className="truncate">
                        <div className="font-gothic font-semibold text-xs text-gray-100 truncate">
                          {card.name}
                        </div>
                        <div className="flex items-center space-x-1.5 text-[10px] text-gray-400">
                          <span style={{ color: clanInfo.themeColor }} className="font-medium">{card.clan}</span>
                          <span>•</span>
                          <span className="text-amber-400 font-mono font-bold">P{card.power}</span>
                          <span>•</span>
                          <span className="text-gray-500">{card.archetype}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/40 border border-white/10 text-gray-300">
                        {card.rarity}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                        isOwned ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40' : 'bg-black/30 text-gray-500'
                      }`}>
                        {isOwned ? '✓ Possédée' : 'Non possédée'}
                      </span>
                    </div>
                  </div>
                );
              })}

              {displayedCards.length === 0 && (
                <div className="text-center py-10 text-xs text-gray-500 space-y-2">
                  <p>Aucune carte ne correspond aux filtres sélectionnés.</p>
                  <button
                    onClick={resetFilters}
                    className="px-3 py-1 rounded-lg bg-slate-800 text-gray-300 hover:text-white"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
