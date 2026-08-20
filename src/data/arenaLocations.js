/**
 * Official and thematic Arena Locations in Clans of London
 * Each location features unique atmospheric lore and game-wide modifiers.
 */
export const ARENA_LOCATIONS = [
  {
    id: 'st-pauls-cathedral',
    name: "St Paul's Cathedral",
    subtitle: "Sanctuaire Sacrilège & Dôme Nocturne",
    modifierName: "RÉSILIENCE IMPIE",
    modifierDescription: "À la fin de chaque manche, reprenez une carte de votre défausse dans votre main.",
    themeColor: "#e63946",
    bannerIcon: "cathedral",
    imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80",
    description: "Le grand dôme de St Paul domine la City. Sous les voûtes sacrées, le sang des vampires défie la mort en ressuscitant les pièces perdues de chaque joueur."
  },
  {
    id: 'tower-of-london',
    name: "Tower of London",
    subtitle: "Forteresse Royale & Donjon des Corbeaux",
    modifierName: "LOI MARTIALE",
    modifierDescription: "Les Cavaliers (Knights) rapportent +1 Point supplémentaire (3 points au lieu de 2) à chaque manche.",
    themeColor: "#d4af37",
    bannerIcon: "tower",
    imageUrl: "https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?auto=format&fit=crop&w=800&q=80",
    description: "L'ancienne geôle de la monarchie anglaise. Les flancs fortifiés octroient des points de domination accrus aux combattants téméraires."
  },
  {
    id: 'camden-catacombs',
    name: "Camden Catacombs",
    subtitle: "Égouts & Territoire Nosferatu",
    modifierName: "EMBUSCADE FURTIVE",
    modifierDescription: "Toutes les cartes à 1 ou 2 Sang gagnent +1 Puissance lorsqu'elles sont déployées sur une case Pion ou Tour.",
    themeColor: "#8338ec",
    bannerIcon: "skulls",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    description: "Les labyrinthes souterrains de Camden permettent aux petits serviteurs et assassins de frapper avec une férocité décuplée."
  }
];
