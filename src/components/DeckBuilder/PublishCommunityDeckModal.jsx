import React, { useState } from 'react';
import { Share2, Users, X, Sparkles, Check, Flame, Crown, Skull, PawPrint, Ghost, Heart, Shield, Award } from 'lucide-react';
import { CLANS } from '../../data/clansData';
import { publishCommunityDeck } from '../../data/communityDecks';
import confetti from 'canvas-confetti';

export default function PublishCommunityDeckModal({
  isOpen,
  onClose,
  deckName = '',
  deckCards = [],
  userProfile,
  onPublished
}) {
  if (!isOpen) return null;

  // Calcul du clan dominant
  const getDominantClan = () => {
    if (!deckCards || deckCards.length === 0) return 'Brujah';
    const clanCounts = {};
    deckCards.forEach(c => {
      if (c.clan && c.clan !== 'Mortel' && c.clan !== 'Mortal') {
        clanCounts[c.clan] = (clanCounts[c.clan] || 0) + 1;
      }
    });
    const sorted = Object.entries(clanCounts).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? sorted[0][0] : 'Brujah';
  };

  const [title, setTitle] = useState(deckName || 'Mon Deck Stratégique');
  const [author, setAuthor] = useState(userProfile?.playerName || 'Mayki');
  const [clan, setClan] = useState(getDominantClan());
  const [strategy, setStrategy] = useState('');
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert(t?.publishModal?.enterTitleAlert || "Veuillez saisir un titre pour votre deck.");
      return;
    }
    if (deckCards.length === 0) {
      alert(t?.publishModal?.emptyDeckAlert || "Votre deck est vide. Ajoutez des cartes avant de le publier.");
      return;
    }

    const cardIds = deckCards.map(c => c.id);
    const newDeck = publishCommunityDeck({
      name: title.trim(),
      clan,
      author: author.trim() || 'Kindred Anonyme',
      strategy: strategy.trim() || 'Deck compétitif partagé par la communauté de Londres.',
      cardIds
    });

    if (newDeck) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
      setPublishedSuccess(true);
      if (onPublished) onPublished(newDeck);
      setTimeout(() => {
        setPublishedSuccess(false);
        onClose();
      }, 1800);
    }
  };

  const totalPower = deckCards.reduce((sum, c) => sum + (c.power || 0), 0);
  const avgCost = deckCards.length > 0 
    ? (deckCards.reduce((sum, c) => sum + (typeof c.cost === 'number' ? c.cost : 2), 0) / deckCards.length).toFixed(1) 
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-[#111420] via-[#0b0d14] to-[#08090e] border border-indigo-500/40 p-6 space-y-5 shadow-[0_0_30px_rgba(99,102,241,0.25)]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-800 to-purple-950 border border-indigo-400 flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.4)]">
            <Share2 className="w-5 h-5 text-indigo-300" />
          </div>
          <div>
            <h3 className="font-gothic font-extrabold text-xl text-gray-100 flex items-center space-x-2">
              <span>Publier dans la Communauté</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-gray-400">
              {t?.publishModal?.subtitle || "Partagez votre deck avec tous les joueurs de Clans of London"}
            </p>
          </div>
        </div>

        {/* Quick Deck Info Box */}
        <div className="p-3 rounded-xl bg-[#141824] border border-white/10 flex items-center justify-between text-xs font-mono">
          <div>
            <span className="text-gray-400 block text-[10px]">{t?.publishModal?.composition || "COMPOSITION"}</span>
            <strong className={`${deckCards.length === 15 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {deckCards.length} / 15 cartes
            </strong>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px]">{t?.publishModal?.totalPower || "PUISSANCE TOTALE"}</span>
            <strong className="text-amber-400 font-bold">{totalPower}</strong>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px]">{t?.publishModal?.avgCost || "COÛT MOYEN"}</span>
            <strong className="text-rose-400 font-bold">{avgCost} 💧</strong>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Deck Name */}
          <div className="space-y-1">
            <label className="block text-xs font-gothic font-bold text-gray-300">
              {t?.publishModal?.deckTitleLabel || "Titre du Deck *"}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t?.publishModal?.deckTitlePlaceholder || "Ex: Brujah Rush Blood, Hecata Soul Engine..."}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#090b10] border border-white/15 focus:border-indigo-500 text-sm font-semibold text-gray-100 placeholder-gray-500 focus:outline-none"
            />
          </div>

          {/* Author & Clan Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-gothic font-bold text-gray-300">
                {t?.publishModal?.authorLabel || "Pseudo de l'Auteur"}
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder={t?.publishModal?.authorPlaceholder || "Votre pseudo"}
                className="w-full px-3.5 py-2 rounded-xl bg-[#090b10] border border-white/15 focus:border-indigo-500 text-xs font-semibold text-gray-100 placeholder-gray-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-gothic font-bold text-gray-300">
                {t?.publishModal?.clanLabel || "Clan Principal"}
              </label>
              <select
                value={clan}
                onChange={(e) => setClan(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#090b10] border border-white/15 focus:border-indigo-500 text-xs font-semibold text-gray-100 focus:outline-none"
              >
                {Object.keys(CLANS).map((cKey) => (
                  <option key={cKey} value={cKey}>
                    {CLANS[cKey].name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Strategy Textarea */}
          <div className="space-y-1">
            <label className="block text-xs font-gothic font-bold text-gray-300">
              {t?.publishModal?.strategyLabel || "Description & Guide Stratégique"}
            </label>
            <textarea
              rows={3}
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              placeholder={t?.publishModal?.strategyPlaceholder || "Expliquez la tactique clé (mulligan, tour 1 à 7, combos de cartes)..."}
              className="w-full px-3.5 py-2 rounded-xl bg-[#090b10] border border-white/15 focus:border-indigo-500 text-xs text-gray-100 placeholder-gray-500 focus:outline-none resize-none"
            />
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={publishedSuccess || deckCards.length === 0}
              className={`w-full py-3 rounded-xl font-gothic font-bold text-xs flex items-center justify-center space-x-2 transition-all transform active:scale-98 shadow-lg ${
                publishedSuccess
                  ? 'bg-emerald-700 text-white'
                  : 'bg-gradient-to-r from-indigo-800 via-purple-700 to-indigo-900 hover:from-indigo-700 hover:to-purple-600 text-white border border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.4)]'
              }`}
            >
              {publishedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>{t?.publishModal?.success || "Deck publié avec succès dans la Communauté !"}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-indigo-300" />
                  <span>{t?.publishModal?.submit || "Publier dans les Decks Communauté"}</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
