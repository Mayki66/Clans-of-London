export const CLANS = {
  Brujah: {
    id: 'Brujah',
    name: 'Brujah',
    title: 'Les Rebelles & Zélotes',
    themeColor: '#f97316',
    bgColor: 'rgba(249, 115, 22, 0.15)',
    borderColor: '#ea580c',
    archetype: 'Violent',
    icon: 'Flame',
    description: 'Spécialistes du combat direct et de la puissance brute. Ils excellent à écraser l\'adversaire en duel.',
    playstyle: 'Agressif / Combats violents / Dominance des zones'
  },
  Ventrue: {
    id: 'Ventrue',
    name: 'Ventrue',
    title: 'Les Aristocrates & Rois de la Nuit',
    themeColor: '#93c5fd',
    bgColor: 'rgba(147, 197, 253, 0.15)',
    borderColor: '#60a5fa',
    archetype: 'Elitist',
    icon: 'Crown',
    description: 'Maîtres de l\'influence et de la politique. Ils siphonnent la puissance adverse et manipulent le score.',
    playstyle: 'Contrôle / Manipulation de puissance / Siphonnage'
  },
  Hecata: {
    id: 'Hecata',
    name: 'Hecata',
    title: 'Les Nécromanciens & Clan de la Mort',
    themeColor: '#3b82f6',
    bgColor: 'rgba(30, 58, 138, 0.25)',
    borderColor: '#1d4ed8',
    archetype: 'Murder',
    icon: 'Skull',
    description: 'Exploitent la mort et le sacrifice. Leurs cartes se renforcent ou réapparaissent lorsqu\'elles sont assassinées.',
    playstyle: 'Murder Engine / Sacrifice / Réanimation & Effets Post-Mortem'
  },
  Gangrel: {
    id: 'Gangrel',
    name: 'Gangrel',
    title: 'Les Sauvages & Métamorphes',
    themeColor: '#22c55e',
    bgColor: 'rgba(34, 197, 94, 0.15)',
    borderColor: '#22c55e',
    archetype: 'Beast',
    icon: 'PawPrint',
    description: 'Invoquent des meutes de familiers (loups, corbeaux, rats) pour décupler leur puissance en fin de partie.',
    playstyle: 'Swarm / Croissance continue / Puissance cumulative'
  },
  Tremere: {
    id: 'Tremere',
    name: 'Tremere',
    title: 'Les Sorciers de Sang',
    themeColor: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#ef4444',
    archetype: 'Blood Sorcery',
    icon: 'Sparkles',
    description: 'Utilisent la thaumaturgie pour canaliser le sang, lancer des rituels dévastateurs et voler les ressources.',
    playstyle: 'Combo / Rituels / Drain de Sang & Dégâts Magiques'
  },
  Malkavian: {
    id: 'Malkavian',
    name: 'Malkavian',
    title: 'Les Visionnaires Fous',
    themeColor: '#38bdf8',
    bgColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: '#38bdf8',
    archetype: 'Delusion',
    icon: 'Eye',
    description: 'Sèment le chaos dans l\'esprit ennemi. Manipulent la main adverse, forcent la défausse et créent des illusions.',
    playstyle: 'Disruption de main / Illusions / Chaos psychologique'
  },
  Nosferatu: {
    id: 'Nosferatu',
    name: 'Nosferatu',
    title: 'Les Maîtres des Ombres',
    themeColor: '#9ca3af',
    bgColor: 'rgba(156, 163, 175, 0.15)',
    borderColor: '#6b7280',
    archetype: 'Obfuscate',
    icon: 'Ghost',
    description: 'Invisibles et rusés, ils infiltrent les zones secrètement et affaiblissent l\'adversaire avant l\'affrontement.',
    playstyle: 'Furtivité / Infiltration / Affaiblissement'
  },
  Toreador: {
    id: 'Toreador',
    name: 'Toreador',
    title: 'Les Divas & Séducteurs',
    themeColor: '#ec4899',
    bgColor: 'rgba(236, 72, 153, 0.15)',
    borderColor: '#ec4899',
    archetype: 'Charm',
    icon: 'Heart',
    description: 'Charment les cartes ennemies pour neutraliser leurs effets ou les forcer à changer de camp.',
    playstyle: 'Contrôle de zone / Charme / Neutralisation'
  },
  Mortal: {
    id: 'Mortal',
    name: 'Mortel',
    title: 'Les Pions & Chasseurs de Londres',
    themeColor: '#94a3b8',
    bgColor: 'rgba(148, 163, 184, 0.15)',
    borderColor: '#94a3b8',
    archetype: 'Neutral',
    icon: 'Shield',
    description: 'Humains, goules fidèles, journalistes et agents de la Seconde Inquisition manipulant les ficelles diurnes.',
    playstyle: 'Génération de Sang / Support / Tactiques de diversion'
  },
  Duskborn: {
    id: 'Duskborn',
    name: 'Duskborn (Sang-Clair)',
    title: 'Les Alchimistes du Crépuscule',
    themeColor: '#e2e8f0',
    bgColor: 'rgba(226, 232, 240, 0.15)',
    borderColor: '#cbd5e1',
    archetype: 'Alchimie',
    icon: 'Moon',
    description: 'Vampires de basse génération capables de pratiquer l\'Alchimie du Sang-Clair en concoctant des Ingrédients (Bleach, Caffeine Powder, Blood Bag).',
    playstyle: 'Alchimie / Ingrédients / Coûts de Sang flexibles (X)'
  }
};

export const ARCHETYPES = [
  { id: 'Violent', name: 'Violent', clan: 'Brujah', color: '#f97316', desc: 'Bonus d\'attaque directe et supériorité martiale' },
  { id: 'Murder', name: 'Murder', clan: 'Hecata', color: '#3b82f6', desc: 'Effets déclenchés lors de l\'élimination ou du sacrifice' },
  { id: 'Beast', name: 'Beast', clan: 'Gangrel', color: '#22c55e', desc: 'Invocation de jetons et synergies de meute' },
  { id: 'Elitist', name: 'Elitist', clan: 'Ventrue', color: '#93c5fd', desc: 'Vol de puissance et domination du Prince de Londres' },
  { id: 'Blood Sorcery', name: 'Sorcellerie de Sang', clan: 'Tremere', color: '#ef4444', desc: 'Combos de rituels et canalisation de Sang' },
  { id: 'Delusion', name: 'Illusion & Folie', clan: 'Malkavian', color: '#38bdf8', desc: 'Défausse forcée et duplication d\'illusions' },
  { id: 'Obfuscate', name: 'Furtivité', clan: 'Nosferatu', color: '#9ca3af', desc: 'Cartes indétectables et surprises au tour 7' },
  { id: 'Charm', name: 'Charme & Présence', clan: 'Toreador', color: '#ec4899', desc: 'Séduction et blocage des capacités adverses' },
  { id: 'Alchimie', name: 'Alchimie (Ingrédients)', clan: 'Duskborn', color: '#cbd5e1', desc: 'Effets modulaires basés sur Bleach, Caffeine Powder et Blood Bag' },
  { id: 'Neutral', name: 'Neutre / Support', clan: 'Mortal', color: '#94a3b8', desc: 'Accélération de ressources et temporisation' }
];

export const INGREDIENTS = [
  { id: 'bleach', name: 'Bleach (Eau de Javel)', desc: 'Affaiblit ou détruit les défenses adverses' },
  { id: 'caffeine_powder', name: 'Caffeine Powder (Poudre de Caféine)', desc: 'Bonus d\'agilité et d\'accélération de puissance' },
  { id: 'blood_bag', name: 'Blood Bag (Poche de Sang)', desc: 'Restaure ou amplifie le Sang disponible' }
];

export const SERIES_LIST = [0, 1, 2, 3, 4, 5];
