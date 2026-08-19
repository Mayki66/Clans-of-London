export const CLANS = {
  Brujah: {
    id: 'Brujah',
    name: 'Brujah',
    title: 'Les Rebelles & Zélotes',
    themeColor: '#e63946',
    bgColor: 'rgba(230, 57, 70, 0.15)',
    borderColor: '#e63946',
    archetype: 'Violent',
    icon: 'Flame',
    description: 'Spécialistes du combat direct et de la puissance brute. Ils excellent à écraser l\'adversaire en duel.',
    playstyle: 'Agressif / Combats violents / Dominance des zones'
  },
  Ventrue: {
    id: 'Ventrue',
    name: 'Ventrue',
    title: 'Les Aristocrates & Rois de la Nuit',
    themeColor: '#d4af37',
    bgColor: 'rgba(212, 175, 55, 0.15)',
    borderColor: '#d4af37',
    archetype: 'Elitist',
    icon: 'Crown',
    description: 'Maîtres de l\'influence et de la politique. Ils siphonnent la puissance adverse et manipulent le score.',
    playstyle: 'Contrôle / Manipulation de puissance / Siphonnage'
  },
  Hecata: {
    id: 'Hecata',
    name: 'Hecata',
    title: 'Les Nécromanciens & Clan de la Mort',
    themeColor: '#a855f7',
    bgColor: 'rgba(168, 85, 247, 0.15)',
    borderColor: '#a855f7',
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
    themeColor: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#10b981',
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
    name: 'Mortels & Inquisition',
    title: 'Les Pions & Chasseurs de Londres',
    themeColor: '#94a3b8',
    bgColor: 'rgba(148, 163, 184, 0.15)',
    borderColor: '#94a3b8',
    archetype: 'Neutral',
    icon: 'Shield',
    description: 'Humains, goules fidèles, journalistes et agents de la Seconde Inquisition manipulant les ficelles diurnes.',
    playstyle: 'Génération de Sang / Support / Tactiques de diversion'
  }
};

export const ARCHETYPES = [
  { id: 'Violent', name: 'Violent', clan: 'Brujah', color: '#e63946', desc: 'Bonus d\'attaque directe et supériorité martiale' },
  { id: 'Murder', name: 'Murder', clan: 'Hecata', color: '#a855f7', desc: 'Effets déclenchés lors de l\'élimination ou du sacrifice' },
  { id: 'Beast', name: 'Beast', clan: 'Gangrel', color: '#22c55e', desc: 'Invocation de jetons et synergies de meute' },
  { id: 'Elitist', name: 'Elitist', clan: 'Ventrue', color: '#d4af37', desc: 'Vol de puissance et domination du Prince de Londres' },
  { id: 'Blood Sorcery', name: 'Sorcellerie de Sang', clan: 'Tremere', color: '#ef4444', desc: 'Combos de rituels et canalisation de Sang' },
  { id: 'Delusion', name: 'Illusion & Folie', clan: 'Malkavian', color: '#38bdf8', desc: 'Défausse forcée et duplication d\'illusions' },
  { id: 'Obfuscate', name: 'Furtivité', clan: 'Nosferatu', color: '#10b981', desc: 'Cartes indétectables et surprises au tour 7' },
  { id: 'Charm', name: 'Charme & Présence', clan: 'Toreador', color: '#ec4899', desc: 'Séduction et blocage des capacités adverses' },
  { id: 'Neutral', name: 'Neutre / Support', clan: 'Mortal', color: '#94a3b8', desc: 'Accélération de ressources et temporisation' }
];

export const SERIES_LIST = [0, 1, 2, 3, 4, 5];
