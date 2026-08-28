import React from 'react';
import { 
  BookOpen, Shield, Droplets, Trophy, Skull, Flame, Sparkles, 
  Users, Crown, ChevronRight, Swords, HelpCircle, Layers, 
  ArrowUpCircle, Zap, Heart, Eye, Ghost, PawPrint, Moon, Clock, Check, AlertTriangle
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
          {t?.rules?.heroSubtitle || "Guide exhaustif des règles officielles du TCG Vampire: The Masquerade – Clans of London. Maîtrisez la topologie du plateau à 15 cases, la chaîne de soutien, le décompte exact des points, l'économie de sang et la priorité de révélation."}
        </p>
      </div>

      {/* 4 CORE OFFICIAL RULES CARDS (Direct from Official Mobile Game Rules) */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-amber-400 font-gothic font-bold text-lg">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h2>{isFrench ? "Les 4 Piliers Fondamentaux du Jeu" : "The 4 Core Game Mechanics"}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card 1: Priorité de Jeu & Ordre de Révélation (Screenshot 1) */}
          <div className="glass-panel rounded-2xl p-5 border border-red-500/40 space-y-4 shadow-lg bg-gradient-to-b from-[#180e12] to-[#0d090d]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-red-950 border border-red-500/60 flex items-center justify-center shadow-blood text-red-400 font-bold">
                  <Zap className="w-5 h-5 fill-red-500 text-red-300" />
                </div>
                <div>
                  <h3 className="font-gothic font-bold text-base text-red-300">
                    {t?.rules?.rulePriorityTitle || "Priorité & Révélation"}
                  </h3>
                  <span className="text-[10px] font-mono text-gray-400">
                    {t?.rules?.rulePriorityBadge || "Ordre du Tour"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-gray-200">
              <div className="p-3 rounded-xl bg-black/60 border border-white/5 flex items-start space-x-2.5">
                <div className="w-5 h-5 rounded bg-red-900/80 border border-red-500 text-red-200 flex items-center justify-center flex-shrink-0 font-bold text-[10px] mt-0.5">
                  ⚡
                </div>
                <p className="font-sans leading-relaxed">
                  <strong>{t?.rules?.rulePriority1 || "Celui qui a le moins de Points révèle la première carte."}</strong>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/60 border border-white/5 flex items-start space-x-2.5">
                <div className="w-5 h-5 rounded bg-purple-900/80 border border-purple-500 text-purple-200 flex items-center justify-center flex-shrink-0 font-bold text-[10px] mt-0.5">
                  🔄
                </div>
                <p className="font-sans leading-relaxed">
                  {t?.rules?.rulePriority2 || "Les joueurs révèlent les cartes à tour de rôle (alternance 1 par 1)."}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/50 flex items-start space-x-2.5 text-red-200">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="font-sans leading-relaxed font-semibold">
                  {t?.rules?.rulePriorityConflict || "Les conflits forcent la révélation des cartes et interrompent l'ordre."}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Système de Points & Décompte (Screenshot 2) */}
          <div className="glass-panel rounded-2xl p-5 border border-amber-500/40 space-y-4 shadow-lg bg-gradient-to-b from-[#18140c] to-[#0d0a06]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-500/60 flex items-center justify-center shadow-gold text-amber-400 font-bold">
                  <Trophy className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-gothic font-bold text-base text-amber-300">
                    {t?.rules?.ruleScoringTitle || "Système de Points"}
                  </h3>
                  <span className="text-[10px] font-mono text-gray-400">
                    {t?.rules?.ruleScoringBadge || "7 Manches"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-gray-200">
              <div className="p-3 rounded-xl bg-black/60 border border-white/5 flex items-start space-x-2.5">
                <span className="text-amber-400 font-bold text-sm">🏆</span>
                <p className="font-sans leading-relaxed">
                  <strong>{t?.rules?.ruleScoringWin || "Pour gagner, ayez le plus de Points à la fin de la 7e manche."}</strong>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/60 border border-white/5 flex items-start space-x-2.5">
                <Crown className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="font-sans leading-relaxed">
                  <strong>{t?.rules?.ruleScoringPrince || "Le Prince marque 1 Point pour chacune de vos cartes alliées en jeu."}</strong>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/60 border border-white/5 flex items-start space-x-2.5">
                <span className="text-amber-300 font-bold text-sm">♞</span>
                <p className="font-sans leading-relaxed">
                  <strong>{t?.rules?.ruleScoringKnight || "Chaque Cavalier victorieux marque 2 Points."}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Implication du Sang & Gestion des Ressources (Screenshot 3) */}
          <div className="glass-panel rounded-2xl p-5 border border-rose-500/40 space-y-4 shadow-lg bg-gradient-to-b from-[#1c0e12] to-[#0c0608]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-rose-950 border border-rose-500/60 flex items-center justify-center shadow-blood text-rose-400 font-bold">
                  <Droplets className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h3 className="font-gothic font-bold text-base text-rose-300">
                    {t?.rules?.ruleBloodTitle || "Implication du Sang"}
                  </h3>
                  <span className="text-[10px] font-mono text-gray-400">
                    {t?.rules?.ruleBloodBadge || "Économie"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-gray-200">
              <div className="p-3 rounded-xl bg-black/60 border border-white/5 flex items-start space-x-2.5">
                <span className="text-red-400 font-bold text-sm">🩸</span>
                <p className="font-sans leading-relaxed">
                  {t?.rules?.ruleBloodCost || "Les cartes coûtent du Sang pour être jouées."}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/60 border border-white/5 flex items-start space-x-2.5">
                <Clock className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <p className="font-sans leading-relaxed">
                  {t?.rules?.ruleBloodGrowth || "La capacité de Sang augmente à chaque manche (Manche 1 = 2 Sang, ..., Manche 7 = 8 Sang)."}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/50 flex items-start space-x-2.5 text-rose-200">
                <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <p className="font-sans leading-relaxed font-semibold">
                  {t?.rules?.ruleBloodLost || "Le Sang non utilisé est perdu (pas de report de réserve d'un tour sur l'autre)."}
                </p>
              </div>
            </div>
          </div>

          {/* Card 4: Système du Plateau & Soutien (Screenshot 4) */}
          <div className="glass-panel rounded-2xl p-5 border border-purple-500/40 space-y-4 shadow-lg bg-gradient-to-b from-[#140e1d] to-[#08050e]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-500/60 flex items-center justify-center shadow-lg text-purple-400 font-bold">
                  <Layers className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h3 className="font-gothic font-bold text-base text-purple-300">
                    {t?.rules?.ruleBoardTitle || "Système du Plateau"}
                  </h3>
                  <span className="text-[10px] font-mono text-gray-400">
                    {t?.rules?.ruleBoardBadge || "15 Cases"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-gray-200">
              <div className="grid grid-cols-4 gap-1.5 text-center font-gothic text-[11px]">
                <div className="p-2 rounded-lg bg-black/60 border border-white/5">
                  <div className="text-base mb-0.5">♟️</div>
                  <span className="text-gray-300 font-bold">Pion</span>
                </div>
                <div className="p-2 rounded-lg bg-black/60 border border-white/5">
                  <div className="text-base mb-0.5">♜</div>
                  <span className="text-gray-300 font-bold">Tour</span>
                </div>
                <div className="p-2 rounded-lg bg-black/60 border border-white/5">
                  <div className="text-base mb-0.5">♞</div>
                  <span className="text-amber-400 font-bold">Cavalier</span>
                </div>
                <div className="p-2 rounded-lg bg-black/60 border border-white/5">
                  <div className="text-base mb-0.5">👑</div>
                  <span className="text-amber-300 font-bold">Prince</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-start space-x-2 text-emerald-300">
                <ArrowUpCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="font-sans leading-relaxed font-semibold text-[11px]">
                  {t?.rules?.ruleBoardSupportRule || "Les cartes soutiennent l'espace directement devant elles (Pion → Tour → Cavalier / Prince)."}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 1. Board Topology & Support Chain Visual Breakdown */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/10 space-y-6 shadow-xl">
        <div className="flex items-center space-x-3 text-amber-400 font-gothic font-bold text-xl">
          <Crown className="w-6 h-6 text-amber-400" />
          <h2>1. Topologie du Plateau & Chaîne de Soutien (15 Cases)</h2>
        </div>

        <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">
          Le champ de bataille est composé d'une grille de 15 emplacements divisée en 3 lignes stratégiques :
        </p>

        {/* Board Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#0e131d] border border-blue-500/30 space-y-2">
            <div className="flex items-center justify-between text-blue-300 font-gothic font-bold text-sm">
              <span>Rangée Arrière : Pions (Pawns)</span>
              <span className="text-xs font-mono bg-blue-950/80 px-2 py-0.5 rounded border border-blue-500/40">3 Cases / Joueur</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Zone de déploiement de base sécurisée. Idéale pour les générateurs d'effets continus, moteurs de ressources et les soutiens en ligne droite.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#140e1d] border border-purple-500/30 space-y-2">
            <div className="flex items-center justify-between text-purple-300 font-gothic font-bold text-sm">
              <span>Rangée Médiane : Tours (Rooks)</span>
              <span className="text-xs font-mono bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/40">3 Cases / Joueur</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Ligne de transition et de relais tactique. Transmet le soutien reçu des Pions directement vers les Cavaliers ou le Trône du Prince.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#1d0e0e] border border-red-500/40 space-y-2">
            <div className="flex items-center justify-between text-red-300 font-gothic font-bold text-sm">
              <span>Ligne de Front Disputée</span>
              <span className="text-xs font-mono bg-red-950/80 px-2 py-0.5 rounded border border-red-500/40">2 Cavaliers + 1 Prince</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              La zone de conflit direct. Comprend les 2 cases Cavaliers sur les flancs et l'unique Trône du Prince de Londres au centre.
            </p>
          </div>
        </div>

        {/* Support Chain Callout */}
        <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-3 text-xs text-amber-200">
          <div className="flex items-center space-x-2 font-bold font-gothic text-sm text-amber-300">
            <ArrowUpCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <span>Règle de Déploiement en Chaîne & Soutien (Support Chain)</span>
          </div>
          <ul className="space-y-2 list-disc list-inside leading-relaxed text-gray-300">
            <li>
              <strong>Condition de Pose :</strong> Tant qu'il n'y a pas de lien établi en partant de votre base (Pion), vous ne pouvez pas poser de carte plus loin (une Tour nécessite un Pion derrière elle, et les Cavaliers nécessitent leur Tour respective).
            </li>
            <li>
              <strong>Convergence vers le Trône du Prince :</strong> Les Tours Gauche, Centrale et Droite fournissent toutes un lien direct vers la case centrale du Trône du Prince.
            </li>
            <li>
              <strong>Transmission de Puissance :</strong> Certaines cartes arrière fournissent des bonus cumulatifs de Puissance ou de Sang aux cartes situées directement devant elles.
            </li>
            <li>
              <strong>Exceptions & Contournements :</strong> Des cartes spécifiques comme Shifa (infiltrée) ou Brixton peuvent contourner les règles habituelles de chaîne de soutien.
            </li>
          </ul>
        </div>
      </div>

      {/* 2. Scoring and Victory */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/10 space-y-6 shadow-xl">
        <div className="flex items-center space-x-3 text-emerald-400 font-gothic font-bold text-xl">
          <Trophy className="w-6 h-6 text-emerald-400" />
          <h2>2. Décompte des Points & Victoire (7 Rounds)</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-300">
          <div className="p-5 rounded-2xl bg-[#09110d] border border-emerald-500/30 space-y-2">
            <h3 className="font-gothic font-bold text-base text-emerald-300 flex items-center space-x-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Contrôle d'un Cavalier (Knight)</span>
            </h3>
            <span className="text-[11px] font-mono font-bold text-emerald-400 block">+2 Points / Tour</span>
            <p className="leading-relaxed">
              Remporté par le joueur ayant la plus grande Puissance sur cette colonne de front. Chaque Cavalier contrôlé rapporte 2 points fixes.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#140e1d] border border-amber-500/30 space-y-2">
            <h3 className="font-gothic font-bold text-base text-amber-300 flex items-center space-x-2">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>Contrôle du Trône du Prince</span>
            </h3>
            <span className="text-[11px] font-mono font-bold text-amber-400 block">+1 Pt / Unité Alliée</span>
            <p className="leading-relaxed">
              Le joueur dominant le centre marque 1 point par unité alliée actuellement en jeu sur l'ensemble de ses 9 cases.
            </p>
          </div>
        </div>

        {/* Tiebreaker */}
        <div className="p-4 rounded-2xl bg-[#0a0d14] border border-white/10 text-xs text-gray-300 space-y-1">
          <span className="font-gothic font-bold text-gray-200 block">Règle des Égalités (Tiebreaker)</span>
          <p>Si deux joueurs ont la même puissance sur une case de front, aucun point n'est attribué pour cette case lors du round.</p>
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
          <h2>3. Glossaire Exhaustif des Mots-Clés & Indicateurs Littéraux</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
          {/* On Reveal */}
          <div className="p-4 rounded-xl bg-[#090b10] border border-white/10 space-y-1.5 hover:border-amber-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-amber-300 text-sm">
                À la Révélation (On Reveal)
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-950 text-[10px] font-mono text-amber-300 border border-amber-500/30">Trigger</span>
            </div>
            <p className="text-gray-300 leading-relaxed font-sans">
              S'active instantanément au moment où la carte est retournée face visible.
            </p>
          </div>

          {/* On Attack */}
          <div className="p-4 rounded-xl bg-[#090b10] border border-white/10 space-y-1.5 hover:border-red-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-red-300 text-sm">
                À l'Attaque / Pendant l'Attaque
              </span>
              <span className="px-2 py-0.5 rounded bg-red-950 text-[10px] font-mono text-red-300 border border-red-500/30">Combat</span>
            </div>
            <p className="text-gray-300 leading-relaxed font-sans">
              Confère un bonus ou déclenche un effet lorsque la carte dispute une case de front ou engage le combat.
            </p>
          </div>

          {/* While in Play / Ongoing */}
          <div className="p-4 rounded-xl bg-[#090b10] border border-white/10 space-y-1.5 hover:border-blue-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-blue-300 text-sm">
                Tant qu'en jeu / Continu (Ongoing)
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-950 text-[10px] font-mono text-blue-300 border border-blue-500/30">Passive</span>
            </div>
            <p className="text-gray-300 leading-relaxed font-sans">
              Effet persistant actif tant que la carte reste déployée sur le plateau.
            </p>
          </div>

          {/* Murder */}
          <div className="p-4 rounded-xl bg-[#090b10] border border-white/10 space-y-1.5 hover:border-purple-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-purple-300 text-sm">
                Assassiner / Éliminer (Murder)
              </span>
              <span className="px-2 py-0.5 rounded bg-purple-950 text-[10px] font-mono text-purple-300 border border-purple-500/30">Destruction</span>
            </div>
            <p className="text-gray-300 leading-relaxed font-sans">
              Détruit immédiatement une carte ennemie ciblée et l'envoie dans la défausse.
            </p>
          </div>

          {/* Seduce */}
          <div className="p-4 rounded-xl bg-[#090b10] border border-white/10 space-y-1.5 hover:border-pink-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-pink-300 text-sm">
                Séduire (Seduce)
              </span>
              <span className="px-2 py-0.5 rounded bg-pink-950 text-[10px] font-mono text-pink-300 border border-pink-500/30">Control</span>
            </div>
            <p className="text-gray-300 leading-relaxed font-sans">
              Prend temporairement ou définitivement le contrôle d'une carte adverse pour la placer dans vos rangs.
            </p>
          </div>

          {/* Stealth & Bypass */}
          <div className="p-4 rounded-xl bg-[#090b10] border border-white/10 space-y-1.5 hover:border-emerald-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-emerald-300 text-sm">
                Furtivité & Contournement
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-[10px] font-mono text-emerald-300 border border-emerald-500/30">Movement</span>
            </div>
            <p className="text-gray-300 leading-relaxed font-sans">
              Permet de se déployer sans soutien direct ou d'ignorer la défense adverse.
            </p>
          </div>
        </div>
      </div>

      {/* Dark Pack Agreement & World of Darkness Legal Notice */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 bg-[#07090e]/90 space-y-3 text-center shadow-xl">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 font-mono text-xs font-bold">
          <Shield className="w-3.5 h-3.5 text-red-400" />
          <span>{t?.brand?.darkPackBadge || "Accord Dark Pack"}</span>
        </div>
        <p className="max-w-3xl mx-auto leading-relaxed text-xs text-gray-400 font-sans">
          {t?.brand?.darkPackDisclaimer || "Certains éléments sont des marques déposées et protégées par le droit d'auteur de Paradox Interactive AB, et sont utilisés avec autorisation. Tous droits réservés. Vampire: The Masquerade® – Application communautaire non-officielle réalisée dans le cadre du Dark Pack Agreement. Pour plus d'informations, visitez worldofdarkness.com."}
        </p>
      </div>

      {/* CTA Button to Deckbuilder */}
      <div className="text-center pt-2">
        <button
          onClick={onGoToDeckBuilder}
          className="px-8 py-3.5 rounded-full bg-gradient-to-r from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 text-white font-gothic font-bold text-sm shadow-blood transition-all transform hover:scale-105 inline-flex items-center space-x-2"
        >
          <span>{isFrench ? "Construire un Deck Tactique" : "Build a Tactical Deck"}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
