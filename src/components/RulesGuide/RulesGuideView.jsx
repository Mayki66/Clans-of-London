import React from 'react';
import { 
  BookOpen, Shield, Droplets, Trophy, Skull, Flame, Sparkles, 
  Users, Crown, ChevronRight, Swords, HelpCircle, Layers, 
  ArrowUpCircle, Zap, Heart, Eye, Ghost, PawPrint, Moon, Clock, Check
} from 'lucide-react';
import { CLANS, ARCHETYPES, INGREDIENTS } from '../../data/clansData';

export default function RulesGuideView({ onGoToDeckBuilder, lang = 'fr', t }) {
  const isEn = lang !== 'fr';

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Hero Header */}
      <div className="glass-panel-blood rounded-3xl p-6 md:p-8 border border-red-500/30 shadow-2xl space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-semibold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{isEn ? "Official Rules & Tactical Topology" : "Règlement Officiel & Topologie Tactique"}</span>
        </div>
        <h1 className="font-gothic font-extrabold text-3xl md:text-5xl text-gray-100">
          {isEn ? "Official Rules of " : "Règles Officielles de "}
          <span className="text-red-500 font-normal">Clans of London</span>
        </h1>
        <p className="text-sm md:text-base text-gray-300 leading-relaxed font-sans">
          {isEn 
            ? "Complete guide for Vampire: The Masquerade – Clans of London. Master the 15-space tactical board, support chains, victory point calculation, clan archetypes, and literal card keywords."
            : "Guide exhaustif des règles officielles du TCG Vampire: The Masquerade – Clans of London. Maîtrisez la topologie du plateau à 15 cases, la chaîne de soutien, le décompte exact des points, les archétypes de clans et le vocabulaire littéral des cartes."}
        </p>
      </div>

      {/* 1. Board Topology & Support Chain Visual */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/10 space-y-6 shadow-xl">
        <div className="flex items-center space-x-3 text-amber-400 font-gothic font-bold text-xl">
          <Crown className="w-6 h-6 text-amber-400" />
          <h2>{isEn ? "1. Board Topology & Support Chain (15 Spaces)" : "1. Topologie du Plateau & Chaîne de Soutien (15 Cases)"}</h2>
        </div>

        <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">
          {isEn
            ? "The battle arena consists of 15 tactical spaces organized into 3 distinct strategic lines:"
            : "Le champ de bataille est composé d'une grille de 15 emplacements divisée en 3 lignes stratégiques :"}
        </p>

        {/* Board Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#0e131d] border border-blue-500/30 space-y-2">
            <div className="flex items-center justify-between text-blue-300 font-gothic font-bold text-sm">
              <span>{isEn ? "Back Row: Pawns" : "Rangée Arrière : Pions (Pawns)"}</span>
              <span className="text-xs font-mono bg-blue-950/80 px-2 py-0.5 rounded border border-blue-500/40">{isEn ? "3 Spaces / Player" : "3 Cases / Joueur"}</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              {isEn 
                ? "Secure deployment base. Ideal for continuous engines, resource generation, and straight-line support."
                : "Zone de déploiement de base sécurisée. Idéale pour les générateurs d'effets continus, moteurs de ressources et les soutiens en ligne droite."}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#140e1d] border border-purple-500/30 space-y-2">
            <div className="flex items-center justify-between text-purple-300 font-gothic font-bold text-sm">
              <span>{isEn ? "Middle Row: Rooks" : "Rangée Médiane : Tours (Rooks)"}</span>
              <span className="text-xs font-mono bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/40">{isEn ? "3 Spaces / Player" : "3 Cases / Joueur"}</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              {isEn 
                ? "Tactical relay line. Channels support received from Pawns directly toward Knights or the central Prince Throne."
                : "Ligne de transition et de relais tactique. Transmet le soutien reçu des Pions directement vers les Cavaliers ou le Trône du Prince."}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#1d0e0e] border border-red-500/40 space-y-2">
            <div className="flex items-center justify-between text-red-300 font-gothic font-bold text-sm">
              <span>{isEn ? "Contested Frontline" : "Ligne de Front Disputée"}</span>
              <span className="text-xs font-mono bg-red-950/80 px-2 py-0.5 rounded border border-red-500/40">{isEn ? "2 Knights + 1 Prince" : "2 Cavaliers + 1 Prince"}</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              {isEn 
                ? "The direct conflict zone. Contains 2 flank Knights and the unique central Prince of London Throne."
                : "La zone de conflit direct. Comprend les 2 cases Cavaliers sur les flancs et l'unique Trône du Prince de Londres au centre."}
            </p>
          </div>
        </div>

        {/* Support Chain Callout */}
        <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-3 text-xs text-amber-200">
          <div className="flex items-center space-x-2 font-bold font-gothic text-sm text-amber-300">
            <ArrowUpCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <span>{isEn ? "Support Chain & Deployment Rules" : "Règle de Déploiement en Chaîne & Soutien (Support Chain)"}</span>
          </div>
          <ul className="space-y-2 list-disc list-inside leading-relaxed text-gray-300">
            <li>
              <strong>{isEn ? "Deployment Condition:" : "Condition de Pose :"}</strong> {isEn 
                ? "Without an active link established from your base (Pawn), you cannot deploy cards further ahead (a Rook requires a Pawn behind it, and Knights require their respective Rook)."
                : "Tant qu'il n'y a pas de lien établi en partant de votre base (Pion), vous ne pouvez pas poser de carte plus loin (une Tour nécessite un Pion derrière elle, et les Cavaliers nécessitent leur Tour respective)."}
            </li>
            <li>
              <strong>{isEn ? "Convergence to the Prince Throne:" : "Convergence vers le Trône du Prince :"}</strong> {isEn 
                ? "Left, Center, and Right Rooks all provide a direct link to the central Prince Throne."
                : "Les Tours Gauche, Centrale et Droite fournissent toutes un lien direct vers la case centrale du Trône du Prince."}
            </li>
            <li>
              <strong>{isEn ? "Power Transmission:" : "Transmission de Puissance :"}</strong> {isEn 
                ? "In conflict, each connected unit transmits its full Power forward (unless specified 'Cannot give support' like Horatio Drake or Lord Colville)."
                : "En conflit, chaque unité connectée transmet l'intégralité de sa Puissance vers l'avant (sauf mention « Cannot give support » comme Horatio Drake ou Lord Colville)."}
            </li>
            <li>
              <strong>{isEn ? "Exceptions:" : "Exceptions & Contournements :"}</strong> {isEn 
                ? "Stealth cards like Shifa (can be played anywhere) or Brixton (playable on Knight without support) bypass standard deployment restrictions."
                : "Certaines cartes furtives comme Shifa (peut être jouée n'importe où) ou Brixton (jouable sur Cavalier sans aucun soutien requis) ignorent ces contraintes de pose."}
            </li>
          </ul>
        </div>
      </div>

      {/* 2. Scoring and Victory */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/10 space-y-6 shadow-xl">
        <div className="flex items-center space-x-3 text-emerald-400 font-gothic font-bold text-xl">
          <Trophy className="w-6 h-6 text-emerald-400" />
          <h2>{isEn ? "2. Scoring & Victory Conditions (7 Rounds)" : "2. Décompte des Points & Victoire (7 Rounds)"}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-300">
          <div className="p-5 rounded-2xl bg-[#09110d] border border-emerald-500/30 space-y-2">
            <h3 className="font-gothic font-bold text-base text-emerald-300 flex items-center space-x-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>{isEn ? "Knight Control (Flanks)" : "Contrôle d'un Cavalier (Knight)"}</span>
            </h3>
            <p className="leading-relaxed">
              {isEn 
                ? "Each controlled Knight space awards exactly +2 Victory Points at the end of the round."
                : "Chaque case Cavalier contrôlée à la fin d'un round rapporte exactement 2 points de victoire."}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#140e1d] border border-amber-500/30 space-y-2">
            <h3 className="font-gothic font-bold text-base text-amber-300 flex items-center space-x-2">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>{isEn ? "Prince Throne Control (Center)" : "Contrôle du Trône du Prince"}</span>
            </h3>
            <p className="leading-relaxed">
              {isEn 
                ? "Controlling the Prince of London Throne awards +1 Victory Point per allied unit in play across the entire board (army presence multiplier)."
                : "Contrôler le Trône du Prince à la fin d'un round rapporte 1 point par unité alliée présente sur l'ensemble du plateau (multiplicateur de présence de horde/armée)."}
            </p>
          </div>
        </div>

        {/* Blood Economy Progression */}
        <div className="p-4 rounded-2xl bg-[#11141e] border border-red-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-red-300 font-mono font-semibold">
            <Droplets className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>
              {isEn 
                ? "Blood Economy: Round 1 = 2 Blood • R2 = 3 Blood • R3 = 4 Blood • R4 = 5 Blood • R5 = 6 Blood • R6 = 7 Blood • R7 = 8 Blood" 
                : "Économie de Sang : Tour 1 = 2 Sang • Tour 2 = 3 Sang • Tour 3 = 4 Sang • Tour 4 = 5 Sang • Tour 5 = 6 Sang • Tour 6 = 7 Sang • Tour 7 = 8 Sang"}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Keywords Glossary & Literal Effect Definitions */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/10 space-y-6 shadow-xl">
        <div className="flex items-center space-x-3 text-purple-400 font-gothic font-bold text-xl">
          <Sparkles className="w-6 h-6 text-purple-400" />
          <h2>{isEn ? "3. Official Keywords & Literal Effect Glossary" : "3. Glossaire Exhaustif des Mots-Clés & Indicateurs Littéraux"}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
          {/* On Reveal */}
          <div className="p-4 rounded-xl bg-[#090b10] border border-white/10 space-y-1.5 hover:border-amber-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-amber-300 text-sm">
                {isEn ? "On Reveal" : "À la Révélation (On Reveal)"}
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-950 text-[10px] font-mono text-amber-300 border border-amber-500/30">Indicateur</span>
            </div>
            <p className="text-gray-300 leading-relaxed font-sans">
              {isEn 
                ? "Triggers immediately at the moment the card is revealed face-up on the board." 
                : "Déclenché immédiatement au moment où la carte est jouée et révélée face visible sur le plateau."}
            </p>
          </div>

          {/* On Attack */}
          <div className="p-4 rounded-xl bg-[#090b10] border border-white/10 space-y-1.5 hover:border-red-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-red-300 text-sm">
                {isEn ? "On Attack / While Attacking" : "À l'Attaque / Pendant l'Attaque"}
              </span>
              <span className="px-2 py-0.5 rounded bg-red-950 text-[10px] font-mono text-red-300 border border-red-500/30">Combat</span>
            </div>
            <p className="text-gray-300 leading-relaxed font-sans">
              {isEn 
                ? "Triggers exclusively during an assault initiated actively by this card against an enemy." 
                : "Déclenché uniquement pendant une phase d'assaut initiée activement par cette carte contre une unité ennemie."}
            </p>
          </div>

          {/* While in Play / Ongoing */}
          <div className="p-4 rounded-xl bg-[#090b10] border border-white/10 space-y-1.5 hover:border-blue-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-blue-300 text-sm">
                {isEn ? "Ongoing (While in Play)" : "Tant qu'en jeu / Continu (Ongoing)"}
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-950 text-[10px] font-mono text-blue-300 border border-blue-500/30">Passif</span>
            </div>
            <p className="text-gray-300 leading-relaxed font-sans">
              {isEn 
                ? "Permanent passive effect active continuously as long as the card stays in play." 
                : "Effet passif permanent continu tant que la carte demeure sur le terrain."}
            </p>
          </div>

          {/* Murder */}
          <div className="p-4 rounded-xl bg-[#090b10] border border-white/10 space-y-1.5 hover:border-purple-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-purple-300 text-sm">
                {isEn ? "Murder / Kill" : "Assassiner / Éliminer (Murder)"}
              </span>
              <span className="px-2 py-0.5 rounded bg-purple-950 text-[10px] font-mono text-purple-300 border border-purple-500/30">Destruction</span>
            </div>
            <p className="text-gray-300 leading-relaxed font-sans">
              {isEn 
                ? "Removes the targeted unit to the discard pile or permanently from play, triggering death rattles." 
                : "Destruction absolue qui élimine la cible et l'envoie dans la défausse, déclenchant les moteurs de mort Hecata."}
            </p>
          </div>

          {/* Seduce */}
          <div className="p-4 rounded-xl bg-[#090b10] border border-white/10 space-y-1.5 hover:border-pink-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-pink-300 text-sm">
                {isEn ? "Seduce" : "Séduire (Seduce)"}
              </span>
              <span className="px-2 py-0.5 rounded bg-pink-950 text-[10px] font-mono text-pink-300 border border-pink-500/30">Contrôle</span>
            </div>
            <p className="text-gray-300 leading-relaxed font-sans">
              {isEn 
                ? "Steals an enemy unit (in play or defeated) and puts it directly into your own hand." 
                : "Vole une carte ennemie (en jeu ou vaincue selon le texte) pour l'ajouter directement dans votre main."}
            </p>
          </div>

          {/* Stealth & Bypass */}
          <div className="p-4 rounded-xl bg-[#090b10] border border-white/10 space-y-1.5 hover:border-emerald-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-emerald-300 text-sm">
                {isEn ? "Stealth & Infiltration" : "Furtivité & Contournement"}
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-[10px] font-mono text-emerald-300 border border-emerald-500/30">Mouvement</span>
            </div>
            <p className="text-gray-300 leading-relaxed font-sans">
              {isEn 
                ? "Allows playing a unit anywhere or ignoring standard support chain requirements." 
                : "Permet de poser l'unité sur n'importe quel emplacement sans requérir de soutien continu préalable (ex: Shifa, Brixton)."}
            </p>
          </div>

          {/* Duskborn Alchemy & Ingredients */}
          <div className="p-4 rounded-xl bg-[#090b10] border border-white/10 space-y-1.5 hover:border-slate-400 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-gray-200 text-sm">
                {isEn ? "Duskborn Alchemy & Ingredients" : "Alchimie & Ingrédients Duskborn"}
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 text-[10px] font-mono text-gray-300 border border-slate-700">Spécial</span>
            </div>
            <p className="text-gray-300 leading-relaxed font-sans">
              {isEn 
                ? "Generates or combines modular alchemical ingredients: Bleach (acid debuff), Caffeine Powder (haste/boost), Blood Bag (blood surge)." 
                : "Mécanique du Sang-Clair générant des Ingrédients modulaires : Bleach (corrosif), Caffeine Powder (accélération), Blood Bag (recharge de sang)."}
            </p>
          </div>

          {/* X Blood Cost */}
          <div className="p-4 rounded-xl bg-[#090b10] border border-white/10 space-y-1.5 hover:border-red-400 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-rose-300 text-sm">
                {isEn ? "Flexible Blood Cost (X)" : "Coût en Sang Flexible (X)"}
              </span>
              <span className="px-2 py-0.5 rounded bg-red-950 text-[10px] font-mono text-rose-300 border border-red-500/30">Ressource</span>
            </div>
            <p className="text-gray-300 leading-relaxed font-sans">
              {isEn 
                ? "The blood cost dynamically scales with the current round number (e.g. at Round 3, Cormac Flynn costs 3 Blood)." 
                : "Le coût en sang de la carte est égal au numéro du tour actuel (ex: au Tour 3, la carte Cormac Flynn coûtera 3 Sang)."}
            </p>
          </div>

          {/* Vanilla / No text */}
          <div className="p-4 rounded-xl bg-[#090b10] border border-white/10 space-y-1.5 hover:border-yellow-500/40 transition-all md:col-span-2">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-yellow-300 text-sm">
                {isEn ? "Vanilla Cards (No text / N/A)" : "Cartes Sans Texte (Vanilla / N/A)"}
              </span>
              <span className="px-2 py-0.5 rounded bg-yellow-950 text-[10px] font-mono text-yellow-300 border border-yellow-500/30">Statistiques</span>
            </div>
            <p className="text-gray-300 leading-relaxed font-sans">
              {isEn 
                ? "Cards with pure raw combat stats and no special rule text (e.g. Hope Ekaette 6/12, Mrs Fitzgerald 8/14)." 
                : "Cartes à statistiques pures sans capacité spéciale active, offrant une puissance brute élevée pour un coût optimisé (ex: Hope Ekaette 6/12, Mrs Fitzgerald 8/14)."}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Panorama des 8 Clans et Factions */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/10 space-y-6 shadow-xl">
        <div className="flex items-center space-x-3 text-amber-400 font-gothic font-bold text-xl">
          <Users className="w-6 h-6 text-amber-400" />
          <h2>{isEn ? "4. Panorama of the 8 Clans & Factions" : "4. Panorama des 8 Clans & Factions"}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(CLANS).map(([key, clan]) => (
            <div
              key={key}
              className="p-5 rounded-2xl bg-[#0a0d14] border border-white/10 space-y-2.5 hover:border-white/20 transition-all shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="font-gothic font-extrabold text-base" style={{ color: clan.themeColor }}>
                  {clan.name}
                </span>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-900 border border-white/10 text-gray-300">
                  {isEn ? "Archetype:" : "Archétype :"} {clan.archetype}
                </span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                {clan.description}
              </p>
              <div className="text-[11px] font-mono text-gray-500 pt-1 border-t border-white/5">
                <strong className="text-gray-400">{isEn ? "Playstyle:" : "Style de jeu :"}</strong> {clan.playstyle}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to action */}
      <div className="text-center pt-4">
        <button
          onClick={onGoToDeckBuilder}
          className="inline-flex items-center space-x-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-red-800 via-red-700 to-rose-900 hover:from-red-700 hover:to-rose-800 text-white font-gothic font-bold text-sm shadow-blood transition-all transform hover:scale-105"
        >
          <Swords className="w-5 h-5" />
          <span>{isEn ? "Build a Competitive Deck (15 Cards) →" : "Construire un Deck Compétitif (15 Cartes) →"}</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
