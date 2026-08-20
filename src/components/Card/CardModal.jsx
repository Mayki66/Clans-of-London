import React, { useState } from 'react';
import { X, Plus, Minus, Droplets, Shield, Sparkles, ExternalLink, Edit3, Image, BookOpen, Check, Layers } from 'lucide-react';
import CardArtwork from './CardArtwork';
import { CLANS } from '../../data/clansData';
import { CARDS_DATA } from '../../data/cardsData';

export default function CardModal({ 
  card, 
  onClose, 
  onAdd, 
  onRemove, 
  countInDeck = 0, 
  onSelectCard,
  onUpdateCardImage
}) {
  const [isFoil, setIsFoil] = useState(false);
  const [editingImage, setEditingImage] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState(card?.imageUrl || '');
  const [imageSaved, setImageSaved] = useState(false);

  if (!card) return null;

  const clanInfo = CLANS[card.clan] || CLANS.Mortal;

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
                <span className="font-semibold text-xs text-gray-200" style={{ color: clanInfo.themeColor }}>
                  {card.clan}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-gray-400 font-bold">Série {card.series}</span>
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
              <div className="flex items-center justify-center gap-1.5 mt-1.5 flex-wrap">
                {card.keywords?.filter(k => ['Vampire', 'Mortel', 'Mortal', 'Objet', 'Ingrédient', 'Alchimie'].some(tag => k.toLowerCase().includes(tag.toLowerCase()))).map((kw, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-full bg-black/70 border border-white/20 text-[9px] font-bold uppercase tracking-wider text-gray-300">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Effect */}
            <div className="p-3 bg-[#0a0c14] text-xs text-gray-300 space-y-2">
              <p className="leading-relaxed">{card.ability}</p>
              {card.flavorText && (
                <p className="italic text-[11px] text-gray-500 font-gothic border-t border-white/5 pt-2">
                  {card.flavorText}
                </p>
              )}
            </div>
          </div>

          {/* Controls Under Card */}
          <div className="flex items-center space-x-2 mt-4">
            <button
              onClick={() => setIsFoil(!isFoil)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold font-gothic transition-all border ${
                isFoil
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-gold'
                  : 'bg-slate-900/80 text-gray-400 border-slate-700 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isFoil ? 'Foil Actif' : 'Prévisu Foil'}</span>
            </button>

            <button
              onClick={() => setEditingImage(!editingImage)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold font-gothic bg-slate-900/80 hover:bg-slate-800 text-gray-300 hover:text-white border border-slate-700 transition-all"
            >
              <Edit3 className="w-3.5 h-3.5 text-purple-400" />
              <span>Modifier Image</span>
            </button>
          </div>

          {/* Image URL Custom Editor Accordion */}
          {editingImage && (
            <form onSubmit={handleSaveImage} className="w-full mt-3 p-3 rounded-xl bg-[#090b10] border border-white/10 space-y-2 animate-fadeIn">
              <label className="block text-[11px] font-mono text-gray-400">
                Coller une URL d'image (Wiki / Web) :
              </label>
              <input
                type="url"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                placeholder="https://vtm.paradoxwikis.com/images/... ou URL web"
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#141824] border border-white/15 text-xs text-gray-200"
              />
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => { setCustomImageUrl(''); }}
                  className="text-[10px] text-gray-500 hover:text-red-400 underline"
                >
                  Remettre le sceau de clan
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-200 text-xs font-bold"
                >
                  {imageSaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
                  <span>{imageSaved ? 'Enregistré !' : 'Appliquer'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Detailed Stats, Lore & Wiki Links */}
        <div className="md:w-7/12 p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Header info */}
            <div>
              <div className="flex items-center space-x-2 mb-1 flex-wrap gap-1">
                <span 
                  className="px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider"
                  style={{ backgroundColor: clanInfo.bgColor, borderColor: clanInfo.borderColor, color: clanInfo.themeColor }}
                >
                  Clan {card.clan}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 border border-slate-700 text-gray-300">
                  {card.rarity}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-900 border border-amber-500/40 text-amber-400">
                  Série {card.series}
                </span>
                
                {/* Wiki Direct Link */}
                <a
                  href="https://vtm.paradoxwikis.com/CoL_cardlist"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 hover:text-white transition-all ml-auto"
                >
                  <span>Wiki Paradox</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <h2 className="font-gothic font-extrabold text-2xl md:text-3xl text-gray-100 text-shadow-sm">
                {card.name}
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                {clanInfo.description}
              </p>
            </div>

            {/* Key Attributes Grid */}
            <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-[#141824] border border-white/10 text-center">
              <div className="p-2 rounded-lg bg-black/40">
                <div className="flex items-center justify-center space-x-1 text-red-400 text-xs font-semibold">
                  <Droplets className="w-3.5 h-3.5" />
                  <span>Coût en Sang</span>
                </div>
                <div className="text-xl font-bold font-mono text-white mt-1">{card.cost}</div>
              </div>

              <div className="p-2 rounded-lg bg-black/40">
                <div className="flex items-center justify-center space-x-1 text-amber-400 text-xs font-semibold">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Puissance</span>
                </div>
                <div className="text-xl font-bold font-mono text-white mt-1">{card.power}</div>
              </div>

              <div className="p-2 rounded-lg bg-black/40">
                <div className="flex items-center justify-center space-x-1 text-purple-400 text-xs font-semibold">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Archétype</span>
                </div>
                <div className="text-sm font-bold text-white mt-1 truncate">{card.archetype}</div>
              </div>
            </div>

            {/* Mechanical Ability Details */}
            <div className="p-4 rounded-xl bg-[#121520] border border-white/10 space-y-2">
              <h4 className="font-gothic font-bold text-xs uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
                <BookOpen className="w-4 h-4" />
                <span>Capacité Active & Règles</span>
              </h4>
              <p className="text-sm text-gray-200 leading-relaxed font-sans">
                {card.ability}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {card.keywords?.map((kw, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-black/60 border border-white/10 text-xs font-mono text-gray-300">
                    #{kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Lore Quote */}
            {card.flavorText && (
              <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/20">
                <p className="italic text-xs text-red-200 font-gothic leading-relaxed">
                  {card.flavorText}
                </p>
              </div>
            )}

            {/* Synergies Recommandées */}
            {synergyCards.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-gothic font-bold text-xs uppercase tracking-wider text-gray-400">
                  Cartes Synergiques Recommandées
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {synergyCards.map((syn) => (
                    <div
                      key={syn.id}
                      onClick={() => onSelectCard?.(syn)}
                      className="flex items-center justify-between p-2 rounded-lg bg-[#141824] hover:bg-[#1c2233] border border-white/10 hover:border-amber-500/50 cursor-pointer transition-all"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 rounded-full bg-red-900 flex items-center justify-center text-[10px] font-bold text-white">
                          {syn.cost}
                        </div>
                        <span className="text-xs font-gothic font-semibold text-gray-200 truncate">{syn.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-amber-400">P{syn.power}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Bar */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400">Statut dans votre Deck :</span>
              <span className="font-mono font-bold text-sm text-amber-400">
                {countInDeck}/1
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {countInDeck > 0 && (
                <button
                  onClick={() => onRemove?.(card)}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-red-950 hover:bg-red-800 border border-red-500/60 text-red-200 hover:text-white font-gothic font-bold text-xs transition-all"
                >
                  <Minus className="w-4 h-4" />
                  <span>Retirer du Deck</span>
                </button>
              )}

              <button
                onClick={() => onAdd?.(card)}
                disabled={countInDeck >= 1}
                className={`flex items-center space-x-1.5 px-5 py-2 rounded-xl font-gothic font-bold text-xs transition-all ${
                  countInDeck >= 1
                    ? 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-700 via-red-800 to-rose-900 hover:from-red-600 hover:to-rose-800 text-white border border-red-500 shadow-blood'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>{countInDeck >= 1 ? 'Déjà dans le Deck' : 'Ajouter au Deck (1/1)'}</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
