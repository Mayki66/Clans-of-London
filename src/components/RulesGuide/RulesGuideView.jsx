import React from 'react';
import { BookOpen, Shield, Droplets, Trophy, Skull, Flame, Sparkles, Users, Crown, ChevronRight, Swords, HelpCircle, Layers, ArrowUpCircle } from 'lucide-react';
import { CLANS } from '../../data/clansData';

export default function RulesGuideView({ onGoToDeckBuilder, lang = 'fr', t }) {
  const isEn = lang === 'en';

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Hero Header */}
      <div className="glass-panel-blood rounded-2xl p-6 md:p-8 border border-red-500/30 shadow-2xl space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-semibold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{isEn ? "Official Rules & Tactical Topology" : "Règlement Officiel & Topologie Tactique"}</span>
        </div>
        <h1 className="font-gothic font-extrabold text-3xl md:text-4xl text-gray-100">
          {isEn ? "Official Rules of " : "Règles Officielles de "}
          <span className="text-red-500 font-normal">Clans of London</span>
        </h1>
        <p className="text-sm md:text-base text-gray-300 leading-relaxed">
          {isEn 
            ? "Official guide for Vampire: The Masquerade – Clans of London. Master the 15-space tactical board, support chains, victory point calculation, and card keywords."
            : "Guide des règles officielles du TCG Vampire: The Masquerade – Clans of London. Maîtrisez la topologie du plateau à 15 cases, la chaîne de soutien, le décompte exact des points et le vocabulaire littéral des cartes."}
        </p>
      </div>

      {/* Board Topology & Support Chain Visual */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-6">
        <div className="flex items-center space-x-2 text-amber-400 font-gothic font-bold text-lg">
          <Crown className="w-5 h-5" />
          <h2>{isEn ? "1. Board Topology & Support Chain (15 Spaces)" : "1. Topologie du Plateau & Chaîne de Soutien (15 Cases)"}</h2>
        </div>

        <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
          {isEn
            ? "The battle arena consists of 15 tactical spaces organized into 3 distinct strategic lines:"
            : "Le champ de bataille est composé d'une grille de 15 emplacements divisée en 3 lignes stratégiques :"}
        </p>

        {/* Board Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#0e131d] border border-blue-500/30 space-y-2">
            <div className="flex items-center justify-between text-blue-300 font-gothic font-bold text-sm">
              <span>{isEn ? "Back Row: Pawns" : "Rangée Arrière : Pions"}</span>
              <span className="text-xs font-mono">{isEn ? "3 Spaces / Player" : "3 Cases / Joueur"}</span>
            </div>
            <p className="text-xs text-gray-400">
              {isEn 
                ? "Secure deployment zone. Ideal for continuous engines, resource generation, and straight line support."
                : "Zone de déploiement de base sécurisée. Idéale pour les générateurs d'effets continus, moteurs de ressources et les soutiens en ligne droite."}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#140e1d] border border-purple-500/30 space-y-2">
            <div className="flex items-center justify-between text-purple-300 font-gothic font-bold text-sm">
              <span>{isEn ? "Middle Row: Rooks" : "Rangée Médiane : Tours"}</span>
              <span className="text-xs font-mono">{isEn ? "3 Spaces / Player" : "3 Cases / Joueur"}</span>
            </div>
            <p className="text-xs text-gray-400">
              {isEn 
                ? "Tactical relay line. Channels support received from Pawns directly toward Knights or the Prince Throne."
                : "Ligne de transition et de relais tactique. Transmet le soutien reçu des Pions directement vers les Cavaliers ou le Prince."}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#1d0e0e] border border-red-500/40 space-y-2">
            <div className="flex items-center justify-between text-red-300 font-gothic font-bold text-sm">
              <span>{isEn ? "Contested Frontline" : "Ligne de Front Disputée"}</span>
              <span className="text-xs font-mono">{isEn ? "2 Knights + 1 Prince" : "2 Cavaliers + 1 Prince"}</span>
            </div>
            <p className="text-xs text-gray-400">
              {isEn 
                ? "The direct conflict zone. Contains 2 flank Knights and the unique central Prince of London Throne."
                : "La zone de conflit direct. Comprend les 2 cases Cavaliers sur les flancs et l'unique Trône du Prince de Londres au centre."}
            </p>
          </div>
        </div>

        {/* Support Chain Callout */}
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 space-y-3 text-xs text-amber-200">
          <div className="flex items-center space-x-2 font-bold font-gothic text-sm text-amber-300">
            <ArrowUpCircle className="w-4 h-4 text-amber-400" />
            <span>{isEn ? "Support Chain & Deployment Rules" : "Règle de Déploiement en Chaîne & Soutien (Support Chain)"}</span>
          </div>
          <ul className="space-y-1.5 list-disc list-inside leading-relaxed text-gray-300">
            <li>
              <strong>{isEn ? "Deployment Condition:" : "Condition de Pose :"}</strong> {isEn 
                ? "Without an active link from your base (Pawn), you cannot deploy cards further ahead (a Rook requires a Pawn behind it, and Knights require their respective Rook)."
                : "Tant qu'il n'y a pas de lien établi en partant de votre base (Pion), vous ne pouvez pas poser de carte plus loin (une Tour nécessite un Pion derrière elle, et les Cavaliers nécessitent leur Tour respective)."}
            </li>
            <li>
              <strong>{isEn ? "Convergence to the Prince Throne:" : "Convergence vers le Trône du Prince :"}</strong> {isEn 
                ? "Left, Center, and Right Rooks all provide a direct link to the central Prince Throne."
                : "Les Tours Gauche, Centrale et Droite fournissent toutes un lien direct vers la case centrale du Trône du Prince."}
            </li>
            <li>
              <strong>{isEn ? "Power Transmission:" : "Transmission de Puissance :"}</strong> {isEn 
                ? "In conflict, each connected unit transmits its full Power forward (unless specified 'Cannot give support')."
                : "En conflit, chaque unité connectée transmet l'intégralité de sa Puissance vers l'avant (sauf mention « Cannot give support »)."}
            </li>
            <li>
              <strong>{isEn ? "Exceptions:" : "Exceptions :"}</strong> {isEn 
                ? "Stealth cards like Shifa (can be played anywhere) or Brixton (playable on Knight without support) bypass deployment restrictions."
                : "Certaines cartes furtives comme Shifa (peut être jouée n'importe où) ou Brixton (jouable sur Cavalier sans soutien requis) ignorent ces contraintes de pose."}
            </li>
          </ul>
        </div>
      </div>

      {/* Scoring and Victory */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
        <div className="flex items-center space-x-2 text-emerald-400 font-gothic font-bold text-lg">
          <Trophy className="w-5 h-5" />
          <h2>{isEn ? "2. Scoring & Victory Conditions (7 Rounds)" : "2. Décompte des Points & Victoire (7 Rounds)"}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-300">
          <div className="p-4 rounded-xl bg-[#09110d] border border-emerald-500/30 space-y-2">
            <h3 className="font-gothic font-bold text-sm text-emerald-300 flex items-center space-x-1.5">
              <span>{isEn ? "Knight Control (Flanks)" : "Contrôle d'un Cavalier (Knight)"}</span>
            </h3>
            <p className="leading-relaxed">
              {isEn 
                ? "Each controlled Knight space awards exactly +2 Victory Points at the end of the round."
                : "Chaque case Cavalier contrôlée rapporte exactement +2 Points de Victoire à la fin de chaque tour."}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#140e1d] border border-amber-500/30 space-y-2">
            <h3 className="font-gothic font-bold text-sm text-amber-300 flex items-center space-x-1.5">
              <span>{isEn ? "Prince Throne Control (Center)" : "Contrôle du Trône du Prince (Center)"}</span>
            </h3>
            <p className="leading-relaxed">
              {isEn 
                ? "Controlling the central Prince Throne awards +1 Victory Point per allied unit in play across the entire board."
                : "Contrôler le Trône du Prince au centre rapporte +1 Point de Victoire par unité alliée présente sur l'ensemble du plateau."}
            </p>
          </div>
        </div>

        {/* Blood Economy Note */}
        <div className="p-4 rounded-xl bg-[#11141e] border border-red-500/30 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-red-300 font-mono font-semibold">
            <Droplets className="w-4 h-4 text-red-400" />
            <span>{isEn ? "Blood Economy: Round 1 = 2 Blood | Round 2 = 3 Blood ... Round 7 = 8 Blood" : "Économie de Sang : Tour 1 = 2 Sang | Tour 2 = 3 Sang ... Tour 7 = 8 Sang"}</span>
          </div>
          <button
            onClick={onGoToDeckBuilder}
            className="px-3 py-1.5 rounded-lg bg-red-800 hover:bg-red-700 text-white font-gothic font-bold text-xs shadow-blood transition-all"
          >
            {isEn ? "Build a Deck →" : "Créer un Deck →"}
          </button>
        </div>
      </div>

      {/* Keywords Glossary */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
        <div className="flex items-center space-x-2 text-red-400 font-gothic font-bold text-lg">
          <Layers className="w-5 h-5" />
          <h2>{isEn ? "3. Official Keywords Glossary" : "3. Glossaire des Mots-Clés Officiels"}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-300">
          <div className="p-3 rounded-xl bg-[#090b10] border border-white/5 space-y-1">
            <span className="font-gothic font-bold text-amber-300 block">{isEn ? "On Reveal (À la Révélation)" : "À la Révélation"}</span>
            <p className="text-gray-400">{isEn ? "Triggers immediately when the card is revealed face up." : "Se déclenche immédiatement au moment où la carte est révélée face visible."}</p>
          </div>

          <div className="p-3 rounded-xl bg-[#090b10] border border-white/5 space-y-1">
            <span className="font-gothic font-bold text-amber-300 block">{isEn ? "Ongoing / Continuous (Continu)" : "Continu"}</span>
            <p className="text-gray-400">{isEn ? "Permanent passive effect active as long as the card stays in play." : "Effet passif permanent tant que la carte reste en jeu."}</p>
          </div>

          <div className="p-3 rounded-xl bg-[#090b10] border border-white/5 space-y-1">
            <span className="font-gothic font-bold text-amber-300 block">{isEn ? "Destroy / Kill (Détruire / Éliminer)" : "Détruire / Éliminer"}</span>
            <p className="text-gray-400">{isEn ? "Removes the unit from the board to its owner's discard pile." : "Retire l'unité du plateau et l'envoie dans la défausse de son propriétaire."}</p>
          </div>

          <div className="p-3 rounded-xl bg-[#090b10] border border-white/5 space-y-1">
            <span className="font-gothic font-bold text-amber-300 block">{isEn ? "Alchemy & Ingredients (Alchimie)" : "Alchimie & Ingrédients"}</span>
            <p className="text-gray-400">{isEn ? "Duskborn mechanics triggering random alchemical effects (Bleach, Caffeine Powder, Blood Bag)." : "Mécanique Duskborn déclenchant des effets aléatoires corrosifs et de soutien."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
