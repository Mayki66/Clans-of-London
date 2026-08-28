import React, { useState, useRef } from 'react';
import { 
  User, Shield, Trophy, Award, CheckCircle2, Circle, Flame, Sparkles, Droplets, 
  ArrowRight, Download, Upload, RefreshCw, Layers, Zap, Info, Plus, Search, 
  RotateCcw, ArrowUpDown, Filter, UserCheck, FileJson, Check, Users
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CARDS_DATA } from '../../data/cardsData';
import { CLANS } from '../../data/clansData';
import { trackProfileExport, trackUserRegistration } from '../../utils/adminTelemetry';

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
  savedDecks,
  lang = 'fr',
  t
}) {
  const isFrench = lang === 'fr';
  const [matchResult, setMatchResult] = useState('victory');
  const [matchDeck, setMatchDeck] = useState(savedDecks[0]?.name || (t?.profile?.currentDeck || (isFrench ? 'Deck Actuel' : 'Current Deck')));
  const [matchOpponentClan, setMatchOpponentClan] = useState('Brujah');
  const [showSyncInfo, setShowSyncInfo] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempPlayerName, setTempPlayerName] = useState(userProfile.playerName || 'Mayki');
  const [importNotification, setImportNotification] = useState('');

  const fileInputRef = useRef(null);

  // Clickable Filters
  const [filters, setFilters] = useState({
    search: '',
    clan: 'ALL',
    cost: 'ALL',
    power: 'ALL',
    ownership: 'ALL' // 'ALL' | 'owned' | 'unowned'
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

    setImportNotification((t?.profile?.exportSuccess || "Profil de {name} exporté avec succès !").replace("{name}", userProfile.playerName || "Mayki"));
    setTimeout(() => setImportNotification(''), 3500);

    try {
      trackProfileExport(userProfile.playerName || 'Mayki', userProfile.collectionLevel || 1);
    } catch (e) {
      console.error("Error tracking export", e);
    }
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
            arenaPoints: typeof parsed.arenaPoints === 'number' ? parsed.arenaPoints : (userProfile.arenaPoints || 1250),
            ownedCardIds: parsed.ownedCardIds,
            matchHistory: Array.isArray(parsed.matchHistory) ? parsed.matchHistory : (userProfile.matchHistory || [])
          };

          onUpdateProfile(updatedProfile);
          setTempPlayerName(updatedProfile.playerName);
          setImportNotification((t?.profile?.importSuccess || "Profil de {name} importé avec succès ({count} cartes) !").replace("{name}", updatedProfile.playerName).replace("{count}", parsed.ownedCardIds.length));
          setTimeout(() => setImportNotification(''), 3500);
          confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
        } else {
          alert(t?.profile?.invalidJsonAlert || "Fichier JSON invalide. Impossible de trouver les données de collection.");
        }
      } catch (err) {
        console.error('Error importing JSON profile', err);
        alert(t?.profile?.readErrorAlert || "Erreur lors de la lecture du fichier JSON.");
      }
    };

    fileReader.readAsText(file);
    e.target.value = '';
  };

  // Switch to blank / guest account
  const handleCreateNewAccount = () => {
    const defaultName = t?.profile?.newPlayerDefault || 'Nouveau Vampire';
    const newName = prompt(t?.profile?.newPlayerPrompt || "Entrez le pseudo du nouveau joueur :", defaultName);
    if (!newName || !newName.trim()) return;

    const newProfile = {
      playerName: newName.trim(),
      collectionLevel: 1,
      arenaPoints: 500,
      ownedCardIds: CARDS_DATA.slice(0, 10).map(c => c.id),
      matchHistory: []
    };

    onUpdateProfile(newProfile);
    setTempPlayerName(newProfile.playerName);
    setImportNotification((t?.profile?.newAccountSuccess || "Nouveau compte créé pour {name} !").replace("{name}", newName));
    setTimeout(() => setImportNotification(''), 3500);
  };

  // Filter & sort cards in collection checklist
  const displayedCards = CARDS_DATA.filter(card => {
    const isOwned = ownedCardIds.includes(card.id);

    // Ownership clickable filter
    if (filters.ownership === 'owned' && !isOwned) return false;
    if (filters.ownership === 'unowned' && isOwned) return false;

    // Clan clickable filter (including Mortal & Duskborn)
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

    // Cost clickable filter
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

    // Power clickable filter
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
      const matchAbility = card.ability.toLowerCase().includes(q) || (card.ability_en && card.ability_en.toLowerCase().includes(q));
      const matchKeywords = card.keywords?.some(k => k.toLowerCase().includes(q));
      const matchWiki = card.wikiUrl?.toLowerCase().includes(q) || (q.includes('kate') && card.name.toLowerCase().includes('katie'));
      if (!matchName && !matchClan && !matchArch && !matchAbility && !matchKeywords && !matchWiki) return false;
    }

    return true;
  }).sort((a, b) => {
    const costA = typeof a.cost === 'number' ? a.cost : 0;
    const costB = typeof b.cost === 'number' ? b.cost : 0;
    return costA - costB || a.name.localeCompare(b.name);
  });

  const resetFilters = () => {
    setFilters({
      search: '',
      clan: 'ALL',
      cost: 'ALL',
      power: 'ALL',
      ownership: 'ALL'
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
      date: new Date().toLocaleTimeString(isFrench ? 'fr-FR' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
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
                      title={t?.profile?.editTooltip || "Cliquez pour modifier votre pseudo"}
                    >
                      {userProfile.playerName || 'Mayki'}
                    </h1>
                    <button 
                      onClick={() => setIsEditingName(true)} 
                      className="text-[10px] font-mono text-gray-400 hover:text-amber-300 underline"
                    >
                      ({isFrench ? "modifier" : "edit"})
                    </button>
                  </div>
                )}

                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300">
                  {t?.profile?.collectionLevel || "Niveau"} {userProfile.collectionLevel || Math.max(1, Math.floor(ownedCount / 5))}
                </span>
              </div>

              <p className="text-xs text-gray-400 font-mono mt-0.5">
                {t?.profile?.activeAccount || "Compte Actif"} : <strong className="text-amber-400">{userProfile.playerName || 'Mayki'}</strong> • {t?.profile?.rank || "Rang"} : <strong className="text-emerald-400">{currentRank.name}</strong> • {userProfile.arenaPoints || 1250} {t?.profile?.arenaPoints || "Pts d'Arène"}
              </p>
            </div>
          </div>

          {/* Account Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportJSON}
              accept=".json"
              className="hidden"
            />

            <button
              onClick={handleExportJSON}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white font-gothic font-bold text-xs shadow-gold transition-all"
              title="JSON"
            >
              <Download className="w-4 h-4" />
              <span>{t?.profile?.exportProfile || "Exporter mon Profil (.json)"}</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 border border-cyan-400/50 text-cyan-200 hover:text-white font-gothic font-bold text-xs shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all"
              title="JSON"
            >
              <Upload className="w-4 h-4" />
              <span>{t?.profile?.importProfile || "Importer un Profil (.json)"}</span>
            </button>

            <button
              onClick={handleCreateNewAccount}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#141824] hover:bg-[#1f2538] border border-white/15 text-gray-300 hover:text-white font-gothic font-bold text-xs transition-all"
              title="Switch"
            >
              <Users className="w-4 h-4 text-purple-400" />
              <span>{t?.profile?.newAccount || "Changer de Compte"}</span>
            </button>
          </div>
        </div>

        {/* Sync Info Banner */}
        <div className="p-3 rounded-xl bg-[#090b10] border border-white/10 flex items-center space-x-2 text-xs text-gray-400">
          <UserCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>
            {t?.profile?.backupNotice || "Sauvegardez ou transférez votre collection en 1 clic grâce aux boutons d'exportation/importation JSON ci-dessus !"}
          </span>
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
                <span>{t?.profile?.arenaStatsTitle || "Statistiques d'Arène"}</span>
              </h3>
              <span className="text-xs font-mono font-bold text-amber-400">
                {currentRank.name}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-xl bg-[#0a0d14] border border-white/5">
                <span className="text-[10px] font-mono text-gray-400 block uppercase">{t?.profile?.arenaPoints || "Points"}</span>
                <span className="text-lg font-bold font-mono text-amber-400">{userProfile.arenaPoints || 1250}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0a0d14] border border-white/5">
                <span className="text-[10px] font-mono text-gray-400 block uppercase">{t?.profile?.matchesPlayed || "Matchs"}</span>
                <span className="text-lg font-bold font-mono text-gray-200">{totalMatches}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0a0d14] border border-white/5">
                <span className="text-[10px] font-mono text-gray-400 block uppercase">{t?.profile?.winrate || "Winrate"}</span>
                <span className="text-lg font-bold font-mono text-emerald-400">{winrate}%</span>
              </div>
            </div>

            {/* Ranks Ladder */}
            <div className="space-y-1.5 pt-2 border-t border-white/10">
              <span className="text-[11px] font-mono text-gray-400 uppercase font-bold">{t?.profile?.londonLeague || "Ligue de Londres :"}</span>
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
              <span>{t?.profile?.logMatchTitle || "Enregistrer un Match d'Arène"}</span>
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
                  {t?.profile?.victoryBtn || "Victoire (+35)"}
                </button>
                <button
                  type="button"
                  onClick={() => setMatchResult('defeat')}
                  className={`py-2 rounded-xl text-xs font-gothic font-bold border transition-all ${
                    matchResult === 'defeat'
                      ? 'bg-red-900 border-red-400 text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                      : 'bg-slate-900 border-white/10 text-gray-400'
                  }`}
                >
                  {t?.profile?.defeatBtn || "Défaite (-15)"}
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400 uppercase">{t?.profile?.deckUsedLabel || "Deck Utilisé :"}</label>
                <select
                  value={matchDeck}
                  onChange={(e) => setMatchDeck(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#141824] border border-white/10 text-xs text-gray-200 focus:outline-none focus:border-amber-400"
                >
                  <option value={t?.profile?.currentDeck || "Deck Actuel"}>{t?.profile?.currentDeck || "Deck Actuel"}</option>
                  {savedDecks.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400 uppercase">{t?.profile?.opponentClanLabel || "Clan Adverse :"}</label>
                <select
                  value={matchOpponentClan}
                  onChange={(e) => setMatchOpponentClan(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#141824] border border-white/10 text-xs text-gray-200 focus:outline-none focus:border-amber-400"
                >
                  {Object.keys(CLANS).map(ck => (
                    <option key={ck} value={ck}>{ck}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-gradient-to-r from-red-800 to-rose-900 hover:from-red-700 text-white font-gothic font-bold text-xs shadow-blood transition-all"
              >
                {t?.profile?.confirmResultBtn || "Valider le Résultat"}
              </button>
            </form>

            {history.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-white/10 max-h-48 overflow-y-auto pr-1">
                <div className="text-[10px] font-mono text-gray-500 uppercase">{t?.profile?.recentMatchesTitle || "Derniers Matchs :"}</div>
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

        {/* Right Column: Collection Manager Checklist with Clickable Pill Buttons (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-4 shadow-2xl">
            
            {/* Header & Global Progress */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <h3 className="font-gothic font-bold text-lg text-gray-100 flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>{t?.profile?.collectionChecklist || "Ma Collection de Cartes"} ({userProfile.playerName || 'Mayki'})</span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5 font-mono">
                  {ownedCount} / {GAME_TOTAL_CARDS} {t?.database?.cardsCount || "cartes"} ({gameCompletionPct}% {t?.profile?.completed || "complété"})
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onUnlockBatch?.('all')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-xs font-semibold transition-all"
                  title="Unlock all"
                >
                  {t?.profile?.unlockAll || "Tout Débloquer (217)"}
                </button>
                <button
                  onClick={() => onUnlockBatch?.('reset')}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-red-950 border border-slate-700 hover:border-red-500 text-gray-400 hover:text-red-300 text-xs font-semibold transition-all"
                  title="Reset"
                >
                  {t?.profile?.resetCollection || "Vider"}
                </button>
              </div>
            </div>

            {/* Clickable Filters Panel */}
            <div className="space-y-3 p-3.5 rounded-xl bg-[#090b10] border border-white/10 text-xs">
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  placeholder={t?.profile?.searchPlaceholder || "Rechercher une carte par nom, clan, capacité..."}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#141824] border border-white/15 text-xs text-gray-100 placeholder-gray-500"
                />
              </div>

              {/* Clickable Ownership Status */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">{t?.profile?.ownershipFilterLabel || "Statut de possession :"}</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, ownership: 'ALL' }))}
                    className={`px-3 py-1 rounded-lg text-xs font-gothic font-bold border transition-all ${
                      filters.ownership === 'ALL'
                        ? 'bg-amber-600 text-white border-amber-400 shadow-gold'
                        : 'bg-[#141824] text-gray-400 border-white/10 hover:text-white'
                    }`}
                  >
                    {t?.profile?.allCards ? `${t?.profile?.allCards} (${GAME_TOTAL_CARDS})` : `Toutes (${GAME_TOTAL_CARDS})`}
                  </button>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, ownership: 'owned' }))}
                    className={`px-3 py-1 rounded-lg text-xs font-gothic font-bold border transition-all ${
                      filters.ownership === 'owned'
                        ? 'bg-emerald-700 text-white border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                        : 'bg-[#141824] text-gray-400 border-white/10 hover:text-white'
                    }`}
                  >
                    {t?.profile?.onlyOwned ? `${t?.profile?.onlyOwned} (${ownedCount})` : `✔ Possédées (${ownedCount})`}
                  </button>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, ownership: 'unowned' }))}
                    className={`px-3 py-1 rounded-lg text-xs font-gothic font-bold border transition-all ${
                      filters.ownership === 'unowned'
                        ? 'bg-red-800 text-white border-red-500 shadow-blood'
                        : 'bg-[#141824] text-gray-400 border-white/10 hover:text-white'
                    }`}
                  >
                    {t?.profile?.onlyMissing ? `${t?.profile?.onlyMissing} (${GAME_TOTAL_CARDS - ownedCount})` : `❌ Manquantes (${GAME_TOTAL_CARDS - ownedCount})`}
                  </button>
                </div>
              </div>

              {/* Clickable Clan Quick Chips */}
              <div className="space-y-1 pt-1 border-t border-white/5">
                <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">{t?.profile?.clanFilterLabel || "Clan / Faction :"}</span>
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, clan: 'ALL' }))}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-gothic font-bold transition-all border ${
                      filters.clan === 'ALL'
                        ? 'bg-red-800 text-white border-red-500 shadow-blood'
                        : 'bg-[#141824] text-gray-400 border-white/10 hover:text-white'
                    }`}
                  >
                    {t?.profile?.allFilter || "Tous"}
                  </button>
                  {Object.entries(CLANS).map(([ck, c]) => (
                    <button
                      key={ck}
                      onClick={() => setFilters(prev => ({ ...prev, clan: prev.clan === ck ? 'ALL' : ck }))}
                      style={filters.clan === ck ? { backgroundColor: c.bgColor, borderColor: c.borderColor, color: c.themeColor } : {}}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-gothic transition-all border ${
                        filters.clan === ck
                          ? 'font-bold shadow-sm'
                          : 'bg-[#141824] text-gray-400 border-white/10 hover:text-gray-200'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clickable Blood Cost & Power Multi-Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-white/5">
                
                {/* Cost Filter */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-gray-400 uppercase font-bold flex items-center space-x-1">
                    <Droplets className="w-3 h-3 text-red-400" />
                    <span>{t?.profile?.costFilterLabel || "Coût en Sang :"}</span>
                  </span>
                  <div className="flex flex-wrap items-center gap-1">
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, cost: 'ALL' }))}
                      className={`px-2 py-1 rounded-md text-[11px] font-mono font-bold border ${
                        filters.cost === 'ALL' ? 'bg-red-800 text-white border-red-500 shadow-blood' : 'bg-[#141824] text-gray-400 border-white/10 hover:text-white'
                      }`}
                    >
                      {t?.profile?.allFilter || "Tous"}
                    </button>
                    {[1, 2, 3, 4, 5, 6, '7+', 'X'].map(cost => (
                      <button
                        key={cost}
                        onClick={() => setFilters(prev => ({ ...prev, cost: filters.cost === cost ? 'ALL' : cost }))}
                        className={`w-7 py-1 rounded-md text-[11px] font-mono font-bold border transition-all flex items-center justify-center ${
                          filters.cost === cost
                            ? 'bg-red-600 text-white border-red-400 shadow-blood'
                            : 'bg-[#141824] text-gray-400 border-white/10 hover:text-white'
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
                    <span>{t?.profile?.powerFilterLabel || "Puissance :"}</span>
                  </span>
                  <div className="flex flex-wrap items-center gap-1">
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, power: 'ALL' }))}
                      className={`px-2 py-1 rounded-md text-[11px] font-mono font-bold border ${
                        filters.power === 'ALL' ? 'bg-amber-800 text-white border-amber-500 shadow-gold' : 'bg-[#141824] text-gray-400 border-white/10 hover:text-white'
                      }`}
                    >
                      {t?.profile?.allFilter || "Tous"}
                    </button>
                    {['1-3', '4-6', '7-9', '10+'].map(pw => (
                      <button
                        key={pw}
                        onClick={() => setFilters(prev => ({ ...prev, power: filters.power === pw ? 'ALL' : pw }))}
                        className={`px-2 py-1 rounded-md text-[10px] font-mono font-bold border transition-all ${
                          filters.power === pw
                            ? 'bg-amber-600 text-white border-amber-400 shadow-gold'
                            : 'bg-[#141824] text-gray-400 border-white/10 hover:text-white'
                        }`}
                      >
                        {pw}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* Interactive Cards Checklist */}
            <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 px-2 py-1">
                <span>{displayedCards.length} {t?.database?.cardsCount || "cartes"}</span>
                <span>{t?.profile?.toggleRowHint || "Cliquer sur une ligne pour cocher / décocher"}</span>
              </div>

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
                        {card.costDisplay || card.cost}
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
                        {isOwned ? (t?.profile?.ownedBadge || '✓ Possédée') : (t?.profile?.missingBadge || 'Non possédée')}
                      </span>
                    </div>
                  </div>
                );
              })}

              {displayedCards.length === 0 && (
                <div className="text-center py-10 text-xs text-gray-500 space-y-2">
                  <p>{t?.database?.noCardsMatch || "Aucune carte ne correspond aux critères sélectionnés."}</p>
                  <button
                    onClick={resetFilters}
                    className="px-3 py-1 rounded-lg bg-slate-800 text-gray-300 hover:text-white"
                  >
                    {t?.database?.resetFiltersBtn || "Réinitialiser les filtres"}
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
