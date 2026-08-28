import React, { useState } from 'react';
import { X, Plus, Minus, BookOpen, Check, Layers, Share2, Sparkles, Edit3, ExternalLink } from 'lucide-react';
import CardArtwork from './CardArtwork';
import { CLANS } from '../../data/clansData';
import { CARDS_DATA, getCardAbility } from '../../data/cardsData';
import { getShareableCardUrl } from '../../utils/router';

export default function CardModal({ 
  card, 
  onClose, 
  onAdd, 
  onRemove, 
  countInDeck = 0, 
  onSelectCard,
  onUpdateCardImage,
  lang = 'fr',
  t
}) {
  const [isFoil, setIsFoil] = useState(false);
  const [editingImage, setEditingImage] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState(card?.imageUrl || '');
  const [imageSaved, setImageSaved] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [showOriginalText, setShowOriginalText] = useState(false);

  if (!card) return null;

  const clanInfo = CLANS[card.clan] || CLANS.Mortal;
  const isFrench = lang === 'fr';
  const displayedAbility = getCardAbility(card, lang);
  const displayedType = t?.cardAttributes?.types?.[card.type] || card.type;
  const displayedArchetype = t?.cardAttributes?.archetypes?.[card.archetype] || t?.cardAttributes?.archetypes?.[card.archetype_en] || card.archetype;
  const displayedClan = t?.cardAttributes?.clans?.[card.clan] || card.clan;
  const displayedRarity = t?.cardAttributes?.rarities?.[card.rarity] || card.rarity;
  const officialWikiUrl = card.wikiUrl || `https://vtm.paradoxwikis.com/CoL_Card:${(card.originalName || card.name).replace(/\s+/g, '_')}`;

  // Find synergy card objects
  const synergyCards = (card.synergies || []).map(synName => 
    CARDS_DATA.find(c => c.name.toLowerCase() === synName.toLowerCase())
  ).filter(Boolean);

  const handleSaveImage = (e) => {
    e.preventDefault();
    if (onUpdateCardImage) {
      onUpdateCardImage(card.id, customImageUrl.trim());
      setImageSaved(true);
      setTimeout(() => {
        setImageSaved(false);
        setEditingImage(false);
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Background click to dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl bg-[#0e111a] border-2 border-amber-500/30 shadow-[0_0_40px_rgba(0,0,0,0.9)] text-gray-200 flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/60 hover:bg-red-950 border border-white/20 hover:border-red-500 text-gray-300 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Visual Card Preview */}
        <div className="md:w-5/12 p-6 flex flex-col items-center justify-center bg-gradient-to-b from-[#141824] to-[#0a0c12] border-b md:border-b-0 md:border-r border-white/10">
          <div className={`w-full max-w-xs rounded-xl overflow-hidden bg-[#10131d] border-2 border-amber-500/50 shadow-2xl transition-all ${isFoil ? 'card-foil ring-2 ring-amber-400/50' : ''}`}>
            {/* Top Cost & Clan */}
            <div className="px-4 py-2.5 bg-[#0d0f17] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-rose-950 border-2 border-red-400 flex items-center justify-center font-bold text-sm text-white shadow-blood">
                  {card.costDisplay || card.cost}
                </div>
                <span className="font-semibold text-xs text-gray-200 font-gothic" style={{ color: clanInfo.themeColor }}>
                  {displayedClan}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-gray-400 font-bold">
                  S{card.series}
                </span>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-600 to-amber-950 border-2 border-amber-400 flex items-center justify-center font-bold text-sm text-white shadow-gold">
                  {card.power}
                </div>
              </div>
            </div>

            {/* Artwork */}
            <CardArtwork 
              artType={card.artType} 
              clan={card.clan} 
              imageUrl={card.imageUrl} 
              hasOfficialImage={card.hasOfficialImage}
              className="w-full h-56" 
            />

            {/* Title & Subtitle */}
            <div className="p-3 bg-[#131722] border-t border-b border-white/10 text-center">
              <h3 className="font-gothic font-bold text-lg text-amber-300">{card.name}</h3>
              {card.subtitle && (
                <p className="text-[11px] font-mono tracking-wider text-amber-400/90 uppercase -mt-0.5 font-bold">
                  {card.subtitle}
                </p>
              )}
            </div>

            {/* In-Card Ability Box */}
            <div className="p-3 bg-[#0c0e15] text-xs space-y-2">
              <p className="text-gray-300 leading-relaxed font-sans">{displayedAbility}</p>
              {card.flavorText && (
                <p className="italic text-[11px] text-gray-500 font-gothic border-t border-white/5 pt-1.5 line-clamp-2">
                  {card.flavorText}
                </p>
              )}
            </div>

            {/* In-Card Footer */}
            <div className="px-3 py-1.5 bg-[#090b10] border-t border-white/10 flex items-center justify-between text-[10px] text-gray-400 font-mono">
              <span className="capitalize">{displayedType}</span>
              <span>{displayedRarity}</span>
            </div>
          </div>

          {/* Quick Custom Actions under preview */}
          <div className="flex items-center space-x-2 mt-4">
            <button
              onClick={() => setIsFoil(!isFoil)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                isFoil 
                  ? 'bg-amber-600/30 border-amber-400 text-amber-300 shadow-gold' 
                  : 'bg-black/40 border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isFoil ? (t?.cardModal?.foilActive || 'Foil Actif') : (t?.cardModal?.previewFoil || 'Prévisu Foil')}</span>
            </button>

            <button
              onClick={() => setEditingImage(!editingImage)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-black/40 border border-white/10 text-gray-400 hover:text-white hover:border-amber-400 transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{t?.cardModal?.editImage || (isFrench ? 'Modifier Image' : 'Edit Image')}</span>
            </button>
          </div>

          {/* Image URL customizer drawer */}
          {editingImage && (
            <form onSubmit={handleSaveImage} className="w-full mt-3 p-3 rounded-xl bg-black/70 border border-amber-500/30 space-y-2 animate-fadeIn">
              <label className="block text-[11px] font-mono text-amber-300">
                {t?.cardModal?.pasteUrl || (isFrench ? "Coller une URL d'image (Wiki / Web) :" : "Paste image URL (Wiki / Web):")}
              </label>
              <input 
                type="url"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#0b0e14] border border-white/20 text-xs text-white focus:border-amber-400 focus:outline-none font-mono"
              />
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setCustomImageUrl('');
                    if (onUpdateCardImage) onUpdateCardImage(card.id, '');
                    setEditingImage(false);
                  }}
                  className="text-[11px] text-gray-400 hover:text-red-400 underline"
                >
                  {t?.cardModal?.resetSeal || (isFrench ? "Remettre le sceau" : "Reset clan seal")}
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-black text-xs font-bold font-gothic flex items-center space-x-1"
                >
                  {imageSaved ? <Check className="w-3 h-3 text-black" /> : null}
                  <span>{imageSaved ? (t?.cardModal?.saved || 'Enregistré !') : (t?.cardModal?.apply || 'Appliquer')}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Detailed Gameplay Info, Synergies & Deck Controls */}
        <div className="md:w-7/12 p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Header: Title, Series, Type, Share */}
            <div className="border-b border-white/10 pb-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="font-gothic font-extrabold text-2xl text-gray-100">{card.name}</h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-slate-900 border border-amber-500/40 text-amber-300">
                      S{card.series}
                    </span>
                  </div>
                  {card.subtitle && (
                    <p className="text-xs font-mono tracking-widest text-amber-400 uppercase mt-0.5">
                      {card.subtitle}
                    </p>
                  )}
                </div>

                {/* Share Button (Deep-link) */}
                <button
                  onClick={() => {
                    const shareUrl = getShareableCardUrl(card.id);
                    navigator.clipboard?.writeText(shareUrl);
                    setCopiedShare(true);
                    setTimeout(() => setCopiedShare(false), 2000);
                  }}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#141824] hover:bg-red-950 border border-white/15 hover:border-red-500/60 text-xs font-gothic font-bold text-gray-300 hover:text-white transition-all shadow-sm flex-shrink-0"
                  title={t?.cardModal?.copyLink || (isFrench ? 'Copier le lien direct vers cette carte' : 'Copy direct link to this card')}
                >
                  <Share2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>{copiedShare ? (t?.cardModal?.linkCopied || 'Lien Copié !') : (t?.cardModal?.share || 'Partager')}</span>
                </button>
              </div>

              {/* Clan, Type, Archetype & Rarity Badges */}
              <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                <span 
                  className="px-2.5 py-1 rounded-lg font-gothic font-bold bg-[#141824] border"
                  style={{ color: clanInfo.themeColor, borderColor: `${clanInfo.themeColor}50` }}
                >
                  {displayedClan}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-white/10 text-gray-300 font-mono capitalize">
                  {displayedType}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-white/10 text-gray-300 font-mono">
                  {displayedArchetype}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-amber-500/40 text-amber-300 font-mono font-bold">
                  {displayedRarity}
                </span>
                <a
                  href={officialWikiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-amber-950/60 hover:bg-amber-900 border border-amber-500/50 text-amber-300 font-mono text-[11px] flex items-center space-x-1 transition-all"
                  title={t?.cardModal?.wikiTooltip || "Consulter la fiche officielle sur le Wiki Paradox"}
                >
                  <span>{t?.cardModal?.wikiBadge || "Wiki Paradox"}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#090b10] border border-red-500/30 text-center">
                <span className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                  {t?.cardModal?.bloodCost || (isFrench ? 'Coût en Sang' : 'Blood Cost')}
                </span>
                <span className="text-xl font-extrabold font-mono text-red-400">
                  {card.costDisplay || card.cost}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#090b10] border border-amber-500/30 text-center">
                <span className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                  {t?.cardModal?.power || (isFrench ? 'Puissance' : 'Power')}
                </span>
                <span className="text-xl font-extrabold font-mono text-amber-400">
                  {card.power}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#090b10] border border-white/10 text-center">
                <span className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                  {t?.cardModal?.archetype || (isFrench ? 'Archétype' : 'Archetype')}
                </span>
                <span className="text-sm font-bold font-mono text-gray-200 truncate block">
                  {displayedArchetype}
                </span>
              </div>
            </div>

            {/* Detailed Ability Description */}
            <div className="p-4 rounded-xl bg-[#0a0d14] border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-xs font-gothic font-bold text-amber-400 uppercase tracking-wider">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{t?.cardModal?.abilityTitle || (isFrench ? 'Capacité Active & Règles' : 'Active Ability & Rules')}</span>
                </div>
                {card.ability_en && card.ability && (
                  <button
                    onClick={() => setShowOriginalText(!showOriginalText)}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-amber-300 transition-colors"
                  >
                    {showOriginalText ? (t?.cardModal?.viewTranslation || 'Voir Traduction') : (t?.cardModal?.viewOriginal || 'Voir Original EN (Wiki)')}
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-200 leading-relaxed font-sans">
                {showOriginalText ? card.ability_en : displayedAbility}
              </p>
              {card.flavorText && (
                <p className="italic text-xs text-gray-400 font-gothic border-t border-white/10 pt-2">
                  {card.flavorText}
                </p>
              )}
            </div>

            {/* Keywords */}
            {card.keywords && card.keywords.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex flex-wrap gap-1.5">
                  {card.keywords.map((kw, i) => (
                    <span 
                      key={i} 
                      className="px-2 py-0.5 rounded-lg text-xs font-mono bg-red-950/40 border border-red-500/30 text-red-300"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Synergies */}
            {synergyCards.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-white/10">
                <h4 className="text-xs font-gothic font-bold uppercase tracking-wider text-gray-400">
                  {t?.cardModal?.synergiesTitle || (isFrench ? 'Cartes Synergiques Recommandées' : 'Recommended Card Synergies')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {synergyCards.map(synCard => (
                    <button
                      key={synCard.id}
                      onClick={() => onSelectCard && onSelectCard(synCard)}
                      className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#141824] hover:bg-[#1f2538] border border-white/10 hover:border-amber-400 text-xs text-gray-200 hover:text-amber-300 transition-all cursor-pointer"
                    >
                      <span className="w-5 h-5 rounded-full bg-red-900/80 border border-red-500 text-[10px] font-bold flex items-center justify-center">
                        {synCard.cost}
                      </span>
                      <span className="font-gothic font-semibold">{synCard.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Deck Builder Control Footer */}
          <div className="p-4 rounded-xl bg-[#090b10] border border-white/10 flex items-center justify-between gap-4">
            <div className="flex items-center space-x-2 font-mono">
              <Layers className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-gray-400">{t?.cardModal?.statusInDeck || (isFrench ? 'Statut dans votre Deck :' : 'Status in your Deck:')}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                countInDeck > 0 
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300' 
                  : 'bg-slate-900 border-white/10 text-gray-400'
              }`}>
                {countInDeck}/1
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {countInDeck > 0 && (
                <button
                  onClick={() => onRemove(card.id)}
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-red-950/80 hover:bg-red-800 border border-red-500/50 text-red-200 hover:text-white text-xs font-gothic font-bold transition-all"
                >
                  <Minus className="w-3.5 h-3.5" />
                  <span>{t?.cardModal?.removeFromDeck || (isFrench ? 'Retirer du Deck' : 'Remove from Deck')}</span>
                </button>
              )}

              <button
                onClick={() => onAdd(card)}
                disabled={countInDeck >= 1}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-gothic font-bold transition-all ${
                  countInDeck >= 1
                    ? 'bg-gray-800 border border-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-800 to-rose-900 hover:from-red-700 hover:to-rose-800 text-white border border-red-500 shadow-blood'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{countInDeck >= 1 ? (t?.cardModal?.alreadyInDeck || 'Déjà dans le Deck') : (t?.cardModal?.addToDeck || 'Ajouter au Deck (1/1)')}</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
