import React, { useState, useRef } from 'react';
import { 
  User, Shield, Trophy, Award, CheckCircle2, Circle, Flame, Sparkles, Droplets, 
  ArrowRight, Download, Upload, RefreshCw, Layers, Zap, Info, Plus, Search, 
  RotateCcw, ArrowUpDown, Filter, UserCheck, FileJson, Check, Users
} from 'lucide-react';
import confetti from 'canvas-confetti';
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
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempPlayerName, setTempPlayerName] = useState(userProfile.playerName || 'Mayki');
  const [importNotification, setImportNotification] = useState('');

  const fileInputRef = useRef(null);

  // Advanced Collection Filters
  const [filters, setFilters] = useState({
    search: '',
    clan: 'ALL',
    cost: 'ALL',
    power: 'ALL',
    ownership: 'ALL', // 'ALL' | 'owned' | 'unowned'
    sortBy: 'cost-asc'
  });

  const ownedCardIds = userProfile.ownedCardIds || [];
  const ownedCount = ownedCardIds.length;
  const gameCompletionPct = Math.round((ownedCount / GAME_TOTAL_CARDS) * 100);

  // Export User Profile to JSON File
  const handleExportJSON = () => {
    const exportData = {
      app: "Vampire: The Masquerade – Clans of London",
      version: "1.0",
      exportDate: new Date().toISOString(),
      playerName: userProfile.playerName || "Mayki",
      collectionLevel: userProfile.collectionLevel || Math.max(1, Math.floor(ownedCount / 5)),
      arenaPoints: userProfile.arenaPoints || 1250,
      ownedCardIds: ownedCardIds,
      matchHistory: userProfile.matchHistory || [],
      savedDecks: savedDecks || []
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    const safeName = (userProfile.playerName || 'Mayki').replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `clans_of_london_profil_${safeName}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setImportNotification(`Profil de ${userProfile.playerName || 'Mayki'} exporté avec succès !`);
    setTimeout(() => setImportNotification(''), 3500);
  };

  // Import User Profile from JSON File
  const handleImportJSON = (e) => {
    const fileReader = new FileReader();
    const file = e.target.files?.[0];
    if (!file) return;

    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.ownedCardIds && Array.isArray(parsed.ownedCardIds)) {
          const updatedProfile = {
            ...userProfile,
            playerName: parsed.playerName || userProfile.playerName || 'Mayki',
            collectionLevel: parsed.collectionLevel || Math.max(1, Math.floor(parsed.ownedCardIds.length / 5)),
            arenaPoints: parsed.arenaPoints !== undefined ? parsed.arenaPoints : (userProfile.arenaPoints || 1250),
            ownedCardIds: parsed.ownedCardIds,
            matchHistory: parsed.matchHistory || userProfile.matchHistory || []
          };

          onUpdateProfile(updatedProfile);
          setTempPlayerName(updatedProfile.playerName);
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
          setImportNotification(`Compte "${updatedProfile.playerName}" importé avec succès (${parsed.ownedCardIds.length} cartes) !`);
          setTimeout(() => setImportNotification(''), 4500);
        } else {
          alert('Fichier JSON invalide : structure de cartes manquante.');
        }
      } catch (err) {
        console.error('Error importing JSON profile', err);
        alert('Erreur lors de la lecture du fichier JSON.');
      }
    };

    fileReader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Switch to blank / guest account
  const handleCreateNewAccount = () => {
    const newName = prompt("Entrez le pseudo du nouveau joueur :", "Nouveau Joueur");
    if (!newName) return;

    const newProfile = {
      playerName: newName.trim(),
      collectionLevel: 1,
      arenaPoints: 500,
      ownedCardIds: CARDS_DATA.slice(0, 10).map(c => c.id), // starter pack
      matchHistory: []
    };

    onUpdateProfile(newProfile);
    setTempPlayerName(newProfile.playerName);
    setImportNotification(`Nouveau compte créé pour ${newName} !`);
    setTimeout(() => setImportNotification(''), 3500);
  };

  // Filter & sort cards in collection checklist
  const displayedCards = CARDS_DATA.filter(card => {
    const isOwned = ownedCardIds.includes(card.id);

    // Ownership filter
    if (filters.ownership === 'owned' && !isOwned) return false;
    if (filters.ownership === 'unowned' && isOwned) return false;

    // Clan filter (including Mortal & Duskborn)
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

    // Cost filter
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
    const costA = typeof a.cost === 'number' ? a.cost : 0;
    const costB = typeof b.cost === 'number' ? b.cost : 0;

    switch (filters.sortBy) {
      case 'cost-asc': return costA - costB || a.name.localeCompare(b.name);
      case 'cost-desc': return costB - costA || a.name.localeCompare(b.name);
      case 'power-desc': return b.power - a.power || a.name.localeCompare(b.name);
      case 'power-asc': return a.power - b.power || a.name.localeCompare(b.name);
      case 'clan': return a.clan.localeCompare(b.clan) || costA - costB;
      case 'name-asc': return a.name.localeCompare(b.name);
      default: return costA - costB;
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

  const handleSaveName = (e) => {
    e.preventDefault();
    if (tempPlayerName.trim()) {
      onUpdateProfile({
        ...userProfile,
        playerName: tempPlayerName.trim()
      });
      setIsEditingName(false);
    }
  };

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

      {/* Notification Toast */}
      {importNotification && (
        <div className="p-4 rounded-2xl bg-emerald-950/90 border-2 border-emerald-500 text-emerald-200 text-sm font-gothic font-bold flex items-center justify-between shadow-[0_0_25px_rgba(16,185,129,0.5)] animate-fadeIn">
          <div className="flex items-center space-x-2">
            <Check className="w-5 h-5 text-emerald-400" />
            <span>{importNotification}</span>
          </div>
          <button onClick={() => setImportNotification('')} className="text-emerald-400 hover:text-white text-xs font-mono">✕</button>
        </div>
      )}

      {/* Profile Header & Account Management */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 shadow-2xl relative overflow-hidden space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          {/* Avatar & Player Info */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 via-red-800 to-slate-950 border-2 border-amber-400/80 flex items-center justify-center text-3xl shadow-gold">
              {currentRank.icon}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                {isEditingName ? (
                  <form onSubmit={handleSaveName} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={tempPlayerName}
                      onChange={(e) => setTempPlayerName(e.target.value)}
                      className="px-2.5 py-1 rounded-lg bg-black/60 border border-amber-400 text-sm text-gray-100 font-gothic font-bold"
                      autoFocus
                    />
                    <button type="submit" className="px-2 py-1 rounded-lg bg-amber-600 text-black text-xs font-bold font-gothic">
                      OK
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center space-x-2">
                    <h1 
                      onClick={() => setIsEditingName(true)}
                      className="font-gothic font-extrabold text-2xl text-gray-100 cursor-pointer hover:text-amber-400 transition-colors"
                      title="Cliquez pour modifier votre pseudo"
                    >
                      {userProfile.playerName || 'Mayki'}
                    </h1>
                    <button 
                      onClick={() => setIsEditingName(true)} 
                      className="text-[10px] font-mono text-gray-400 hover:text-amber-300 underline"
                    >
                      (modifier)
                    </button>
                  </div>
                )}

                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300">
                  Niveau {userProfile.collectionLevel || Math.max(1, Math.floor(ownedCount / 5))}
                </span>
              </div>

              <p className="text-xs text-gray-400 font-mono mt-0.5">
                Compte Actif : <strong className="text-amber-400">{userProfile.playerName || 'Mayki'}</strong> • Rang : <strong className="text-emerald-400">{currentRank.name}</strong> • {userProfile.arenaPoints || 1250} Pts d'Arène
              </p>
            </div>
          </div>

          {/* Account System Action Buttons (JSON Download / Upload / New Account) */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Hidden JSON File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportJSON}
              accept=".json"
              className="hidden"
            />

            {/* Export JSON Button */}
            <button
              onClick={handleExportJSON}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white font-gothic font-bold text-xs shadow-gold transition-all"
              title="Télécharger votre fichier de profil et vos cartes au format JSON"
            >
              <Download className="w-4 h-4" />
              <span>Exporter mon Profil (.json)</span>
            </button>

            {/* Import JSON Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 border border-cyan-400/50 text-cyan-200 hover:text-white font-gothic font-bold text-xs shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all"
              title="Charger un fichier JSON existant pour retrouver vos cartes et votre compte"
            >
              <Upload className="w-4 h-4" />
              <span>Importer un Profil (.json)</span>
            </button>

            {/* Switch / New Account */}
            <button
              onClick={handleCreateNewAccount}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#141824] hover:bg-[#1f2538] border border-white/15 text-gray-300 hover:text-white font-gothic font-bold text-xs transition-all"
              title="Créer ou basculer vers un autre compte joueur"
            >
              <Users className="w-4 h-4 text-purple-400" />
              <span>Changer de Compte</span>
            </button>
          </div>
        </div>

        {/* Sync Info Banner */}
        <div className="p-3.5 rounded-xl bg-[#090b10] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-gray-400">
          <div className="flex items-center space-x-2">
            <UserCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              Vous pouvez sauvegarder votre collection en exportant votre fichier JSON, et le recharger à tout moment sur n'importe quel ordinateur pour retrouver instantanément vos <strong>{ownedCount} cartes</strong> !
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Arena & Stats (Left) + Collection Tracker (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Arena Stats & Match Logger (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Arena Stats Card */}
          <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-gothic font-bold text-base text-gray-100 flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>Statistiques d'Arène</span>
              </h3>
              <span className="text-xs font-mono font-bold text-amber-400">
                {currentRank.name}
              </span>
            </div>

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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <h3 className="font-gothic font-bold text-lg text-gray-100 flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Ma Collection de Cartes ({userProfile.playerName || 'Mayki'})</span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5 font-mono">
                  {ownedCount} / {GAME_TOTAL_CARDS} cartes du jeu officiel ({gameCompletionPct}% complété)
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onUnlockBatch?.('all')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-xs font-semibold transition-all"
                  title="Tout débloquer pour tester l'ensemble du jeu"
                >
                  Tout Posséder (217)
                </button>
                <button
                  onClick={() => onUnlockBatch?.('reset')}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-red-950 border border-slate-700 hover:border-red-500 text-gray-400 hover:text-red-300 text-xs font-semibold transition-all"
                  title="Réinitialiser ma collection"
                >
                  Vider
                </button>
              </div>
            </div>

            {/* Filter Bar for Checklist */}
            <div className="space-y-3 p-3.5 rounded-xl bg-[#090b10] border border-white/10 text-xs">
              
              {/* Search & Sort & Reset */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    placeholder="Chercher une carte..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#141824] border border-white/15 text-xs text-gray-100 placeholder-gray-500"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <select
                    value={filters.ownership}
                    onChange={(e) => setFilters(prev => ({ ...prev, ownership: e.target.value }))}
                    className="px-2.5 py-1.5 rounded-lg bg-[#141824] border border-white/15 text-xs text-gray-200 font-mono"
                  >
                    <option value="ALL">Statut : Toutes</option>
                    <option value="owned">✔ Possédées ({ownedCount})</option>
                    <option value="unowned">❌ Manquantes ({GAME_TOTAL_CARDS - ownedCount})</option>
                  </select>

                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                    className="px-2.5 py-1.5 rounded-lg bg-[#141824] border border-white/15 text-xs text-gray-200 font-mono"
                  >
                    <option value="cost-asc">Coût : 1 → 7+</option>
                    <option value="cost-desc">Coût : 7+ → 1</option>
                    <option value="power-desc">Puissance : Max → Min</option>
                    <option value="power-asc">Puissance : Min → Max</option>
                    <option value="clan">Clan : A → Z</option>
                    <option value="name-asc">Nom : A → Z</option>
                  </select>

                  <button
                    onClick={resetFilters}
                    className="p-1.5 rounded-lg bg-[#141824] border border-white/15 text-gray-400 hover:text-white"
                    title="Réinitialiser"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Clan Quick Chips */}
              <div className="flex flex-wrap gap-1 pt-1 border-t border-white/5">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, clan: 'ALL' }))}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-gothic transition-all border ${
                    filters.clan === 'ALL'
                      ? 'bg-red-800 text-white border-red-500'
                      : 'bg-[#141824] text-gray-400 border-white/10 hover:text-white'
                  }`}
                >
                  Tous
                </button>
                {Object.entries(CLANS).map(([ck, c]) => (
                  <button
                    key={ck}
                    onClick={() => setFilters(prev => ({ ...prev, clan: prev.clan === ck ? 'ALL' : ck }))}
                    style={filters.clan === ck ? { backgroundColor: c.bgColor, borderColor: c.borderColor, color: c.themeColor } : {}}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-gothic transition-all border ${
                      filters.clan === ck
                        ? 'font-bold'
                        : 'bg-[#141824] text-gray-400 border-white/10 hover:text-gray-200'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Checklist Results */}
            <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 px-2 py-1">
                <span>{displayedCards.length} cartes affichées</span>
                <span>Cliquer pour cocher / décocher</span>
              </div>

              {displayedCards.map((card) => {
                const isOwned = ownedCardIds.includes(card.id);
                const clanData = CLANS[card.clan] || CLANS.Mortal;

                return (
                  <div
                    key={card.id}
                    onClick={() => onToggleOwnedCard(card.id)}
                    className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer select-none ${
                      isOwned
                        ? 'bg-emerald-950/40 border-emerald-500/60 text-gray-100 hover:bg-emerald-900/50'
                        : 'bg-[#0a0d14] border-white/5 text-gray-500 hover:border-white/20 hover:text-gray-400'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      {isOwned ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      )}

                      <div className="flex items-center space-x-2 truncate">
                        <span className="w-5 h-5 rounded-full bg-red-900 border border-red-400 text-[10px] font-bold text-white flex items-center justify-center font-mono">
                          {card.costDisplay || card.cost}
                        </span>
                        <span className={`font-gothic font-bold text-xs truncate ${isOwned ? 'text-gray-100' : 'text-gray-400'}`}>
                          {card.name}
                        </span>
                        <span className="text-[10px] font-mono" style={{ color: clanData.themeColor }}>
                          {card.clan}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 font-mono text-xs flex-shrink-0">
                      <span className="text-amber-400 font-bold">P{card.power}</span>
                      <span className="text-gray-500 text-[10px]">S{card.series}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${isOwned ? 'bg-emerald-500/20 text-emerald-300' : 'bg-black/40 text-gray-600'}`}>
                        {isOwned ? 'Acquis' : 'Manquant'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
