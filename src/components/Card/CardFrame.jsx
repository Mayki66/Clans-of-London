import React from 'react';
import { Plus, Minus, Eye, Sparkles, Shield, Droplets, Flame, Crown, Skull, PawPrint, Eye as EyeIcon, Ghost, Heart, Moon } from 'lucide-react';
import CardArtwork from './CardArtwork';
import { CLANS } from '../../data/clansData';
import { getCardAbility } from '../../data/cardsData';

// Map clan icon names to Lucide components
const CLAN_ICONS = {
  Flame: Flame,
  Crown: Crown,
  Skull: Skull,
  PawPrint: PawPrint,
  Sparkles: Sparkles,
  Eye: EyeIcon,
  Ghost: Ghost,
  Heart: Heart,
  Shield: Shield,
  Moon: Moon
};

export default function CardFrame({
  card,
  onInspect,
  onAdd,
  onRemove,
  countInDeck = 0,
  compact = false,
  isFoil = false,
  showActions = true,
  lang = 'fr',
  t
}) {
  const clanInfo = CLANS[card.clan] || CLANS.Mortal;
  const ClanIcon = CLAN_ICONS[clanInfo.icon] || Shield;

  const getRarityBadge = (rarity) => {
    switch (rarity) {
      case 'Légendaire':
      case 'Legendary':
        return 'bg-gradient-to-r from-amber-500 via-red-500 to-amber-500 text-amber-100 border-amber-400/80 shadow-[0_0_10px_rgba(245,158,11,0.5)]';
      case 'Épique':
      case 'Epic':
        return 'bg-gradient-to-r from-purple-700 to-indigo-800 text-purple-200 border-purple-400/60 shadow-[0_0_8px_rgba(168,85,247,0.4)]';
      case 'Rare':
        return 'bg-gradient-to-r from-blue-700 to-cyan-800 text-blue-100 border-blue-400/60';
      default:
        return 'bg-slate-800 text-gray-300 border-slate-600';
    }
  };

  const getRarityBorder = (rarity) => {
    switch (rarity) {
      case 'Légendaire':
      case 'Legendary':
        return 'border-amber-500/70 hover:border-amber-400 shadow-[0_0_15px_rgba(212,175,55,0.25)]';
      case 'Épique':
      case 'Epic':
        return 'border-purple-500/60 hover:border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.2)]';
      case 'Rare':
        return 'border-blue-500/50 hover:border-blue-400';
      default:
        return 'border-white/10 hover:border-white/25';
    }
  };

  const isFrench = lang === 'fr';
  const displayedAbility = getCardAbility(card, lang);
  const displayedType = t?.cardAttributes?.types?.[card.type] || card.type;
  const displayedArchetype = t?.cardAttributes?.archetypes?.[card.archetype] || t?.cardAttributes?.archetypes?.[card.archetype_en] || card.archetype;
  const displayedClan = t?.cardAttributes?.clans?.[card.clan] || card.clan;
  const displayedRarity = t?.cardAttributes?.rarities?.[card.rarity] || card.rarity;

  if (compact) {
    return (
      <div 
        onClick={() => onInspect?.(card)}
        className={`group relative flex items-center justify-between p-2.5 rounded-lg bg-[#12151f] hover:bg-[#1a1f2e] border transition-all cursor-pointer ${getRarityBorder(card.rarity)}`}
      >
        <div className="flex items-center space-x-3 min-w-0">
          {/* Blood Cost */}
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-red-600 to-rose-950 border border-red-400/60 flex items-center justify-center font-bold text-xs text-white shadow-blood">
            {card.costDisplay || card.cost}
          </div>

          {/* Name & Clan */}
          <div className="min-w-0">
            <h4 className="font-gothic text-sm font-semibold text-gray-100 truncate group-hover:text-amber-400 transition-colors">
              {card.name}
            </h4>
            <div className="flex items-center space-x-1.5 text-xs text-gray-400">
              <span style={{ color: clanInfo.themeColor }} className="font-medium">
                {displayedClan}
              </span>
              <span>•</span>
              <span className="text-gray-400">{displayedType}</span>
              <span>•</span>
              <span className="text-amber-400/80 font-mono">S{card.series}</span>
            </div>
          </div>
        </div>

        {/* Power & Deck controls */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <div className="flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-900/90 border border-amber-500/40 text-amber-300 font-bold text-xs">
            <Shield className="w-3 h-3 text-amber-400" />
            <span>{card.power}</span>
          </div>

          {showActions && (
            <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
              {countInDeck > 0 && (
                <button
                  onClick={onRemove}
                  className="p-1 rounded bg-red-950/80 hover:bg-red-800 border border-red-500/40 text-red-300 hover:text-white transition-colors"
                  title={t?.card?.removeFromDeck || (isFrench ? "Retirer du deck" : "Remove from deck")}
                >
                  <Minus className="w-3 h-3" />
                </button>
              )}
              {countInDeck > 0 && (
                <span className="w-4 text-center font-mono font-bold text-amber-400 text-xs">
                  {countInDeck}
                </span>
              )}
              <button
                onClick={onAdd}
                disabled={countInDeck >= 1}
                className={`p-1 rounded border transition-colors ${
                  countInDeck >= 1
                    ? 'bg-gray-800/40 border-gray-700/40 text-gray-600 cursor-not-allowed'
                    : 'bg-emerald-950/80 hover:bg-emerald-800 border-emerald-500/40 text-emerald-300 hover:text-white'
                }`}
                title={countInDeck >= 1 ? (t?.card?.alreadyInDeck || "Déjà inclus") : (t?.card?.addToDeck || "Ajouter au deck")}
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Full Standard Card View
  return (
    <div className={`group relative rounded-2xl bg-[#0c0f17] border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl overflow-hidden flex flex-col ${getRarityBorder(card.rarity)} ${isFoil ? 'ring-2 ring-amber-400/50' : ''}`}>
      
      {/* Top Banner: Series & Rarity */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#080a10] border-b border-white/10 text-[10px] font-mono">
        <span className="text-gray-400">
          S{card.series}
        </span>
        <span className={`px-2 py-0.2 rounded-full font-bold uppercase tracking-wider text-[9px] border ${getRarityBadge(card.rarity)}`}>
          {card.rarity}
        </span>
      </div>

      {/* Card Artwork & Overlay */}
      <div 
        className="relative h-44 bg-black overflow-hidden cursor-pointer"
        onClick={() => onInspect?.(card)}
      >
        <CardArtwork 
          artType={card.artType}
          clan={card.clan} 
          imageUrl={card.imageUrl}
          hasOfficialImage={card.hasOfficialImage}
          className="w-full h-full"
        />
        
        {/* Subtle Gradient Shadow on Art */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f17] via-transparent to-transparent pointer-events-none" />

        {/* Floating Blood Cost */}
        <div className="absolute top-2.5 left-2.5 w-9 h-9 rounded-full bg-gradient-to-br from-red-600 via-rose-800 to-rose-950 border-2 border-amber-400/80 flex items-center justify-center font-extrabold font-mono text-base text-white shadow-blood z-10">
          {card.costDisplay || card.cost}
        </div>

        {/* Floating Power */}
        <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-amber-500/60 flex items-center space-x-1 font-extrabold font-mono text-xs text-amber-300 shadow-md z-10">
          <Shield className="w-3.5 h-3.5 text-amber-400" />
          <span>{card.power}</span>
        </div>

        {/* Inspect Hover Pill */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-xs pointer-events-none">
          <span className="px-3 py-1 rounded-full bg-red-950/90 border border-red-500 text-white font-gothic text-xs font-bold shadow-blood flex items-center space-x-1.5">
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>{t?.card?.inspect || (isFrench ? "Inspecter" : "Inspect")}</span>
          </span>
        </div>
      </div>

      {/* Card Body Details */}
      <div 
        className="p-3.5 space-y-2 flex-1 flex flex-col justify-between cursor-pointer"
        onClick={() => onInspect?.(card)}
      >
        <div>
          {/* Card Title & Type Header */}
          <div className="flex items-start justify-between gap-1.5">
            <h3 className="font-gothic font-bold text-sm text-gray-100 group-hover:text-amber-400 transition-colors leading-tight">
              {card.name}
            </h3>
            <span 
              className="text-[11px] font-bold flex-shrink-0 font-gothic"
              style={{ color: clanInfo.themeColor }}
            >
              {displayedClan}
            </span>
          </div>

          <div className="text-[10px] text-gray-400 font-mono mb-1.5">
            {displayedType} • {displayedArchetype}
          </div>

          {/* Rules Ability Box */}
          <div className="p-2 rounded-xl bg-[#07090e] border border-white/10 text-xs text-gray-300 leading-relaxed min-h-[50px]">
            {displayedAbility}
          </div>
        </div>

        {/* Keywords Tags */}
        {card.keywords && card.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {card.keywords.slice(0, 3).map((kw, i) => (
              <span key={i} className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-white/5 border border-white/10 text-gray-400">
                #{kw}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Actions (Add / Remove) */}
      {showActions && (
        <div className="p-2.5 bg-[#080a10] border-t border-white/10 flex items-center justify-between">
          <div className="text-xs font-mono">
            <span className="text-gray-500 mr-1">{t?.card?.inDeck || (isFrench ? "Dans le deck :" : "In deck:")}</span>
            {countInDeck > 0 ? (
              <span className="font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-500/40">
                {countInDeck}/1
              </span>
            ) : (
              <span className="text-gray-600 text-[11px]">
                {t?.card?.notIncluded || (isFrench ? "Non inclus" : "Not included")}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1.5">
            {countInDeck > 0 && (
              <button
                onClick={onRemove}
                className="p-1.5 rounded-lg bg-red-950/80 hover:bg-red-800 border border-red-500/40 text-red-300 hover:text-white transition-colors"
                title={t?.card?.removeFromDeck || (isFrench ? "Retirer une copie" : "Remove a copy")}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={onAdd}
              disabled={countInDeck >= 1}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-gothic font-bold border transition-all ${
                countInDeck >= 1
                  ? 'bg-gray-800/40 border-gray-700/40 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-600 hover:to-teal-700 text-white border-emerald-400 shadow-sm transform active:scale-95'
              }`}
              title={countInDeck >= 1 ? (t?.card?.limitReached || "Limite de 1 copie atteinte") : (t?.card?.addToDeck || "Ajouter au deck")}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{countInDeck >= 1 ? (t?.card?.included || "Inclus") : (t?.card?.add || "Ajouter")}</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
