import React, { useState } from 'react';
import { Sparkles, Eye, ImageOff, Flame, Crown, Skull, PawPrint, Eye as EyeIcon, Ghost, Heart, Shield } from 'lucide-react';

const CLAN_ICONS = {
  Brujah: Flame,
  Ventrue: Crown,
  Hecata: Skull,
  Gangrel: PawPrint,
  Tremere: Sparkles,
  Malkavian: EyeIcon,
  Nosferatu: Ghost,
  Toreador: Heart,
  Mortal: Shield
};

export default function CardArtwork({ 
  artType, 
  clan, 
  imageUrl, 
  hasOfficialImage = false,
  className = "w-full h-44" 
}) {
  const [imageError, setImageError] = useState(false);

  // Palette according to clan
  const getClanColors = (c) => {
    switch (c) {
      case 'Brujah':
        return { primary: '#f97316', secondary: '#fb923c', dark: '#431407', glow: '#ea580c', border: '#f97316' };
      case 'Ventrue':
        return { primary: '#93c5fd', secondary: '#bfdbfe', dark: '#172554', glow: '#60a5fa', border: '#93c5fd' };
      case 'Hecata':
        return { primary: '#3b82f6', secondary: '#60a5fa', dark: '#172554', glow: '#1d4ed8', border: '#3b82f6' };
      case 'Gangrel':
        return { primary: '#22c55e', secondary: '#86efac', dark: '#0a2f16', glow: '#10b981', border: '#22c55e' };
      case 'Tremere':
        return { primary: '#ef4444', secondary: '#f87171', dark: '#3b0d0c', glow: '#dc2626', border: '#ef4444' };
      case 'Malkavian':
        return { primary: '#38bdf8', secondary: '#7dd3fc', dark: '#082f49', glow: '#0284c7', border: '#38bdf8' };
      case 'Nosferatu':
        return { primary: '#9ca3af', secondary: '#d1d5db', dark: '#1f2937', glow: '#6b7280', border: '#9ca3af' };
      case 'Toreador':
        return { primary: '#ec4899', secondary: '#f472b6', dark: '#500724', glow: '#db2777', border: '#ec4899' };
      default:
        return { primary: '#94a3b8', secondary: '#cbd5e1', dark: '#1e293b', glow: '#64748b', border: '#94a3b8' };
    }
  };

  const colors = getClanColors(clan);
  const ClanIconComponent = CLAN_ICONS[clan] || Shield;

  // Render Real Image if provided and not errored
  if (imageUrl && !imageError) {
    return (
      <div className={`relative overflow-hidden bg-black flex items-center justify-center ${className}`}>
        {/* Photo Image */}
        <img
          src={imageUrl}
          alt={clan}
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500 brightness-95 contrast-105"
          loading="lazy"
        />

        {/* Thematic Atmospheric Vignette & Color Gradients */}
        <div 
          className="absolute inset-0 opacity-40 mix-blend-color pointer-events-none"
          style={{ backgroundColor: colors.primary }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090f] via-transparent to-black/60 pointer-events-none" />
        <div className="absolute inset-0 shadow-[inset_0_0_25px_rgba(0,0,0,0.85)] pointer-events-none" />

        {/* Clan Watermark Crest */}
        <div 
          className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full border border-white/20 flex items-center space-x-1 bg-black/70 backdrop-blur-md pointer-events-none"
          style={{ color: colors.glow }}
        >
          <ClanIconComponent className="w-3 h-3" />
          <span className="text-[9px] font-gothic font-bold">{clan}</span>
        </div>
      </div>
    );
  }

  // "IMAGE TYPE" PLACEHOLDER - Sceau d'Archivage Gothique pour cartes en attente d'image du Wiki
  return (
    <div className={`relative overflow-hidden bg-gradient-to-b from-[#08090e] via-[#10131d] to-[#06070b] flex flex-col items-center justify-center border-b border-white/5 ${className}`}>
      
      {/* Background Radial Glow of Clan */}
      <div 
        className="absolute inset-0 opacity-30 mix-blend-screen pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 45%, ${colors.primary} 0%, transparent 65%)`
        }}
      />

      {/* London Fog & Masonry Pattern Grid */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:14px_14px] pointer-events-none" />

      {/* London Skyline Silhouette in Background */}
      <div className="absolute bottom-0 inset-x-0 h-16 opacity-30 pointer-events-none flex items-end justify-around px-4">
        <div className="w-4 h-12 bg-black rounded-t-sm" />
        <div className="w-6 h-8 bg-black rounded-t-sm" />
        <div className="w-3 h-16 bg-black rounded-t-sm" />
        <div className="w-8 h-10 bg-black rounded-t-sm" />
        <div className="w-5 h-14 bg-black rounded-t-sm" />
      </div>

      {/* Central Gothic Clan Sigil Medallion */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-2 text-center p-3">
        <div 
          className="relative w-16 h-16 rounded-2xl border-2 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-300"
          style={{ 
            backgroundColor: `${colors.dark}dd`,
            borderColor: colors.border,
            boxShadow: `0 0 20px ${colors.glow}40`
          }}
        >
          {/* Outer runic ring */}
          <div 
            className="absolute inset-1 rounded-xl border border-dashed opacity-40 pointer-events-none"
            style={{ borderColor: colors.primary }}
          />
          <ClanIconComponent 
            className="w-8 h-8" 
            style={{ color: colors.glow }} 
          />
        </div>

        {/* Placeholder Label */}
        <div className="space-y-0.5">
          <span 
            className="inline-block text-[9px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border bg-black/60 backdrop-blur-sm"
            style={{ borderColor: `${colors.primary}60`, color: colors.secondary }}
          >
            Sceau du Clan {clan}
          </span>
          <p className="text-[10px] text-gray-500 font-gothic">
            Visuel en cours d'archivage • Wiki
          </p>
        </div>
      </div>

      {/* Vignette border */}
      <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.9)] pointer-events-none" />
    </div>
  );
}
