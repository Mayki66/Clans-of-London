import React from 'react';
import { 
  BookOpen, Shield, Droplets, Trophy, Skull, Flame, Sparkles, 
  Users, Crown, ChevronRight, Swords, HelpCircle, Layers, 
  ArrowUpCircle, Zap, Heart, Eye, Ghost, PawPrint, Moon, Clock, Check
} from 'lucide-react';
import { CLANS, ARCHETYPES, INGREDIENTS } from '../../data/clansData';

export default function RulesGuideView({ onGoToDeckBuilder, lang = 'fr', t }) {
  const isFrench = lang === 'fr';

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Hero Header */}
      <div className="glass-panel-blood rounded-3xl p-6 md:p-8 border border-red-500/30 shadow-2xl space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-semibold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{t?.rules?.badge || "Règlement Officiel & Topologie Tactique"}</span>
        </div>
        <h1 className="font-gothic font-extrabold text-3xl md:text-5xl text-gray-100">
          {t?.rules?.heroTitle || "Règles Officielles de "}
          <span className="text-red-500 font-normal">Clans of London</span>
        </h1>
        <p className="text-sm md:text-base text-gray-300 leading-relaxed font-sans">
          {t?.rules?.heroSubtitle || "Guide exhaustif des règles officielles du TCG Vampire: The Masquerade – Clans of London. Maîtrisez la topologie du plateau à 15 cases, la chaîne de soutien, le décompte exact des points, les archétypes de clans et le vocabulaire littéral des cartes."}
        </p>
      </div>

      {/* 1. Board Topology & Support Chain Visual */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/10 space-y-6 shadow-xl">
        <div className="flex items-center space-x-3 text-amber-400 font-gothic font-bold text-xl">
          <Crown className="w-6 h-6 text-amber-400" />
          <h2>{t?.rules?.sec1Title || "1. Topologie du Plateau & Chaîne de Soutien (15 Cases)"}</h2>
        </div>

        <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">
          {t?.rules?.sec1Desc || "Le champ de bataille est composé d'une grille de 15 emplacements divisée en 3 lignes stratégiques :"}
        </p>

        {/* Board Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#0e131d] border border-blue-500/30 space-y-2">
            <div className="flex items-center justify-between text-blue-300 font-gothic font-bold text-sm">
              <span>{t?.rules?.pawnTitle || "Rangée Arrière : Pions (Pawns)"}</span>
              <span className="text-xs font-mono bg-blue-950/80 px-2 py-0.5 rounded border border-blue-500/40">{t?.rules?.pawnBadge || "3 Cases / Joueur"}</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              {t?.rules?.pawnDesc || "Zone de déploiement de base sécurisée. Idéale pour les générateurs d'effets continus, moteurs de ressources et les soutiens en ligne droite."}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#140e1d] border border-purple-500/30 space-y-2">
            <div className="flex items-center justify-between text-purple-300 font-gothic font-bold text-sm">
              <span>{t?.rules?.rookTitle || "Rangée Médiane : Tours (Rooks)"}</span>
              <span className="text-xs font-mono bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/40">{t?.rules?.rookBadge || "3 Cases / Joueur"}</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              {t?.rules?.rookDesc || "Ligne de transition et de relais tactique. Transmet le soutien reçu des Pions directement vers les Cavaliers ou le Trône du Prince."}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#1d0e0e] border border-red-500/40 space-y-2">
            <div className="flex items-center justify-between text-red-300 font-gothic font-bold text-sm">
              <span>{t?.rules?.knightTitle || "Ligne de Front Disputée"}</span>
              <span className="text-xs font-mono bg-red-950/80 px-2 py-0.5 rounded border border-red-500/40">{t?.rules?.knightBadge || "2 Cavaliers + 1 Prince"}</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              {t?.rules?.knightDesc || "La zone de conflit direct. Comprend les 2 cases Cavaliers sur les flancs et l'unique Trône du Prince de Londres au centre."}
            </p>
          </div>
        </div>

        {/* Support Chain Callout */}
        <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-3 text-xs text-amber-200">
          <div className="flex items-center space-x-2 font-bold font-gothic text-sm text-amber-300">
            <ArrowUpCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <span>{t?.rules?.supportTitle || "Règle de Déploiement en Chaîne & Soutien (Support Chain)"}</span>
          </div>
          <ul className="space-y-2 list-disc list-inside leading-relaxed text-gray-300">
            <li>
              <strong>{t?.rules?.condPoseTitle || "Condition de Pose :"}</strong> {t?.rules?.condPoseDesc || "Tant qu'il n'y a pas de lien établi en partant de votre base (Pion), vous ne pouvez pas poser de carte plus loin (une Tour nécessite un Pion derrière elle, et les Cavaliers nécessitent leur Tour respective)."}
            </li>
            <li>
              <strong>{t?.rules?.convergenceTitle || "Convergence vers le Trône du Prince :"}</strong> {t?.rules?.convergenceDesc || "Les Tours Gauche, Centrale et Droite fournissent toutes un lien direct vers la case centrale du Trône du Prince."}
            </li>
            <li>
              <strong>{t?.rules?.transmTitle || "Transmission de Puissance :"}</strong> {t?.rules?.transmDesc || "Certaines cartes arrière fournissent des bonus cumulatifs de Puissance ou de Sang aux cartes situées directement devant elles."}
            </li>
            <li>
              <strong>{t?.rules?.exceptTitle || "Exceptions & Contournements :"}</strong> {t?.rules?.exceptDesc || "Des cartes spécifiques comme Shifa (infiltrée) ou Brixton peuvent contourner les règles habituelles de chaîne de soutien."}
            </li>
          </ul>
        </div>
      </div>

      {/* 2. Scoring and Victory */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/10 space-y-6 shadow-xl">
        <div className="flex items-center space-x-3 text-emerald-400 font-gothic font-bold text-xl">
          <Trophy className="w-6 h-6 text-emerald-400" />
          <h2>{t?.rules?.sec2Title || "2. Décompte des Points & Victoire (7 Rounds)"}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-300">
          <div className="p-5 rounded-2xl bg-[#09110d] border border-emerald-500/30 space-y-2">
            <h3 className="font-gothic font-bold text-base text-emerald-300 flex items-center space-x-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>{t?.rules?.knightControlTitle || "Contrôle d'un Cavalier (Knight)"}</span>
            </h3>
            <span className="text-[11px] font-mono font-bold text-emerald-400 block">{t?.rules?.knightControlPoints || "+2 Points / Tour"}</span>
            <p className="leading-relaxed">
              {t?.rules?.knightControlDesc || "Remporté par le joueur ayant la plus grande Puissance sur cette colonne de front. Chaque Cavalier contrôlé rapporte 2 points fixes."}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#140e1d] border border-amber-500/30 space-y-2">
            <h3 className="font-gothic font-bold text-base text-amber-300 flex items-center space-x-2">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>{t?.rules?.princeThroneTitle || "Contrôle du Trône du Prince"}</span>
            </h3>
            <span className="text-[11px] font-mono font-bold text-amber-400 block">{t?.rules?.princeThronePoints || "+1 Pt / Unité Alliée"}</span>
            <p className="leading-relaxed">
              {t?.rules?.princeThroneDesc || "Le joueur dominant le centre marque 1 point par unité alliée actuellement en jeu sur l'ensemble de ses 9 cases."}
            </p>
          </div>
        </div>

        {/* Tiebreaker */}
        <div className="p-4 rounded-2xl bg-[#0a0d14] border border-white/10 text-xs text-gray-300 space-y-1">
          <span className="font-gothic font-bold text-gray-200 block">{t?.rules?.tiebreakerTitle || "Règle des Égalités (Tiebreaker)"}</span>
          <p>{t?.rules?.tiebreakerDesc || "Si deux joueurs ont la même puissance sur une case de front, aucun point n'est attribué pour cette case lors du round."}</p>
        </div>

        {/* Blood Economy Progression */}
        <div className="p-4 rounded-2xl bg-[#11141e] border border-red-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-red-300 font-mono font-semibold">
            <Droplets className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>
              {isFrench 
                ? "Économie de Sang : Tour 1 = 2 Sang • Tour 2 = 3 Sang • Tour 3 = 4 Sang • Tour 4 = 5 Sang • Tour 5 = 6 Sang • Tour 6 = 7 Sang • Tour 7 = 8 Sang"
                : "Blood Economy: Round 1 = 2 Blood • R2 = 3 Blood • R3 = 4 Blood • R4 = 5 Blood • R5 = 6 Blood • R6 = 7 Blood • R7 = 8 Blood"}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Keywords Glossary & Literal Effect Definitions */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/10 space-y-6 shadow-xl">
        <div className="flex items-center space-x-3 text-purple-400 font-gothic font-bold text-xl">
          <Sparkles className="w-6 h-6 text-purple-400" />
          <h2>{t?.rules?.sec3Title || "3. Glossaire Exhaustif des Mots-Clés & Indicateurs Littéraux"}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
          {/* On Reveal */}
          <div className="p-4 rounded-xl bg-[#090b10] border border-white/10 space-y-1.5 hover:border-amber-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-amber-300 text-sm">
                {t?.rules?.onRevealTitle || "À la Révélation (On Reveal)"}
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-950 text-[10px] font-mono text-amber-300 border border-amber-500/30">Trigger</span>
            </div>
            <p className="text-gray-300 leading-relaxed font-sans">
              {t?.rules?.onRevealDesc || "S'active instantanément au moment où la carte est retournée face visible."}
            </p>
          </div>

          {/* On Attack */}
          <div className="p-4 rounded-xl bg-[#090b10] border border-white/10 space-y-1.5 hover:border-red-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-red-300 text-sm">
                {t?.rules?.onAttackTitle || "À l'Attaque / Pendant l'Attaque"}
              </span>
              <span className="px-2 py-0.5 rounded bg-red-950 text-[10px] font-mono text-red-300 border border-red-500/30">Combat</span>
            </div>
            <p className="text-gray-300 leading-relaxed font-sans">
              {t?.rules?.onAttackDesc || "Confère un bonus ou déclenche un effet lorsque la carte dispute une case de front ou engage le combat."}
            </p>
          </div>

          {/* While in Play / Ongoing */}
          <div className="p-4 rounded-xl bg-[#090b10] border border-white/10 space-y-1.5 hover:border-blue-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-blue-300 text-sm">
                {t?.rules?.ongoingTitle || "Tant qu'en jeu / Continu (Ongoing)"}
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-950 text-[10px] font-mono text-blue-300 border border-blue-500/30">Passive</span>
            </div>
            <p className="text-gray-300 leading-relaxed font-sans">
              {t?.rules?.ongoingDesc || "Effet persistant actif tant que la carte reste déployée sur le plateau."}
            </p>
          </div>

          {/* Murder */}
          <div className="p-4 rounded-xl bg-[#090b10] border border-white/10 space-y-1.5 hover:border-purple-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-purple-300 text-sm">
                {t?.rules?.murderTitle || "Assassiner / Éliminer (Murder)"}
              </span>
              <span className="px-2 py-0.5 rounded bg-purple-950 text-[10px] font-mono text-purple-300 border border-purple-500/30">Destruction</span>
            </div>
            <p className="text-gray-300 leading-relaxed font-sans">
              {t?.rules?.murderDesc || "Détruit immédiatement une carte ennemie ciblée et l'envoie dans la défausse."}
            </p>
          </div>

          {/* Seduce */}
          <div className="p-4 rounded-xl bg-[#090b10] border border-white/10 space-y-1.5 hover:border-pink-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-pink-300 text-sm">
                {t?.rules?.seduceTitle || "Séduire (Seduce)"}
              </span>
              <span className="px-2 py-0.5 rounded bg-pink-950 text-[10px] font-mono text-pink-300 border border-pink-500/30">Control</span>
            </div>
            <p className="text-gray-300 leading-relaxed font-sans">
              {t?.rules?.seduceDesc || "Prend temporairement ou définitivement le contrôle d'une carte adverse pour la placer dans vos rangs."}
            </p>
          </div>

          {/* Stealth & Bypass */}
          <div className="p-4 rounded-xl bg-[#090b10] border border-white/10 space-y-1.5 hover:border-emerald-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-emerald-300 text-sm">
                {t?.rules?.stealthTitle || "Furtivité & Contournement"}
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-[10px] font-mono text-emerald-300 border border-emerald-500/30">Movement</span>
            </div>
            <p className="text-gray-300 leading-relaxed font-sans">
              {t?.rules?.stealthDesc || "Permet de se déployer sans soutien direct ou d'ignorer la défense adverse."}
            </p>
          </div>

          {/* Duskborn Alchemy & Ingredients */}
          <div className="p-4 rounded-xl bg-[#090b10] border border-white/10 space-y-1.5 hover:border-slate-400 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-gray-200 text-sm">
                {t?.rules?.alchemyTitle || "Alchimie & Ingrédients Duskborn"}
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 text-[10px] font-mono text-gray-300 border border-slate-700">Special</span>
            </div>
            <p className="text-gray-300 leading-relaxed font-sans">
              {t?.rules?.alchemyDesc || "Combine des composants (Cendre, Sang, Alchimie) pour déclencher des effets dévastateurs à faible coût."}
            </p>
          </div>

          {/* X Blood Cost */}
          <div className="p-4 rounded-xl bg-[#090b10] border border-white/10 space-y-1.5 hover:border-red-400 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-rose-300 text-sm">
                {t?.rules?.costXTitle || "Coût en Sang Flexible (X)"}
              </span>
              <span className="px-2 py-0.5 rounded bg-red-950 text-[10px] font-mono text-rose-300 border border-red-500/30">Resource</span>
            </div>
            <p className="text-gray-300 leading-relaxed font-sans">
              {t?.rules?.costXDesc || "Vous dépensez la quantité de Sang voulue pour proportionner la puissance ou l'effet de la carte."}
            </p>
          </div>

          {/* Vanilla / No text */}
          <div className="p-4 rounded-xl bg-[#090b10] border border-white/10 space-y-1.5 hover:border-yellow-500/40 transition-all md:col-span-2">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-yellow-300 text-sm">
                {t?.rules?.vanillaTitle || "Cartes Sans Texte (Vanilla / N/A)"}
              </span>
              <span className="px-2 py-0.5 rounded bg-yellow-950 text-[10px] font-mono text-yellow-300 border border-yellow-500/30">Stats</span>
            </div>
            <p className="text-gray-300 leading-relaxed font-sans">
              {t?.rules?.vanillaDesc || "Cartes pures sans texte de règle, offrant un ratio Coût / Puissance brute supérieur."}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Panorama des 8 Clans et Factions */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/10 space-y-6 shadow-xl">
        <div className="flex items-center space-x-3 text-amber-400 font-gothic font-bold text-xl">
          <Users className="w-6 h-6 text-amber-400" />
          <h2>{t?.rules?.sec4Title || "4. Panorama des 8 Clans & Factions"}</h2>
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
                  {t?.rules?.archetypeLabel || "Archétype :"} {clan.archetype}
                </span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                {clan.description}
              </p>
              <div className="text-[11px] font-mono text-gray-500 pt-1 border-t border-white/5">
                <strong className="text-gray-400">{t?.rules?.playstyleLabel || "Style de jeu :"}</strong> {clan.playstyle}
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
          <span>{t?.rules?.buildDeckBtn || "Construire un Deck Compétitif (15 Cartes) →"}</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
