import React from 'react';
import { BookOpen, Shield, Droplets, Trophy, Skull, Flame, Sparkles, Users, Crown, ChevronRight, Swords, HelpCircle, Layers, ArrowUpCircle } from 'lucide-react';
import { CLANS } from '../../data/clansData';

export default function RulesGuideView({ onGoToDeckBuilder }) {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Hero Header */}
      <div className="glass-panel-blood rounded-2xl p-6 md:p-8 border border-red-500/30 shadow-2xl space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-semibold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Règlement Officiel & Topologie Tactique</span>
        </div>
        <h1 className="font-gothic font-extrabold text-3xl md:text-4xl text-gray-100">
          Règles Officielles de <span className="text-red-500 font-normal">Clans of London</span>
        </h1>
        <p className="text-sm md:text-base text-gray-300 leading-relaxed">
          Guide des règles officielles du TCG <em>Vampire: The Masquerade – Clans of London</em>. Maîtrisez la topologie du plateau à 15 cases, la chaîne de soutien, le décompte exact des points et le vocabulaire littéral des cartes.
        </p>
      </div>

      {/* Board Topology & Support Chain Visual */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-6">
        <div className="flex items-center space-x-2 text-amber-400 font-gothic font-bold text-lg">
          <Crown className="w-5 h-5" />
          <h2>1. Topologie du Plateau & Chaîne de Soutien (15 Cases)</h2>
        </div>

        <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
          Le champ de bataille est composé d'une grille de <strong>15 emplacements</strong> divisée en 3 lignes stratégiques :
        </p>

        {/* Board Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#0e131d] border border-blue-500/30 space-y-2">
            <div className="flex items-center justify-between text-blue-300 font-gothic font-bold text-sm">
              <span>Rangée Arrière : Pions (Pawns)</span>
              <span className="text-xs font-mono">3 Cases / Joueur</span>
            </div>
            <p className="text-xs text-gray-400">
              Zone de déploiement de base sécurisée. Idéale pour les générateurs d'effets continus, moteurs de ressources et les soutiens en ligne droite.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#140e1d] border border-purple-500/30 space-y-2">
            <div className="flex items-center justify-between text-purple-300 font-gothic font-bold text-sm">
              <span>Rangée Médiane : Tours (Rooks)</span>
              <span className="text-xs font-mono">3 Cases / Joueur</span>
            </div>
            <p className="text-xs text-gray-400">
              Ligne de transition et de relais tactique. Transmet le soutien reçu des Pions directement vers les Cavaliers ou le Prince.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#1d0e0e] border border-red-500/40 space-y-2">
            <div className="flex items-center justify-between text-red-300 font-gothic font-bold text-sm">
              <span>Ligne de Front Disputée</span>
              <span className="text-xs font-mono">2 Cavaliers + 1 Prince</span>
            </div>
            <p className="text-xs text-gray-400">
              La zone de conflit direct. Comprend les <strong>2 cases Cavaliers</strong> sur les flancs et l'unique <strong>Trône du Prince de Londres</strong> au centre.
            </p>
          </div>
        </div>

        {/* Support Chain Callout */}
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 space-y-3 text-xs text-amber-200">
          <div className="flex items-center space-x-2 font-bold font-gothic text-sm text-amber-300">
            <ArrowUpCircle className="w-4 h-4 text-amber-400" />
            <span>Règle de Déploiement en Chaîne & Soutien (Support Chain)</span>
          </div>
          <ul className="space-y-1.5 list-disc list-inside leading-relaxed text-gray-300">
            <li>
              <strong>Condition de Pose :</strong> Tant qu'il n'y a pas de lien établi en partant de votre base (Pion), <strong>vous ne pouvez pas poser de carte plus loin</strong> (une Tour nécessite un Pion derrière elle, et les Cavaliers nécessitent leur Tour respective).
            </li>
            <li>
              <strong>Convergence vers le Trône du Prince :</strong> Les <strong>Tours Gauche, Centrale et Droite</strong> fournissent toutes un lien direct vers la case centrale du <strong>Trône du Prince</strong>.
            </li>
            <li>
              <strong>Transmission de Puissance :</strong> En conflit, chaque unité connectée transmet l'intégralité de sa Puissance vers l'avant (sauf mention <em>« Cannot give support »</em> comme <em>Horatio Drake</em> ou <em>Lord Colville</em>).
            </li>
            <li>
              <strong>Exceptions :</strong> Certaines cartes furtives comme <em>Shifa</em> (peut être jouée n'importe où) ou <em>Brixton</em> (jouable sur Cavalier sans aucun soutien requis) ignorent ces contraintes de pose.
            </li>
          </ul>
        </div>
      </div>

      {/* Scoring and Victory */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
        <div className="flex items-center space-x-2 text-emerald-400 font-gothic font-bold text-lg">
          <Trophy className="w-5 h-5" />
          <h2>2. Décompte des Points & Victoire (7 Rounds)</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-300">
          <div className="p-4 rounded-xl bg-[#09110d] border border-emerald-500/30 space-y-2">
            <h3 className="font-gothic font-bold text-sm text-emerald-300 flex items-center space-x-1.5">
              <span>Contrôle d'un Cavalier (Knight)</span>
            </h3>
            <p>
              Chaque case Cavalier contrôlée à la fin d'un round rapporte exactement <strong>2 points de victoire</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#110909] border border-red-500/30 space-y-2">
            <h3 className="font-gothic font-bold text-sm text-red-300 flex items-center space-x-1.5">
              <span>Contrôle du Prince de Londres</span>
            </h3>
            <p>
              Contrôler le Trône du Prince à la fin d'un round rapporte <strong>1 point par unité alliée présente sur l'ensemble du plateau</strong> (multiplicateur de présence de horde/armée).
            </p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-gray-400 font-mono">
          ⏱️ <strong>Économie de Sang</strong> : Tour 1 = 2 Sang • Tour 2 = 3 Sang • Tour 3 = 4 Sang • Tour 4 = 5 Sang • Tour 5 = 6 Sang • Tour 6 = 7 Sang • Tour 7 = 8 Sang.
        </div>
      </div>

      {/* Vocabulary and Effects Dictionary */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
        <div className="flex items-center space-x-2 text-purple-400 font-gothic font-bold text-lg">
          <Sparkles className="w-5 h-5" />
          <h2>3. Définition Littérale des Effets & Vocabulaire</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-[#0b0e15] border border-white/5 space-y-1">
            <span className="font-mono font-bold text-amber-300">À la Révélation (On Reveal) :</span>
            <p className="text-gray-400">Déclenché immédiatement au moment où la carte est jouée et révélée sur le plateau.</p>
          </div>

          <div className="p-3 rounded-lg bg-[#0b0e15] border border-white/5 space-y-1">
            <span className="font-mono font-bold text-red-300">À l'Attaque / Pendant l'Attaque :</span>
            <p className="text-gray-400">Déclenché uniquement pendant une phase d'assaut initiée activement par cette carte.</p>
          </div>

          <div className="p-3 rounded-lg bg-[#0b0e15] border border-white/5 space-y-1">
            <span className="font-mono font-bold text-blue-300">Tant qu'en jeu (While in Play) :</span>
            <p className="text-gray-400">Effet passif permanent continu tant que la carte demeure sur le terrain.</p>
          </div>

          <div className="p-3 rounded-lg bg-[#0b0e15] border border-white/5 space-y-1">
            <span className="font-mono font-bold text-rose-400">Assassiner (Murder) :</span>
            <p className="text-gray-400">Destruction absolue qui retire la carte définitivement de la partie (empêche toute réanimation ou récupération depuis le cimetière).</p>
          </div>

          <div className="p-3 rounded-lg bg-[#0b0e15] border border-white/5 space-y-1">
            <span className="font-mono font-bold text-pink-300">Séduire (Seduce) :</span>
            <p className="text-gray-400">Vole une carte ennemie (en jeu ou vaincue selon le texte) pour l'ajouter directement dans votre main.</p>
          </div>

          <div className="p-3 rounded-lg bg-[#0b0e15] border border-white/5 space-y-1">
            <span className="font-mono font-bold text-emerald-300">Cartes sans texte (N/A) :</span>
            <p className="text-gray-400">Cartes à statistiques pures sans capacité spéciale (ex: Hope Ekaette 6/12, Mrs Fitzgerald 8/14).</p>
          </div>
        </div>
      </div>

      {/* Guide des 8 Clans */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
        <h2 className="font-gothic font-bold text-xl text-gray-100 flex items-center space-x-2">
          <Users className="w-5 h-5 text-amber-400" />
          <span>Panorama des 8 Clans et de leurs Archétypes</span>
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
                  Archétype : {clan.archetype}
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
          <Swords className="w-4 h-4" />
          <span>Construire un Deck Compétitif (15 Cartes)</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
