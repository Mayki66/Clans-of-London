import React from 'react';
import { BookOpen, Shield, Droplets, Trophy, Skull, Flame, Sparkles, Users, Crown, ChevronRight } from 'lucide-react';
import { CLANS, ARCHETYPES } from '../../data/clansData';

export default function RulesGuideView({ onGoToDeckBuilder }) {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Hero Header */}
      <div className="glass-panel-blood rounded-2xl p-6 md:p-8 border border-red-500/30 shadow-2xl space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-semibold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Guide Stratégique & Règles Officielles</span>
        </div>
        <h1 className="font-gothic font-extrabold text-3xl md:text-4xl text-gray-100">
          Comment Jouer à <span className="text-red-500 font-normal">Clans of London</span>
        </h1>
        <p className="text-sm md:text-base text-gray-300 leading-relaxed">
          Situé à Londres 13 ans après la purge de l'<strong>Opération Antigen</strong> (2012), <em>Vampire: The Masquerade – Clans of London</em> vous plonge dans une lutte de pouvoir nocturne effrénée. Les vampires reprennent possession des quartiers londoniens face à la Seconde Inquisition et aux clans rivaux.
        </p>
      </div>

      {/* 4 Pilasters of Gameplay */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Rule 1: 15 Cards Deck */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-2.5">
          <div className="flex items-center space-x-2 text-amber-400 font-gothic font-bold text-base">
            <span className="w-7 h-7 rounded-lg bg-amber-950 border border-amber-500 flex items-center justify-center text-xs">1</span>
            <h3>Un Deck Compact de 15 Cartes</h3>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            Chaque deck est composé d'exactement <strong>15 cartes</strong>. La petite taille du deck impose une précision absolue : chaque carte doit servir un moteur de synergie ou une réponse tactique clé. Aucune carte superflue n'est tolérée.
          </p>
        </div>

        {/* Rule 2: 7 Turns & Blood Economy */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-2.5">
          <div className="flex items-center space-x-2 text-red-400 font-gothic font-bold text-base">
            <span className="w-7 h-7 rounded-lg bg-red-950 border border-red-500 flex items-center justify-center text-xs">2</span>
            <h3>7 Tours & Économie de Sang</h3>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            Les matchs durent <strong>7 tours</strong>. Vous commencez le <strong>Tour 1 avec 2 de Sang</strong>, puis votre réserve augmente de 1 Sang chaque tour (Tour 1 = 2 Sang, Tour 2 = 3 Sang... jusqu'au Tour 7 = 8 Sang). Bien calibrer vos cartes à faible coût pour le Tour 1 est donc primordial.
          </p>
        </div>

        {/* Rule 3: King of the Hill */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-2.5">
          <div className="flex items-center space-x-2 text-purple-400 font-gothic font-bold text-base">
            <span className="w-7 h-7 rounded-lg bg-purple-950 border border-purple-500 flex items-center justify-center text-xs">3</span>
            <h3>Mécanique "King of the Hill"</h3>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            Le plateau se divise en 3 zones d'affrontement, avec au centre le trône convoité du <strong>Prince de Londres</strong>. Contrôler le Prince octroie d'immenses bonus, mais attire également toutes les frappes ennemies.
          </p>
        </div>

        {/* Rule 4: Synergies */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-2.5">
          <div className="flex items-center space-x-2 text-emerald-400 font-gothic font-bold text-base">
            <span className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-500 flex items-center justify-center text-xs">4</span>
            <h3>Synergies de Mots-Clés & Styles</h3>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            Les decks les plus redoutables combinent des cartes autour d'un mot-clé dominant (<em>Violent, Murder, Beast, Elitist, Delusion</em>) tout en intégrant des cartes neutres ou de clans alliés pour combler leurs faiblesses.
          </p>
        </div>

      </div>

      {/* Guide des Archétypes & Styles de Jeu */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
        <h2 className="font-gothic font-bold text-xl text-gray-100 flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>Panorama des 8 Clans et de leurs Mots-Clés</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {Object.entries(CLANS).map(([key, clan]) => (
            <div
              key={key}
              className="p-4 rounded-xl bg-[#0a0d14] border border-white/10 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-gothic font-bold text-sm" style={{ color: clan.themeColor }}>
                  Clan {clan.name}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-white/10 text-gray-300">
                  Mot-clé : {clan.archetype}
                </span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                {clan.description}
              </p>
              <div className="text-[11px] font-mono text-gray-500">
                Style : {clan.playstyle}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to action */}
      <div className="text-center pt-4">
        <button
          onClick={onGoToDeckBuilder}
          className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-red-800 via-red-700 to-rose-900 hover:from-red-700 hover:to-rose-800 text-white font-gothic font-bold text-sm shadow-blood transition-all transform hover:scale-105"
        >
          <span>Commencer à Construire un Deck</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
