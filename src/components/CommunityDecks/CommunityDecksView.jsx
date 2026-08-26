import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Share2, Search, ArrowRight, Swords, Copy, Check, Plus, 
  Sparkles, Layers, Shield, Droplets, Heart, Filter, BookOpen, ExternalLink, RefreshCw, Link as LinkIcon, Radio 
} from 'lucide-react';
import { CARDS_DATA } from '../../data/cardsData';
import { CLANS } from '../../data/clansData';
import { 
  getLocalCommunityDecks, 
  saveLocalCommunityDecks, 
  fetchCloudCommunityDecks, 
  publishCommunityDeck, 
  likeCommunityDeck,
  subscribeToCommunityDecks 
} from '../../data/communityDecks';
import { getShareableCommunityDeckUrl } from '../../utils/router';
import CardArtwork from '../Card/CardArtwork';
import confetti from 'canvas-confetti';

export default function CommunityDecksView({
  onLoadDeck,
  onInspectCard,
  onNavigateToArena,
  currentDeckCards = [],
  currentDeckName = "Mon Deck",
  userProfile,
  targetDeckId = null,
  lang = 'fr',
  t
}) {
  const [communityDecks, setCommunityDecks] = useState(getLocalCommunityDecks());
  const [loadingCloud, setLoadingCloud] = useState(false);
  const [realtimeStatus, setRealtimeStatus] = useState('connecting');
  const [liveNotification, setLiveNotification] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClan, setSelectedClan] = useState('ALL');
  const [copiedDeckId, setCopiedDeckId] = useState(null);
  const [copiedLinkDeckId, setCopiedLinkDeckId] = useState(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishName, setPublishName] = useState(currentDeckName);
  const [publishAuthor, setPublishAuthor] = useState(userProfile?.playerName || 'Mayki');
  const [publishStrategy, setPublishStrategy] = useState('');
  const [likedDecks, setLikedDecks] = useState({});
  const deckRefs = useRef({});

  const loadDecks = async () => {
    setLoadingCloud(true);
    try {
      const decks = await fetchCloudCommunityDecks();
      setCommunityDecks(decks);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingCloud(false);
    }
  };

  // Chargement initial + Écoute WebSocket Realtime
  useEffect(() => {
    loadDecks();

    const unsubscribe = subscribeToCommunityDecks(
      ({ type, deck, deckId }) => {
        if (type === 'INSERT' && deck) {
          setCommunityDecks(prev => {
            if (prev.some(d => d.id === deck.id)) return prev;
            const filtered = prev.filter(d => 
              !(d.name.toLowerCase() === deck.name.toLowerCase() && d.author.toLowerCase() === deck.author.toLowerCase())
            );
            const updated = [deck, ...filtered];
            saveLocalCommunityDecks(updated);
            return updated;
          });

          setLiveNotification(
            lang === 'en'
              ? `🆕 Live update: "${deck.name}" by ${deck.author} was just shared!`
              : `🆕 En direct : "${deck.name}" par ${deck.author} vient d'être publié !`
          );
          setTimeout(() => setLiveNotification(null), 6000);
        } else if (type === 'UPDATE' && deck) {
          setCommunityDecks(prev => {
            const updated = prev.map(d => d.id === deck.id ? { ...d, ...deck } : d);
            saveLocalCommunityDecks(updated);
            return updated;
          });
        } else if (type === 'DELETE' && deckId) {
          setCommunityDecks(prev => {
            const updated = prev.filter(d => d.id !== deckId);
            saveLocalCommunityDecks(updated);
            return updated;
          });
        }
      },
      (status) => {
        setRealtimeStatus(status);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [lang]);

  // Filter Decks
  const filteredDecks = communityDecks.filter(deck => {
    if (selectedClan !== 'ALL' && deck.clan !== selectedClan) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = (deck.name || '').toLowerCase().includes(q) || (deck.name_en || '').toLowerCase().includes(q);
      const matchAuthor = (deck.author || '').toLowerCase().includes(q);
      const matchClan = (deck.clan || '').toLowerCase().includes(q);
      const matchStrategy = (deck.strategy_fr || '').toLowerCase().includes(q) || (deck.strategy_en || '').toLowerCase().includes(q);
      if (!matchName && !matchAuthor && !matchClan && !matchStrategy) return false;
    }
    return true;
  });

  // Auto-scroll when targetDeckId is provided
  useEffect(() => {
    if (targetDeckId && communityDecks.length > 0) {
      setTimeout(() => {
        const el = deckRefs.current[targetDeckId];
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [targetDeckId, communityDecks]);

  const handleCopyCode = (deck) => {
    const code = `${deck.name} [Clan: ${deck.clan}] - ${deck.cardIds.join(',')}`;
    navigator.clipboard.writeText(code);
    setCopiedDeckId(deck.id);
    setTimeout(() => setCopiedDeckId(null), 2000);
  };

  const handleCopyDirectLink = (deckId) => {
    const url = getShareableCommunityDeckUrl(deckId);
    navigator.clipboard.writeText(url);
    setCopiedLinkDeckId(deckId);
    setTimeout(() => setCopiedLinkDeckId(null), 2000);
  };

  const handleLike = async (deckId) => {
    // Optimistic UI: incrémenter immédiatement le compteur dans la liste locale
    setCommunityDecks(prev => prev.map(d =>
      d.id === deckId ? { ...d, likes: (d.likes || 1) + 1 } : d
    ));
    setLikedDecks(prev => ({ ...prev, [deckId]: true }));
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });

    // Sync cloud en arrière-plan
    const deck = communityDecks.find(d => d.id === deckId);
    await likeCommunityDeck(deckId, deck?.likes || 1);
  };

  const handlePublishSubmit = async (e) => {
    e.preventDefault();
    if (currentDeckCards.length === 0) {
      alert(lang === 'fr' ? 'Votre deck actuel est vide ! Ajoutez des cartes dans le Deck Builder d\'abord.' : 'Your current deck is empty! Add cards in the Deck Builder first.');
      return;
    }

    // Determine primary clan
    const clanCounts = {};
    currentDeckCards.forEach(c => {
      clanCounts[c.clan] = (clanCounts[c.clan] || 0) + 1;
    });
    const mainClan = Object.keys(clanCounts).sort((a, b) => clanCounts[b] - clanCounts[a])[0] || 'Brujah';

    const newDeck = await publishCommunityDeck({
      name: publishName.trim() || currentDeckName,
      author: publishAuthor.trim() || userProfile?.playerName || 'Mayki',
      clan: mainClan,
      cardIds: currentDeckCards.map(c => c.id),
      strategy: publishStrategy.trim() || "Deck partagé par la communauté Clans of London."
    });

    if (newDeck) {
      await loadDecks();
      setShowPublishModal(false);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-600/10 via-purple-600/5 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-semibold">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t?.community?.badge || "Partage & Stratégie Publics"}</span>
              <span className="text-gray-600">•</span>
              <span className="flex items-center space-x-1.5" title={realtimeStatus === 'connected' ? 'Connexion WebSocket active' : 'Connexion en cours...'}>
                <span className={`w-2 h-2 rounded-full ${
                  realtimeStatus === 'connected' 
                    ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]' 
                    : realtimeStatus === 'error'
                    ? 'bg-red-400'
                    : 'bg-amber-400 animate-pulse'
                }`} />
                <span className="text-[10px] font-mono text-emerald-300">
                  {realtimeStatus === 'connected' ? (lang === 'en' ? 'Live' : 'En Direct') : (lang === 'en' ? 'Connecting...' : 'Connexion...')}
                </span>
              </span>
            </div>
            <h1 className="font-gothic font-extrabold text-3xl md:text-4xl text-gray-100 text-shadow-sm">
              {t?.community?.title || "Decks de la Communauté"}
            </h1>
            <p className="text-sm text-gray-400 leading-relaxed font-sans">
              {t?.community?.description || "Explorez, partagez et téléchargez les decks créés par les joueurs de Clans of London. Publiez votre propre création pour inspirer la communauté !"}
            </p>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Refresh Cloud Decks */}
            <button
              onClick={loadDecks}
              disabled={loadingCloud}
              className="flex items-center space-x-2 px-3.5 py-3 rounded-xl bg-[#141824] hover:bg-[#1f2538] text-gray-200 hover:text-white font-gothic font-bold text-xs border border-white/15 transition-all shadow-sm disabled:opacity-50"
              title="Recharger les decks de la communauté"
            >
              <RefreshCw className={`w-4 h-4 text-indigo-400 ${loadingCloud ? 'animate-spin' : ''}`} />
              <span>{loadingCloud ? "Chargement..." : "Rafraîchir"}</span>
            </button>

            {/* Publish Deck Button */}
            <button
              onClick={() => {
                setPublishName(currentDeckName);
                setShowPublishModal(true);
              }}
              className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-800 to-indigo-900 hover:from-purple-700 hover:to-indigo-800 text-white font-gothic font-bold text-xs shadow-[0_0_20px_rgba(147,51,234,0.4)] border border-purple-400/40 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>{t?.community?.publishBtn || "Publier mon Deck Actuel"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Realtime Notification Banner */}
      {liveNotification && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950 via-purple-950 to-[#0e111a] border-2 border-indigo-400 text-indigo-100 text-xs flex items-center justify-between shadow-[0_0_30px_rgba(99,102,241,0.5)] animate-fadeIn">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-xl bg-indigo-600/30 border border-indigo-400/50 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            </div>
            <span className="font-gothic font-bold text-sm text-white tracking-wide">{liveNotification}</span>
          </div>
          <button 
            onClick={() => setLiveNotification(null)} 
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-white/10 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t?.community?.searchPlaceholder || "Rechercher par nom de deck, auteur, clan ou carte..."}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#141824] border border-white/15 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedClan('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-gothic font-bold transition-all border ${
                selectedClan === 'ALL'
                  ? 'bg-indigo-700 text-white border-indigo-400 shadow-sm'
                  : 'bg-[#141824] text-gray-400 border-white/10 hover:text-white'
              }`}
            >
              {t?.community?.allClans || "Tous"}
            </button>

            {Object.entries(CLANS).map(([ck, c]) => (
              <button
                key={ck}
                onClick={() => setSelectedClan(selectedClan === ck ? 'ALL' : ck)}
                style={selectedClan === ck ? { backgroundColor: c.bgColor, borderColor: c.borderColor, color: c.themeColor } : {}}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-gothic transition-all border whitespace-nowrap ${
                  selectedClan === ck
                    ? 'font-bold shadow-sm'
                    : 'bg-[#141824] text-gray-400 border-white/10 hover:text-gray-200'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Community Decks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDecks.map((deck) => {
          const clanInfo = CLANS[deck.clan] || CLANS.Mortal;
          const cards = deck.cardIds.map(id => CARDS_DATA.find(c => c.id === id)).filter(Boolean);
          const totalPower = cards.reduce((sum, c) => sum + (c.power || 0), 0);
          const avgCost = cards.length > 0 ? (cards.reduce((sum, c) => sum + (typeof c.cost === 'number' ? c.cost : 2), 0) / cards.length).toFixed(1) : 0;
          const likesCount = (deck.likes || 0) + (likedDecks[deck.id] || 0);

          const isTargeted = targetDeckId === deck.id;

          return (
            <div
              key={deck.id}
              ref={el => deckRefs.current[deck.id] = el}
              className={`glass-panel rounded-2xl p-5 space-y-4 transition-all flex flex-col justify-between shadow-xl ${
                isTargeted
                  ? 'border-2 border-indigo-400 ring-4 ring-indigo-500/40 shadow-[0_0_30px_rgba(99,102,241,0.5)] bg-indigo-950/20'
                  : 'border border-white/10 hover:border-indigo-500/40'
              }`}
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
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-950/60 border border-indigo-500/40 text-indigo-300">
                        {deck.tier}
                      </span>
                      {isTargeted && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/30 border border-amber-400 text-amber-300 animate-pulse">
                          ✨ Partagé
                        </span>
                      )}
                    </div>
                    <h3 className="font-gothic font-extrabold text-lg text-gray-100 mt-1">
                      {lang === 'en' && deck.name_en ? deck.name_en : deck.name}
                    </h3>
                    <p className="text-[11px] font-mono text-gray-400">
                      {t?.community?.author || "Créé par"} <strong className="text-amber-400">{deck.author}</strong> • {deck.publishedAt}
                    </p>
                  </div>

                  {/* Likes button */}
                  <button
                    onClick={() => handleLike(deck.id)}
                    className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-pink-950/40 hover:bg-pink-950 border border-pink-500/40 text-pink-300 text-xs font-mono font-bold transition-all"
                  >
                    <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                    <span>{likesCount}</span>
                  </button>
                </div>

                {/* Strategy Text */}
                <p className="text-xs text-gray-300 leading-relaxed bg-[#090b10] p-3 rounded-xl border border-white/5 font-sans">
                  {lang === 'en' && deck.strategy_en ? deck.strategy_en : deck.strategy_fr}
                </p>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="p-2 rounded-lg bg-[#141824] border border-white/5">
                    <span className="text-[10px] text-gray-400 block uppercase">Cartes</span>
                    <span className="font-bold text-gray-200">{cards.length}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#141824] border border-white/5">
                    <span className="text-[10px] text-gray-400 block uppercase">Puissance</span>
                    <span className="font-bold text-amber-400">{totalPower}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#141824] border border-white/5">
                    <span className="text-[10px] text-gray-400 block uppercase">Coût Moyen</span>
                    <span className="font-bold text-rose-400">{avgCost}</span>
                  </div>
                </div>

                {/* 15 Cards Visual Artworks Grid */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
                    <span>{lang === 'en' ? "Deck Cards (15) :" : "Cartes du Deck (15) :"}</span>
                    <span className="text-gray-500">{lang === 'en' ? "Click to inspect" : "Cliquer pour inspecter"}</span>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    {cards.slice(0, 10).map((card) => (
                      <div
                        key={card.id}
                        onClick={() => onInspectCard(card)}
                        className="cursor-pointer group relative rounded-xl overflow-hidden border border-white/15 hover:border-amber-400 transition-all bg-[#0e111a] flex flex-col justify-between shadow-md hover:scale-105"
                        title={`${card.name} (${card.costDisplay || card.cost} Sang • P${card.power})`}
                      >
                        {/* Artwork */}
                        <div className="relative w-full h-20 overflow-hidden bg-black">
                          <CardArtwork
                            artType={card.artType}
                            clan={card.clan}
                            imageUrl={card.imageUrl}
                            className="w-full h-full object-cover"
                          />

                          {/* Top Badges: Cost & Power */}
                          <div className="absolute top-1 left-1 right-1 flex items-center justify-between z-10 pointer-events-none">
                            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-600 to-rose-950 border border-red-400 flex items-center justify-center font-bold text-[9px] text-white shadow-blood">
                              {card.costDisplay || card.cost}
                            </div>
                            <div className="w-4 h-4 rounded-lg bg-gradient-to-br from-amber-600 to-amber-950 border border-amber-400 flex items-center justify-center font-bold text-[9px] text-white shadow-gold">
                              {card.power}
                            </div>
                          </div>
                        </div>

                        {/* Name */}
                        <div className="p-1 bg-gradient-to-t from-black via-[#0d0f17] to-[#121520] border-t border-white/10 text-center">
                          <p className="font-gothic font-bold text-[10px] text-gray-200 truncate group-hover:text-amber-300 transition-colors">
                            {card.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 pt-2 border-t border-white/10">
                <button
                  onClick={() => onLoadDeck(deck)}
                  className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-gradient-to-r from-red-800 to-rose-900 hover:from-red-700 hover:to-rose-800 text-white font-gothic font-bold text-xs shadow-blood transition-all"
                >
                  <Layers className="w-4 h-4" />
                  <span>{t?.community?.loadInDeckbuilder || "Charger dans le Deck"}</span>
                </button>

                <button
                  onClick={() => onNavigateToArena(deck)}
                  className="px-3 py-2.5 rounded-xl bg-amber-950/70 hover:bg-amber-900 border border-amber-500/50 text-amber-300 font-gothic font-bold text-xs transition-all"
                  title="Tester directement dans l'Arène de Combat"
                >
                  <Swords className="w-4 h-4" />
                </button>

                {/* Direct Link Share Button */}
                <button
                  onClick={() => handleCopyDirectLink(deck.id)}
                  className={`px-3 py-2.5 rounded-xl border text-xs font-mono transition-all ${
                    copiedLinkDeckId === deck.id
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                      : 'bg-indigo-950/60 hover:bg-indigo-900 border-indigo-500/40 text-indigo-300 hover:text-white'
                  }`}
                  title={lang === 'en' ? 'Copy direct share link for this deck' : 'Copier le lien direct vers ce deck'}
                >
                  {copiedLinkDeckId === deck.id ? <Check className="w-4 h-4 text-emerald-400" /> : <LinkIcon className="w-4 h-4" />}
                </button>

                {/* Copy Text Code Button */}
                <button
                  onClick={() => handleCopyCode(deck)}
                  className="px-3 py-2.5 rounded-xl bg-[#141824] hover:bg-[#1e2538] border border-white/15 text-gray-300 font-mono text-xs transition-all"
                  title="Copier le code texte du deck"
                >
                  {copiedDeckId === deck.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredDecks.length === 0 && (
        <div className="text-center py-16 px-4 glass-panel rounded-3xl border border-white/10 space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 flex items-center justify-center text-3xl mx-auto shadow-[0_0_20px_rgba(99,102,241,0.3)]">
            🃏
          </div>
          <div className="space-y-1">
            <h3 className="font-gothic font-bold text-xl text-gray-100">
              {lang === 'fr' ? 'Aucun deck communautaire pour le moment' : 'No community decks yet'}
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              {lang === 'fr' 
                ? 'Soyez le premier à partager votre deck avec les joueurs de Clans of London du monde entier !' 
                : 'Be the first player to share your custom deck with the worldwide Clans of London community!'}
            </p>
          </div>
          <button
            onClick={() => {
              setPublishName(currentDeckName);
              setShowPublishModal(true);
            }}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-800 to-indigo-900 hover:from-purple-700 text-white font-gothic font-bold text-xs shadow-gold transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>{lang === 'fr' ? 'Partager le Premier Deck' : 'Share the First Deck'}</span>
          </button>
        </div>
      )}

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel w-full max-w-lg rounded-2xl p-6 border-2 border-purple-500/50 shadow-2xl space-y-4 text-gray-200">
            <h3 className="font-gothic font-extrabold text-xl text-gray-100 flex items-center space-x-2">
              <Share2 className="w-5 h-5 text-purple-400" />
              <span>{t?.community?.publishModalTitle || "Partager votre Deck avec la Communauté"}</span>
            </h3>

            <form onSubmit={handlePublishSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">
                  {t?.community?.deckNameLabel || "Nom du Deck"}
                </label>
                <input
                  type="text"
                  value={publishName}
                  onChange={(e) => setPublishName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#090b10] border border-white/15 text-xs text-gray-100"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">
                  {t?.community?.authorLabel || "Votre Pseudo / Auteur"}
                </label>
                <input
                  type="text"
                  value={publishAuthor}
                  onChange={(e) => setPublishAuthor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#090b10] border border-white/15 text-xs text-gray-100"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">
                  {t?.community?.strategyLabel || "Description Tactique & Guide de Jeu"}
                </label>
                <textarea
                  value={publishStrategy}
                  onChange={(e) => setPublishStrategy(e.target.value)}
                  placeholder={t?.community?.strategyPlaceholder || "Expliquez comment jouer ce deck, les cartes clés et les ouvertures idéales..."}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-[#090b10] border border-white/15 text-xs text-gray-100"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPublishModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-gray-400 font-gothic text-xs"
                >
                  {t?.community?.cancel || "Annuler"}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-800 to-indigo-900 hover:from-purple-700 text-white font-gothic font-bold text-xs shadow-gold"
                >
                  {t?.community?.confirmPublish || "Publier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
