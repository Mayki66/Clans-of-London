import React from 'react';
import { Plus, Minus, Eye, Sparkles, Shield, Droplets, Flame, Crown, Skull, PawPrint, Eye as EyeIcon, Ghost, Heart, Moon } from 'lucide-react';
import CardArtwork from './CardArtwork';
import { CLANS } from '../../data/clansData';

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
  showActions = true
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

  if (compact) {
    return (
      <div 
        onClick={() => onInspect?.(card)}
        className={`group relative flex items-center justify-between p-2.5 rounded-lg bg-[#12151f] hover:bg-[#1a1f2e] border transition-all cursor-pointer ${getRarityBorder(card.rarity)}`}
      >
        <div className="flex items-center space-x-3 min-w-0">
          {/* Blood Cost */}
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-red-600 to-rose-950 border border-red-400/60 flex items-center justify-center font-bold text-xs text-white shadow-blood">
            {card.cost}
          </div>

          {/* Name & Clan */}
          <div className="min-w-0">
            <h4 className="font-gothic text-sm font-semibold text-gray-100 truncate group-hover:text-amber-400 transition-colors">
              {card.name}
            </h4>
            <div className="flex items-center space-x-1.5 text-xs text-gray-400">
              <span style={{ color: clanInfo.themeColor }} className="font-medium">
                {card.clan}
              </span>
              <span>•</span>
              <span className="text-gray-400">{card.type}</span>
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
                  onClick={() => onRemove?.(card)}
                  className="p-1 rounded bg-red-950/80 hover:bg-red-800 border border-red-500/40 text-red-300 hover:text-white transition-colors"
                  title="Retirer du deck"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
              )}
              {countInDeck > 0 && (
                <span className="w-5 text-center font-mono font-bold text-xs text-amber-400">
                  {countInDeck}
                </span>
              )}
              <button
                onClick={() => onAdd?.(card)}
                disabled={countInDeck >= 1} // in 15-card decks, standard is 1 copy per card
                className={`p-1 rounded border transition-colors ${
                  countInDeck >= 1 
                    ? 'bg-gray-800/40 border-gray-700/40 text-gray-600 cursor-not-allowed'
                    : 'bg-emerald-950/80 hover:bg-emerald-800 border-emerald-500/40 text-emerald-300 hover:text-white'
                }`}
                title={countInDeck >= 1 ? "Déjà dans le deck (Max 1)" : "Ajouter au deck"}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`group relative flex flex-col rounded-xl overflow-hidden bg-[#10131a] border-2 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${getRarityBorder(card.rarity)} ${isFoil ? 'card-foil' : ''}`}
    >
      {/* Top Bar / Header */}
      <div className="relative z-10 px-3 py-2 bg-gradient-to-r from-[#0d0f17] via-[#151924] to-[#0d0f17] border-b border-white/10 flex items-center justify-between">
        {/* Blood Cost Orb */}
        <div className="flex items-center space-x-1.5">
          <div 
            className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 via-red-700 to-rose-950 border-2 border-red-400/80 flex items-center justify-center font-bold text-sm text-white shadow-blood"
            title={`Coût : ${card.costDisplay || card.cost} Sang`}
          >
            <Droplets className="w-3 h-3 text-red-200 mr-0.5" />
            <span>{card.costDisplay || card.cost}</span>
          </div>

          {/* Clan Badge */}
          <div 
            className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-semibold border backdrop-blur-sm"
            style={{ 
              backgroundColor: clanInfo.bgColor, 
              borderColor: clanInfo.borderColor,
              color: clanInfo.themeColor
            }}
          >
            <ClanIcon className="w-3 h-3" />
            <span>{card.clan}</span>
          </div>
        </div>

        {/* Power Shield & Series Badge */}
        <div className="flex items-center space-x-1.5">
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 border border-slate-700 text-gray-300">
            S{card.series}
          </span>
          <div 
            className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-600 via-amber-700 to-amber-950 border-2 border-amber-400/80 flex items-center justify-center font-bold text-sm text-white shadow-[0_0_10px_rgba(212,175,55,0.4)]"
            title={`Puissance : ${card.power}`}
          >
            <Shield className="w-3 h-3 text-amber-200 mr-0.5" />
            <span>{card.power}</span>
          </div>
        </div>
      </div>

      {/* Card Artwork */}
      <div 
        onClick={() => onInspect?.(card)}
        className="relative cursor-pointer overflow-hidden group-hover:brightness-105 transition-all"
      >
        <CardArtwork artType={card.artType} clan={card.clan} imageUrl={card.imageUrl} className="w-full h-44" />
        
        {/* Rarity & Archetype Overlay Pill */}
        <div className="absolute top-2 left-2 flex items-center space-x-1">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getRarityBadge(card.rarity)}`}>
            {card.rarity}
          </span>
          {card.archetype && (
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-black/70 border border-white/20 text-gray-200 backdrop-blur-md">
              {card.archetype}
            </span>
          )}
        </div>

        {/* Hover Inspect Indicator */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-vampire-crimson/90 text-white font-gothic text-xs font-bold tracking-wide shadow-blood">
            <Eye className="w-3.5 h-3.5" />
            <span>Inspecter</span>
          </span>
        </div>
      </div>

      {/* Card Name */}
      <div className="px-3.5 pt-2.5 pb-1 bg-gradient-to-b from-[#141824] to-[#0f121a] border-t border-b border-white/5">
        <div className="flex items-baseline justify-between">
          <h3 
            onClick={() => onInspect?.(card)}
            className="font-gothic font-bold text-base text-gray-100 group-hover:text-amber-300 transition-colors truncate cursor-pointer"
            title={card.name}
          >
            {card.name}
          </h3>
          <span className="text-[11px] font-mono text-gray-400 capitalize">
            {card.type}
          </span>
        </div>
      </div>

      {/* Ability Text Box */}
      <div className="px-3 py-2.5 flex-1 bg-[#0b0d14] flex flex-col justify-between text-xs space-y-2">
        <p className="text-gray-300 leading-relaxed font-sans">
          {card.ability}
        </p>

        {/* Flavor Lore Text */}
        {card.flavorText && (
          <p className="italic text-[11px] text-gray-500 font-gothic border-t border-white/5 pt-1.5 line-clamp-2">
            {card.flavorText}
          </p>
        )}
      </div>

      {/* Card Footer / Deck Builder Action Bar */}
      {showActions && (
        <div className="px-3 py-2 bg-[#121520] border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {countInDeck > 0 ? (
              <span className="flex items-center space-x-1 px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold font-mono">
                <span>Dans le deck :</span>
                <span className="font-bold">{countInDeck}/1</span>
              </span>
            ) : (
              <span className="text-[11px] text-gray-500 italic">Non inclus</span>
            )}
          </div>

          <div className="flex items-center space-x-1.5">
            {countInDeck > 0 && (
              <button
                onClick={() => onRemove?.(card)}
                className="p-1.5 rounded-lg bg-red-950/80 hover:bg-red-800 border border-red-500/40 text-red-200 hover:text-white transition-all transform active:scale-95"
                title="Retirer une copie"
              >
                <Minus className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => onAdd?.(card)}
              disabled={countInDeck >= 1}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold font-gothic transition-all transform active:scale-95 ${
                countInDeck >= 1
                  ? 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-800 to-rose-900 hover:from-red-700 hover:to-rose-800 text-white border border-red-500/60 shadow-blood'
              }`}
              title={countInDeck >= 1 ? "Limite de 1 copie atteinte" : "Ajouter au deck"}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{countInDeck >= 1 ? 'Inclus' : 'Ajouter'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
