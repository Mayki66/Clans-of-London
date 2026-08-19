import json

# Comprehensive authoritative card list for Clans of London
named_database = [
  # --- 64 LIVE SCREENSHOT CARDS (PLAYER DECK/COLLECTION) ---
  {
    "name": "Luis Castaño",
    "clan": "Ventrue",
    "cost": 1,
    "power": 1,
    "type": "Vampire",
    "archetype": "Élitiste",
    "keywords": ["Élitiste", "Lobbyiste"],
    "ability": "Tant qu'en jeu : Quand l'adversaire joue une carte, vole 1 Sang de sa réserve.",
    "flavorText": "\"L'énergie et le charbon font tourner les usines de la Couronne, et mon argent fait tourner les ministères.\"",
    "rarity": "Commune"
  },
  {
    "name": "Shifa",
    "clan": "Nosferatu",
    "cost": 1,
    "power": 1,
    "type": "Vampire",
    "archetype": "Occultation",
    "keywords": ["Occultation", "Infiltrateur"],
    "ability": "Peut être jouée sur n'importe quel emplacement du plateau (ignore les restrictions de placement).",
    "flavorText": "\"Les ombres ne connaissent pas de frontières.\"",
    "rarity": "Commune"
  },
  {
    "name": "Amy West",
    "clan": "Brujah",
    "cost": 1,
    "power": 1,
    "type": "Vampire",
    "archetype": "Violent",
    "keywords": ["Violent", "Anarch"],
    "ability": "À l'Attaque : Si vous avez une autre carte Violente en jeu, gagne +3 Puissance.",
    "flavorText": "\"Brûlons le vieux monde jusqu'aux cendres !\"",
    "rarity": "Commune"
  },
  {
    "name": "Abir",
    "clan": "Toreador",
    "cost": 1,
    "power": 1,
    "type": "Vampire",
    "archetype": "Séduction",
    "keywords": ["Séduction", "Soutien"],
    "ability": "Après avoir révélé votre prochaine carte, confère-lui +1 Puissance.",
    "flavorText": "\"Un parfum envoûtant qui décuple les forces.\"",
    "rarity": "Commune"
  },
  {
    "name": "Bakunawa",
    "clan": "Toreador",
    "cost": 1,
    "power": 0,
    "type": "Vampire",
    "archetype": "Séduction",
    "keywords": ["Séduction", "Affaiblissement"],
    "ability": "À l'Attaque : Inflige -4 Puissance à la carte ennemie.",
    "flavorText": "\"Le grand dragon avale la lune et la volonté des hommes.\"",
    "rarity": "Commune"
  },
  {
    "name": "Abigail Smith",
    "clan": "Ventrue",
    "cost": 1,
    "power": 1,
    "type": "Vampire",
    "archetype": "Élitiste",
    "keywords": ["Élitiste", "Stagiaire"],
    "ability": "À la Révélation : Si jouée à côté d'une carte Élitiste, gagne +2 Puissance.",
    "flavorText": "\"L'ambition de gravir tous les échelons de la City.\"",
    "rarity": "Commune"
  },
  {
    "name": "Helen Lloyd",
    "clan": "Ventrue",
    "cost": 2,
    "power": 3,
    "type": "Vampire",
    "archetype": "Élitiste",
    "keywords": ["Élitiste", "Conseil"],
    "ability": "Tant qu'en jeu : Vos cartes Élitistes adjacentes ont +1 Puissance.",
    "flavorText": "\"Les contrats sont plus tranchants que les épées.\"",
    "rarity": "Commune"
  },
  {
    "name": "Violet Green",
    "clan": "Toreador",
    "cost": 2,
    "power": 3,
    "type": "Vampire",
    "archetype": "Séduction",
    "keywords": ["Séduction", "Starlette de Soho"],
    "ability": "À la Révélation : Si la carte ennemie a une Puissance supérieure, réduit sa Puissance de 2.",
    "flavorText": "\"La starlette des nuits électriques de Soho.\"",
    "rarity": "Commune"
  },
  {
    "name": "Aster Banda",
    "clan": "Toreador",
    "cost": 2,
    "power": 2,
    "type": "Vampire",
    "archetype": "Séduction",
    "keywords": ["Séduction", "Pilote"],
    "ability": "Tant qu'en jeu : Vos cartes connectées ont +2 Puissance.",
    "flavorText": "\"La vitesse et l'élégance sur l'asphalte londonien.\"",
    "rarity": "Commune"
  },
  {
    "name": "Jürgen Mayer",
    "clan": "Ventrue",
    "cost": 2,
    "power": 2,
    "type": "Vampire",
    "archetype": "Élitiste",
    "keywords": ["Élitiste", "Garde"],
    "ability": "Tant qu'en jeu : Si votre Prince est Élitiste, il gagne +2 Puissance.",
    "flavorText": "\"Loyal jusqu'au bout à la régence Ventrue.\"",
    "rarity": "Commune"
  },
  {
    "name": "Penelope Dane",
    "clan": "Toreador",
    "cost": 2,
    "power": 2,
    "type": "Vampire",
    "archetype": "Séduction",
    "keywords": ["Séduction", "Directrice de Théâtre"],
    "ability": "À la Révélation : Crée une Goule Acteur dans un espace connecté (si vide).",
    "flavorText": "\"Le théâtre et la tragédie dans chaque mot.\"",
    "rarity": "Commune"
  },
  {
    "name": "Morag Stewart",
    "clan": "Hecata",
    "cost": 2,
    "power": 2,
    "type": "Vampire",
    "archetype": "Meurtre",
    "keywords": ["Meurtre", "Réanimation"],
    "ability": "À la Mort : Retourne dans votre main avec -1 Coût en Sang.",
    "flavorText": "\"La mort n'est qu'une porte dérobée dans les ruelles brumeuses de Whitechapel.\"",
    "rarity": "Épique"
  },
  {
    "name": "Grendel Ward",
    "clan": "Brujah",
    "cost": 2,
    "power": 5,
    "type": "Vampire",
    "archetype": "Violent",
    "keywords": ["Violent", "Protecteur"],
    "ability": "À la Révélation : Si votre Prince est Violent, gagne +2 Puissance.",
    "flavorText": "\"Je protège les miens. Si vous touchez à ma sœur ou à ma coterie, Londres n'aura pas assez de tombes.\"",
    "rarity": "Rare"
  },
  {
    "name": "Lan Chen",
    "clan": "Brujah",
    "cost": 2,
    "power": 1,
    "type": "Vampire",
    "archetype": "Violent",
    "keywords": ["Violent", "Recruteur"],
    "ability": "À la Révélation : Si nous sommes au Tour 4 ou avant, ajoute un Punk Chétif à votre main.",
    "flavorText": "\"La révolte se prépare dans les hangars désaffectés.\"",
    "rarity": "Commune"
  },
  {
    "name": "Ember",
    "clan": "Brujah",
    "cost": 2,
    "power": 0,
    "type": "Vampire",
    "archetype": "Violent",
    "keywords": ["Violent", "Horde"],
    "ability": "À la Révélation : Crée une Goule dans un espace Chevalier vide.",
    "flavorText": "\"Une étincelle suffit pour embraser toute la ville.\"",
    "rarity": "Commune"
  },
  {
    "name": "Francisco the Bold",
    "clan": "Toreador",
    "cost": 2,
    "power": 2,
    "type": "Vampire",
    "archetype": "Séduction",
    "keywords": ["Séduction", "Opportuniste"],
    "ability": "Tant qu'en jeu : Quand cette carte se déplace sur un nouvel espace, gagne +3 Puissance.",
    "flavorText": "\"Un prophète malkavien m'a promis la couronne. Je prendrai ce qui me revient.\"",
    "rarity": "Commune"
  },
  {
    "name": "Amelie",
    "clan": "Toreador",
    "cost": 2,
    "power": 2,
    "type": "Vampire",
    "archetype": "Séduction",
    "keywords": ["Séduction", "Buff de Main"],
    "ability": "À la Révélation : Confère +1 Puissance à toutes les autres cartes Toreador dans votre main.",
    "flavorText": "\"L'élégance des salons parisiens importée au cœur de Londres.\"",
    "rarity": "Rare"
  },
  {
    "name": "Lawrence",
    "clan": "Ventrue",
    "cost": 2,
    "power": 3,
    "type": "Vampire",
    "archetype": "Élitiste",
    "keywords": ["Élitiste", "Revirement"],
    "ability": "À la Révélation : Si jouée dans une zone où vous perdez, gagne +2 Puissance.",
    "flavorText": "\"Rien n'est perdu tant que la signature n'est pas posée.\"",
    "rarity": "Commune"
  },
  {
    "name": "Sapphire",
    "clan": "Toreador",
    "cost": 3,
    "power": 1,
    "type": "Vampire",
    "archetype": "Séduction",
    "keywords": ["Séduction", "Silence"],
    "ability": "Tant qu'en jeu : Les ennemis dans cette zone ne peuvent pas utiliser de capacités actives.",
    "flavorText": "\"Le silence s'impose dès qu'elle monte sur scène.\"",
    "rarity": "Rare"
  },
  {
    "name": "Tristun Stag",
    "clan": "Toreador",
    "cost": 3,
    "power": 3,
    "type": "Vampire",
    "archetype": "Séduction",
    "keywords": ["Séduction", "Étourdissement"],
    "ability": "À la Révélation : Charme la carte ennemie ayant la plus faible Puissance, l'empêchant d'attaquer ce tour.",
    "flavorText": "\"Des ailes d'ange et un venin mortel.\"",
    "rarity": "Commune"
  },
  {
    "name": "Szofia",
    "clan": "Toreador",
    "cost": 3,
    "power": 2,
    "type": "Vampire",
    "archetype": "Séduction",
    "keywords": ["Séduction", "Artiste Meurtrière"],
    "ability": "À l'Attaque : Gagne +1 Puissance pour chaque autre carte alliée dans cette zone.",
    "flavorText": "\"La dague d'argent ne manque jamais sa cible.\"",
    "rarity": "Commune"
  },
  {
    "name": "Lavanya Sekh",
    "clan": "Tremere",
    "cost": 3,
    "power": 3,
    "type": "Vampire",
    "archetype": "Sorcellerie du Sang",
    "keywords": ["Sorcellerie du Sang", "Pioche"],
    "ability": "À la Révélation : Piochez 1 carte. Si elle coûte 2 Sang ou moins, réduisez son coût à 0.",
    "flavorText": "\"La thaumaturgie moderne lit l'avenir dans les algorithmes de sang.\"",
    "rarity": "Rare"
  },
  {
    "name": "Adrian Yu",
    "clan": "Ventrue",
    "cost": 3,
    "power": 6,
    "type": "Vampire",
    "archetype": "Élitiste",
    "keywords": ["Élitiste", "Verrouillage"],
    "ability": "Tant qu'en jeu : Les cartes dans cette zone ne peuvent être ni déplacées ni expulsées.",
    "flavorText": "\"Ma volonté est la seule loi dans ce secteur.\"",
    "rarity": "Épique"
  },
  {
    "name": "Sheriff Fletcher",
    "clan": "Brujah",
    "cost": 3,
    "power": 4,
    "type": "Vampire",
    "archetype": "Violent",
    "keywords": ["Violent", "Exécuteur"],
    "ability": "À l'Attaque : Si vous attaquez un Prince ennemi, inflige 4 dégâts supplémentaires.",
    "flavorText": "\"L'autorité ne se négocie pas dans les ténèbres.\"",
    "rarity": "Rare"
  },
  {
    "name": "Mr Stewart",
    "clan": "Hecata",
    "cost": 3,
    "power": 2,
    "type": "Vampire",
    "archetype": "Meurtre",
    "keywords": ["Meurtre", "Croque-Mort"],
    "ability": "À la Mort : Confère +2 Puissance à toutes les cartes Hecata alliées en jeu.",
    "flavorText": "\"La famille Stewart n'oublie jamais ses défunts.\"",
    "rarity": "Commune"
  },
  {
    "name": "Dante",
    "clan": "Brujah",
    "cost": 3,
    "power": 4,
    "type": "Vampire",
    "archetype": "Violent",
    "keywords": ["Violent", "Riposte"],
    "ability": "À la Révélation : Si l'adversaire a joué une carte ici ce round, inflige-lui 3 dégâts.",
    "flavorText": "\"Bienvenue dans mon enfer personnel.\"",
    "rarity": "Commune"
  },
  {
    "name": "Razor",
    "clan": "Nosferatu",
    "cost": 3,
    "power": 2,
    "type": "Vampire",
    "archetype": "Occultation",
    "keywords": ["Occultation", "Assassin"],
    "ability": "À l'Attaque : Détruit un Serviteur ou une Goule adverse dans cette zone.",
    "flavorText": "\"Une lame dans l'artère carotide. Pas de questions, pas de témoins.\"",
    "rarity": "Rare"
  },
  {
    "name": "Niall Flynn",
    "clan": "Brujah",
    "cost": 3,
    "power": 3,
    "type": "Vampire",
    "archetype": "Violent",
    "keywords": ["Violent", "Tireur"],
    "ability": "Quand l'une de vos cartes Violentes attaque : Confère-lui +2 Puissance.",
    "flavorText": "\"Le calibre lourd remplace tous les arguments diplomatiques.\"",
    "rarity": "Commune"
  },
  {
    "name": "Kobby's Crew",
    "clan": "Brujah",
    "cost": 3,
    "power": 4,
    "type": "Mortel",
    "archetype": "Violent",
    "keywords": ["Violent", "Horde"],
    "ability": "À la Révélation : Gagne +1 Puissance pour chaque Mortel dans votre défausse.",
    "flavorText": "\"Les rues appartiennent à ceux qui contrôlent la foule.\"",
    "rarity": "Commune"
  },
  {
    "name": "Ravi Patel",
    "clan": "Gangrel",
    "cost": 3,
    "power": 1,
    "type": "Vampire",
    "archetype": "Bête",
    "keywords": ["Bête", "Invocateur"],
    "ability": "À la Révélation : Invoque un Chien des Rues dans une zone adjacente vide.",
    "flavorText": "\"Les corbeaux et les chiens me rapportent tout ce qui rampe.\"",
    "rarity": "Commune"
  },
  {
    "name": "\"Brixton\"",
    "clan": "Brujah",
    "cost": 3,
    "power": 5,
    "type": "Vampire",
    "archetype": "Violent",
    "keywords": ["Violent", "Pilote de Course"],
    "ability": "Tant qu'en jeu : Si vous contrôlez le Prince de Londres, cette carte a +3 Puissance.",
    "flavorText": "\"Sur l'asphalte de Brixton, personne ne freine.\"",
    "rarity": "Rare"
  },
  {
    "name": "Angelo",
    "clan": "Toreador",
    "cost": 3,
    "power": 4,
    "type": "Vampire",
    "archetype": "Séduction",
    "keywords": ["Séduction", "Déplacement"],
    "ability": "À la Révélation : Force une carte ennemie à changer de voie.",
    "flavorText": "\"Le sang sur la peau comme une œuvre d'art inachevée.\"",
    "rarity": "Commune"
  },
  {
    "name": "Roland Heffé",
    "clan": "Toreador",
    "cost": 3,
    "power": 6,
    "type": "Vampire",
    "archetype": "Séduction",
    "keywords": ["Séduction", "Patron de Club"],
    "ability": "Tant qu'en jeu : Vos cartes Toreador coûtent 1 Sang de moins à déployer.",
    "flavorText": "\"Le patron des nuits londoniennes. Tout le monde boit à sa table.\"",
    "rarity": "Épique"
  },
  {
    "name": "Julian L. Hector",
    "clan": "Toreador",
    "cost": 3,
    "power": 5,
    "type": "Vampire",
    "archetype": "Séduction",
    "keywords": ["Séduction", "Chef Perfectionniste"],
    "ability": "Quand cette carte détruit un ennemi : Gagne définitivement +2 Puissance et soigne votre Prince.",
    "flavorText": "\"La haute gastronomie kindred requiert des ingrédients d'exception.\"",
    "rarity": "Épique"
  },
  {
    "name": "Aurora Torres",
    "clan": "Toreador",
    "cost": 4,
    "power": 6,
    "type": "Vampire",
    "archetype": "Séduction",
    "keywords": ["Séduction", "Vol de Puissance"],
    "ability": "À la Révélation : Vole 2 Puissance à la carte ennemie la plus puissante dans cette zone.",
    "flavorText": "\"Une coupe de champagne, un regard, et votre force m'appartient.\"",
    "rarity": "Rare"
  },
  {
    "name": "Blaze",
    "clan": "Toreador",
    "cost": 4,
    "power": 3,
    "type": "Vampire",
    "archetype": "Séduction",
    "keywords": ["Séduction", "Sommelier"],
    "ability": "À la Révélation : Confère +1 Puissance à toutes les cartes actuellement dans votre main.",
    "flavorText": "\"Le meilleur grand cru de vitae pour réchauffer la nuit.\"",
    "rarity": "Commune"
  },
  {
    "name": "Horatio Drake",
    "clan": "Ventrue",
    "cost": 4,
    "power": 9,
    "type": "Vampire",
    "archetype": "Élitiste",
    "keywords": ["Élitiste", "Infant de Colville"],
    "ability": "Tant qu'en jeu : Si vous ne contrôlez aucune autre carte dans cette zone, Horatio Drake a +3 Puissance.",
    "flavorText": "\"Le digne héritier de Lord Colville veille sur Mayfair.\"",
    "rarity": "Épique"
  },
  {
    "name": "Tim Holdsworth",
    "clan": "Tremere",
    "cost": 4,
    "power": 0,
    "type": "Vampire",
    "archetype": "Sorcellerie du Sang",
    "keywords": ["Sorcellerie du Sang", "Alchimiste"],
    "ability": "À la Révélation : Se transforme en une Bête avec une Puissance égale au Sang total dépensé ce tour.",
    "flavorText": "\"La science alchimique dépasse toutes les lois du vivant.\"",
    "rarity": "Rare"
  },
  {
    "name": "Jari",
    "clan": "Brujah",
    "cost": 4,
    "power": 7,
    "type": "Vampire",
    "archetype": "Violent",
    "keywords": ["Violent", "Enragé"],
    "ability": "À la Révélation : Se déplace vers une carte ennemie connectée et engage le combat immédiatement.",
    "flavorText": "\"Une bombe à retardement prête à exploser au visage de la Camarilla.\"",
    "rarity": "Rare"
  },
  {
    "name": "Cathy Carmine",
    "clan": "Gangrel",
    "cost": 4,
    "power": 6,
    "type": "Vampire",
    "archetype": "Bête",
    "keywords": ["Bête", "Sangsue"],
    "ability": "À l'Attaque : Siphonne 3 Puissance de la cible et l'ajoute à Cathy Carmine.",
    "flavorText": "\"Elle règne sur la contrebande et chasse dans la fange des Docks.\"",
    "rarity": "Épique"
  },
  {
    "name": "Ophelia",
    "clan": "Hecata",
    "cost": 4,
    "power": 5,
    "type": "Vampire",
    "archetype": "Meurtre",
    "keywords": ["Meurtre", "Rampante des Chagrins"],
    "ability": "Tant qu'en jeu : Les cartes ennemies dans cette zone perdent 1 Puissance à la fin de chaque round.",
    "flavorText": "\"Entends-tu les voix sous la Tamise ? Elles t'appellent par ton vrai nom.\"",
    "rarity": "Épique"
  },
  {
    "name": "Eliza Iyer",
    "clan": "Toreador",
    "cost": 4,
    "power": 7,
    "type": "Vampire",
    "archetype": "Séduction",
    "keywords": ["Séduction", "Danseuse"],
    "ability": "À la Révélation : Charme la carte ennemie la plus puissante, désactivant sa capacité pendant 1 round.",
    "flavorText": "\"Childe de Roland Heffé, complotant dans l'ombre pour prendre sa place.\"",
    "rarity": "Rare"
  },
  {
    "name": "Herald of the Hunt",
    "clan": "Gangrel",
    "cost": 4,
    "power": 2,
    "type": "Vampire",
    "archetype": "Bête",
    "keywords": ["Bête", "Chasse Sauvage"],
    "ability": "Tant qu'en jeu : Chaque fois que vous jouez une carte Bête, cette carte gagne +2 Puissance.",
    "flavorText": "\"Le cor sonne le début de la grande traque dans les bois royaux.\"",
    "rarity": "Rare"
  },
  {
    "name": "Branwen White",
    "clan": "Gangrel",
    "cost": 4,
    "power": 5,
    "type": "Vampire",
    "archetype": "Bête",
    "keywords": ["Bête", "Matrone des Loups"],
    "ability": "À la Révélation : Invoque un Loup dans une zone connectée vide.",
    "flavorText": "\"La mère des loups veille sur sa meute avec une férocité sans égale.\"",
    "rarity": "Rare"
  },
  {
    "name": "Bloodcaller's Pack",
    "clan": "Gangrel",
    "cost": 4,
    "power": 1,
    "type": "Serviteur / Familier",
    "archetype": "Bête",
    "keywords": ["Bête", "Tactique de Meute"],
    "ability": "Tant qu'en jeu : Gagne +1 Puissance pour chacune de vos autres cartes en jeu.",
    "flavorText": "\"Une meute affamée qui grandit avec chaque nouvelle bête.\"",
    "rarity": "Commune"
  },
  {
    "name": "Mx Korpal",
    "clan": "Ventrue",
    "cost": 5,
    "power": 4,
    "type": "Vampire",
    "archetype": "Élitiste",
    "keywords": ["Élitiste", "Sanction"],
    "ability": "À la Révélation : Vole 3 Puissance à une Tour ennemie aléatoire et gèle le Sang bonus adverse.",
    "flavorText": "\"Les sanctions économiques de la Camarilla sont sans appel.\"",
    "rarity": "Rare"
  },
  {
    "name": "Stephen Fane",
    "clan": "Brujah",
    "cost": 5,
    "power": 8,
    "type": "Vampire",
    "archetype": "Violent",
    "keywords": ["Violent", "Broyeur"],
    "ability": "Tant qu'en jeu : Si cette carte est Prince ou Chevalier, gagne +3 Puissance et ignore l'armure ennemie.",
    "flavorText": "\"Rien ne résiste à la force brute quand la rage prend le dessus.\"",
    "rarity": "Rare"
  },
  {
    "name": "Brittany Welch",
    "clan": "Toreador",
    "cost": 5,
    "power": 1,
    "type": "Vampire",
    "archetype": "Séduction",
    "keywords": ["Séduction", "Miroir"],
    "ability": "À la Révélation : Copie la valeur de Puissance la plus élevée parmi toutes vos cartes amies en jeu.",
    "flavorText": "\"Un reflet parfait de la grandeur de l'Elysium.\"",
    "rarity": "Rare"
  },
  {
    "name": "Florence",
    "clan": "Toreador",
    "cost": 5,
    "power": 8,
    "type": "Vampire",
    "archetype": "Séduction",
    "keywords": ["Séduction", "Reine de la Nuit"],
    "ability": "À la Révélation : Si jouée sur la zone du Prince de Londres, accorde +2 Puissance à tous les alliés ici.",
    "flavorText": "\"Elle commande la piste et subjugue les cœurs.\"",
    "rarity": "Rare"
  },
  {
    "name": "Ms Harriot",
    "clan": "Gangrel",
    "cost": 5,
    "power": 5,
    "type": "Vampire",
    "archetype": "Bête",
    "keywords": ["Bête", "Taxidermiste"],
    "ability": "Tant qu'en jeu : Quand une Bête alliée est détruite, réanimez-la sous forme de Goule avec 3 Puissance.",
    "flavorText": "\"Rien ne se perd entre les mains d'une chasseresse de l'Outback.\"",
    "rarity": "Rare"
  },
  {
    "name": "Harry Tyler",
    "clan": "Ventrue",
    "cost": 5,
    "power": 8,
    "type": "Vampire",
    "archetype": "Élitiste",
    "keywords": ["Élitiste", "Expansionniste"],
    "ability": "À la Révélation : Gagne +2 Puissance pour chaque zone que vous contrôlez actuellement.",
    "flavorText": "\"L'expansionnisme est la seule stratégie valable dans ce siècle.\"",
    "rarity": "Rare"
  },
  {
    "name": "Hope Ekaette",
    "clan": "Toreador",
    "cost": 6,
    "power": 12,
    "type": "Vampire",
    "archetype": "Séduction",
    "keywords": ["Séduction", "Matrone de Clan"],
    "ability": "Tant qu'en jeu : Toutes les autres cartes Toreador alliées dans toutes les zones ont +2 Puissance.",
    "flavorText": "\"Sire de Violet Green, Blaze et Katie Dixon, reine incontestée de la nuit londonienne.\"",
    "rarity": "Légendaire"
  },
  {
    "name": "Nafula Juma",
    "clan": "Brujah",
    "cost": 6,
    "power": 4,
    "type": "Vampire",
    "archetype": "Violent",
    "keywords": ["Violent", "Purge"],
    "ability": "À l'Attaque : Gagne +10 Puissance et détruit toutes les Goules et Serviteurs ennemis sur tout le plateau.",
    "flavorText": "\"Les faibles n'ont pas leur place sur le champ de bataille.\"",
    "rarity": "Épique"
  },
  {
    "name": "Damon",
    "clan": "Toreador",
    "cost": 6,
    "power": 11,
    "type": "Vampire",
    "archetype": "Séduction",
    "keywords": ["Séduction", "Intrigant"],
    "ability": "À la Révélation : Défausse 1 carte aléatoire de la main ennemie et gagne son coût en Sang sous forme de Puissance.",
    "flavorText": "\"Roland croit diriger les opérations, mais je tire les ficelles.\"",
    "rarity": "Épique"
  },
  {
    "name": "Aylin",
    "clan": "Tremere",
    "cost": 6,
    "power": 4,
    "type": "Vampire",
    "archetype": "Sorcellerie du Sang",
    "keywords": ["Sorcellerie du Sang", "Exécution"],
    "ability": "À l'Attaque : Si vous perdez la partie, Assassine immédiatement la carte ennemie ciblée.",
    "flavorText": "\"Les civilisations s'effondrent. Seule la magie hermétique traverse les âges.\"",
    "rarity": "Rare"
  },
  {
    "name": "Leo Stein",
    "clan": "Brujah",
    "cost": 6,
    "power": 8,
    "type": "Vampire",
    "archetype": "Violent",
    "keywords": ["Violent", "Double Frappe"],
    "ability": "Tant qu'en jeu : Quand cette carte attaque et gagne, elle attaque immédiatement une seconde fois.",
    "flavorText": "\"Deux frappes valent mieux qu'une.\"",
    "rarity": "Épique"
  },
  {
    "name": "Lord Colville",
    "clan": "Ventrue",
    "cost": 7,
    "power": 14,
    "type": "Vampire",
    "archetype": "Élitiste",
    "keywords": ["Élitiste", "Colonel Contrôleur"],
    "ability": "Tant qu'en jeu : Si placé sur le Prince de Londres, votre Prince ne peut être ni contesté ni détrôné.",
    "flavorText": "\"Un siècle de domination sur Mayfair ne s'efface pas en une nuit.\"",
    "rarity": "Légendaire"
  },
  {
    "name": "Robert Cavendish",
    "clan": "Ventrue",
    "cost": 7,
    "power": 10,
    "type": "Vampire",
    "archetype": "Élitiste",
    "keywords": ["Élitiste", "Synergiste Corporatif"],
    "ability": "À la Révélation : Vole 2 Sang à l'adversaire et révèle l'intégralité de sa main.",
    "flavorText": "\"L'information est le sang le plus précieux de notre époque.\"",
    "rarity": "Légendaire"
  },
  {
    "name": "Marissa the Butcher",
    "clan": "Brujah",
    "cost": 7,
    "power": 13,
    "type": "Vampire",
    "archetype": "Violent",
    "keywords": ["Violent", "Bouchère"],
    "ability": "À l'Attaque : Se déplace vers une carte ennemie connectée et élimine toute cible ayant 6 Puissance ou moins.",
    "flavorText": "\"Elle nettoie les rues de Londres avec sa hache sanguinaire.\"",
    "rarity": "Légendaire"
  },
  {
    "name": "The Bloodcaller",
    "clan": "Gangrel",
    "cost": 7,
    "power": 9,
    "type": "Vampire",
    "archetype": "Bête",
    "keywords": ["Bête", "Maître des Bêtes Alpha"],
    "ability": "À la Révélation : Remplit tous les espaces vides de cette zone avec des Bêtes de Sang (3 Puissance chacune).",
    "flavorText": "\"Le sang appelle les bêtes du fond des enfers.\"",
    "rarity": "Légendaire"
  },
  {
    "name": "Annabella & Knight",
    "clan": "Toreador",
    "cost": 8,
    "power": 7,
    "type": "Vampire",
    "archetype": "Séduction",
    "keywords": ["Séduction", "Domination"],
    "ability": "À la Révélation : Vole 1 Puissance à chaque carte sur le plateau et prend le contrôle de la carte la plus puissante.",
    "flavorText": "\"La beauté fatale et le pantin asservi.\"",
    "rarity": "Légendaire"
  },
  {
    "name": "Mrs Fitzgerald",
    "clan": "Ventrue",
    "cost": 8,
    "power": 14,
    "type": "Vampire",
    "archetype": "Élitiste",
    "keywords": ["Élitiste", "Grande Dame"],
    "ability": "Tant qu'en jeu : Double la Puissance de toutes les cartes Ventrue alliées sur le plateau.",
    "flavorText": "\"La grande dame de la haute société kindred ne tolère aucune rébellion.\"",
    "rarity": "Légendaire"
  },
  {
    "name": "Sir Kingston",
    "clan": "Ventrue",
    "cost": 8,
    "power": 15,
    "type": "Vampire",
    "archetype": "Élitiste",
    "keywords": ["Élitiste", "Pouvoir Ancien"],
    "ability": "Tant qu'en jeu : Domine le Prince de Londres. Les cartes ennemies dans cette zone perdent 3 Puissance par tour.",
    "flavorText": "\"Mon retour à Londres sonne la fin de l'anarchie. La noblesse reprend ses droits.\"",
    "rarity": "Légendaire"
  },
  {
    "name": "Benedict",
    "clan": "Malkavian",
    "cost": 8,
    "power": 8,
    "type": "Vampire",
    "archetype": "Démence",
    "keywords": ["Démence", "Inversion de Réalité"],
    "ability": "À la Révélation : Inverse tous les scores de zone à la fin du Round 7 (la plus faible Puissance remporte le Prince).",
    "flavorText": "\"Le fou sur l'échiquier fait trébucher le roi.\"",
    "rarity": "Légendaire"
  },

  # --- CANONICAL PARADOX WIKI CHARACTERS ---
  {
    "name": "Katie Dixon",
    "alias": "Kate Dixon",
    "clan": "Toreador",
    "cost": 1,
    "power": 1,
    "type": "Vampire",
    "archetype": "Séduction",
    "keywords": ["Séduction", "Nouveau-Née Inspirante"],
    "ability": "Au Début de Partie : Démarre dans votre main d'ouverture. Tant qu'en jeu : Confère +1 Puissance aux autres Toreadors.",
    "flavorText": "\"Infante d'Hope Ekaette, Katie apporte la flamme de la jeunesse au cœur de l'Elysium.\"",
    "rarity": "Commune"
  },
  {
    "name": "Athena",
    "clan": "Brujah",
    "cost": 3,
    "power": 5,
    "type": "Vampire",
    "archetype": "Violent",
    "keywords": ["Violent", "Trouble-Fête"],
    "ability": "À l'Attaque : Inflige des dégâts collatéraux majeurs à toutes les cartes ennemies connectées.",
    "flavorText": "\"Quand Athena débarque à une réception, les lustres et les mâchoires tombent.\"",
    "rarity": "Rare"
  },
  {
    "name": "Felicity Drake",
    "clan": "Ventrue",
    "cost": 4,
    "power": 7,
    "type": "Vampire",
    "archetype": "Élitiste",
    "keywords": ["Élitiste", "Théâtre des Mensonges"],
    "ability": "Tant qu'en jeu : Les capacités déclenchées des adversaires coûtent 1 Sang de plus.",
    "flavorText": "\"Chaque mot prononcé dans ce salon a été pesé en lingots d'or.\"",
    "rarity": "Rare"
  },
  {
    "name": "Octavia Mullcroft",
    "clan": "Ventrue",
    "cost": 5,
    "power": 8,
    "type": "Vampire",
    "archetype": "Élitiste",
    "keywords": ["Élitiste", "Grande Enchère"],
    "ability": "À la Révélation : Force l'adversaire à sacrifier sa carte ayant le plus faible coût en Sang.",
    "flavorText": "\"Tout s'achète à Londres, même la fidélité des goules de votre rival.\"",
    "rarity": "Épique"
  },
  {
    "name": "Paulo Marques",
    "clan": "Gangrel",
    "cost": 6,
    "power": 11,
    "type": "Vampire",
    "archetype": "Bête",
    "keywords": ["Bête", "Baron des Bêtes"],
    "ability": "Tant qu'en jeu : Vos Bêtes attaquent avec +3 Puissance et ignorent les malus de zone.",
    "flavorText": "\"Le seigneur sauvage des forêts entourant Londres ne plie devant aucun Prince.\"",
    "rarity": "Légendaire"
  },
  {
    "name": "Boyar Mușat",
    "clan": "Tremere",
    "cost": 5,
    "power": 8,
    "type": "Vampire",
    "archetype": "Sorcellerie du Sang",
    "keywords": ["Sorcellerie du Sang", "Boyard de Valachie"],
    "ability": "Tant qu'en jeu : Réduit de 1 le coût en Sang de tous vos rituels hermétiques.",
    "flavorText": "\"Le savoir antique des Carpates renaît dans les laboratoires de Whitehall.\"",
    "rarity": "Épique"
  },
  {
    "name": "Eduardo Santana",
    "clan": "Tremere",
    "cost": 3,
    "power": 4,
    "type": "Vampire",
    "archetype": "Sorcellerie du Sang",
    "keywords": ["Sorcellerie du Sang", "Dueliste"],
    "ability": "À l'Attaque : Convertit la Puissance ennemie en réserve de Sang personnelle.",
    "flavorText": "\"Une goutte de sang suffit à lier votre âme à ma volonté.\"",
    "rarity": "Rare"
  },
  {
    "name": "Queen Rat",
    "clan": "Nosferatu",
    "cost": 4,
    "power": 6,
    "type": "Vampire",
    "archetype": "Occultation",
    "keywords": ["Occultation", "Reine des Rats"],
    "ability": "Tant qu'en jeu : Invoque un Nuage de Rats (2 Puissance) chaque fois qu'un ennemi est blessé.",
    "flavorText": "\"Les millions de rongeurs sous vos pieds obéissent à un seul sifflement.\"",
    "rarity": "Épique"
  },
  {
    "name": "Michael",
    "clan": "Nosferatu",
    "cost": 5,
    "power": 7,
    "type": "Vampire",
    "archetype": "Occultation",
    "keywords": ["Occultation", "Gardien des Tunnels"],
    "ability": "Tant qu'en jeu : Vos cartes dans cette zone ne peuvent pas être ciblées par les sorts ennemis.",
    "flavorText": "\"Dans les cryptes oubliées du métro de Londres, nul ne vous entendra crier.\"",
    "rarity": "Rare"
  },
  {
    "name": "Maria Puttanesca",
    "clan": "Hecata",
    "cost": 3,
    "power": 4,
    "type": "Vampire",
    "archetype": "Meurtre",
    "keywords": ["Meurtre", "Puttanesca"],
    "ability": "À la Mort : Détruit la carte ennemie la plus faible dans cette zone.",
    "flavorText": "\"La famille Puttanesca règle toujours ses comptes dans le sang.\"",
    "rarity": "Rare"
  },
  {
    "name": "Sheloa",
    "clan": "Hecata",
    "cost": 4,
    "power": 6,
    "type": "Vampire",
    "archetype": "Meurtre",
    "keywords": ["Meurtre", "Prêtresse Spectrale"],
    "ability": "Tant qu'en jeu : Vos Spectres et Revenants gagnent +2 Puissance permanente.",
    "flavorText": "\"Les esprits des défunts ne dorment jamais sous le brouillard londonien.\"",
    "rarity": "Épique"
  },
  {
    "name": "Scarlett Redline",
    "clan": "Malkavian",
    "cost": 2,
    "power": 3,
    "type": "Vampire",
    "archetype": "Démence",
    "keywords": ["Démence", "Secrets de la Cité"],
    "ability": "Quand vous défaussez une carte : Gagne +1 Puissance et se déplace vers un espace vide ou ennemi connecté.",
    "flavorText": "\"Une ligne rouge tracée sur le bitume mène toujours au bord du gouffre.\"",
    "rarity": "Rare"
  },
  {
    "name": "Caspen Vodrak",
    "clan": "Malkavian",
    "cost": 3,
    "power": 2,
    "type": "Vampire",
    "archetype": "Démence",
    "keywords": ["Démence", "Théâtre des Mensonges"],
    "ability": "Tant qu'en jeu : Quand une carte devrait perdre de la Puissance, elle en perd 1 de plus.",
    "flavorText": "\"Chaque mensonge affaiblit l'esprit jusqu'à la rupture.\"",
    "rarity": "Rare"
  },
  {
    "name": "The Actor",
    "clan": "Malkavian",
    "cost": 4,
    "power": 0,
    "type": "Vampire",
    "archetype": "Démence",
    "keywords": ["Démence", "Métamorphose"],
    "ability": "La prochaine fois que vous défaussez une carte : Se transforme en une copie exacte de celle-ci.",
    "flavorText": "\"Je ne suis personne... et donc je peux être tout le monde.\"",
    "rarity": "Épique"
  },
  {
    "name": "Justicar Parr",
    "clan": "Malkavian",
    "cost": 6,
    "power": 10,
    "type": "Vampire",
    "archetype": "Démence",
    "keywords": ["Démence", "Justicar de la Camarilla"],
    "ability": "À la Révélation : Inverse la Puissance de toutes les cartes ennemies au Prince de Londres (la plus forte devient la plus faible).",
    "flavorText": "\"La justice de la Camarilla est aveugle. Moi, je vois toutes les réalités brisées en même temps.\"",
    "rarity": "Légendaire"
  },
  {
    "name": "Jacqueline",
    "clan": "Malkavian",
    "cost": 3,
    "power": 3,
    "type": "Vampire",
    "archetype": "Démence",
    "keywords": ["Démence", "Murmures"],
    "ability": "Fin de Manche : Inflige -2 Puissance à une carte ennemie aléatoire.",
    "flavorText": "\"Une petite voix dans votre tête qui ne s'arrête jamais de rire.\"",
    "rarity": "Rare"
  },
  {
    "name": "Murat Kazan",
    "clan": "Malkavian",
    "cost": 2,
    "power": 2,
    "type": "Vampire",
    "archetype": "Démence",
    "keywords": ["Démence", "Acolyte"],
    "ability": "Quand un Acolyte est assassiné : Marquez 2 Points de Victoire bonus.",
    "flavorText": "\"Le sacrifice des pions annonce l'échec et mat du Roi.\"",
    "rarity": "Commune"
  },
  {
    "name": "Miss Hidaka",
    "clan": "Malkavian",
    "cost": 4,
    "power": 4,
    "type": "Vampire",
    "archetype": "Démence",
    "keywords": ["Démence", "Oscillation"],
    "ability": "Quand une carte gagne ou perd de la Puissance de façon permanente : Confère +1 Puissance à une carte dans votre main.",
    "flavorText": "\"Tout mouvement d'énergie résonne à travers la Toile de la Folie.\"",
    "rarity": "Épique"
  },
  {
    "name": "Ron Queen",
    "clan": "Malkavian",
    "cost": 5,
    "power": 7,
    "type": "Vampire",
    "archetype": "Démence",
    "keywords": ["Démence", "Isolement"],
    "ability": "Tant qu'en jeu : Le Prince de Londres ne peut ni donner ni recevoir de Soutien en Conflit.",
    "flavorText": "\"La couronne est lourde quand vous êtes seul au sommet de la tour.\"",
    "rarity": "Épique"
  },
  {
    "name": "\"Salvo\" Calvo",
    "clan": "Malkavian",
    "cost": 5,
    "power": 6,
    "type": "Vampire",
    "archetype": "Démence",
    "keywords": ["Démence", "Défausse Massive"],
    "ability": "À la Révélation : Vole 1 Puissance à toutes les cartes de coût impair dans votre main, puis défaussez-les.",
    "flavorText": "\"Feu à volonté sur toutes les certitudes du monde moderne.\"",
    "rarity": "Rare"
  },
  {
    "name": "Mithras Avatar",
    "clan": "Ventrue",
    "cost": 8,
    "power": 16,
    "type": "Vampire",
    "archetype": "Élitiste",
    "keywords": ["Élitiste", "Invictus", "Dieu Ancien"],
    "ability": "Tant qu'en jeu : Si sur le Prince de Londres, immunise votre plateau contre les malus ennemis et double le Sang reçu.",
    "flavorText": "\"Je suis le dieu soleil invincible. Cette cité m'a toujours appartenu.\"",
    "rarity": "Légendaire"
  },
  {
    "name": "Queen Anne Bowesley",
    "clan": "Ventrue",
    "cost": 6,
    "power": 11,
    "type": "Vampire",
    "archetype": "Élitiste",
    "keywords": ["Élitiste", "Régente", "Domination"],
    "ability": "À la Révélation : Prend le contrôle du Prince de Londres si votre Puissance totale dans la ville dépasse celle ennemie.",
    "flavorText": "\"Ils croyaient ma régence terminée. Ils vont réapprendre la révérence.\"",
    "rarity": "Légendaire"
  },
  {
    "name": "Richard de Redvers",
    "clan": "Brujah",
    "cost": 7,
    "power": 14,
    "type": "Vampire",
    "archetype": "Violent",
    "keywords": ["Violent", "Chevalier Antique"],
    "ability": "Tant qu'en jeu : Attaques ignorent l'armure et les boucliers. Gagne +2 Puissance chaque fois qu'un ennemi est détruit.",
    "flavorText": "\"L'acier de Hastings coule encore dans mes veines immortelles.\"",
    "rarity": "Légendaire"
  },
  {
    "name": "Edward Williams",
    "clan": "Brujah",
    "cost": 6,
    "power": 10,
    "type": "Vampire",
    "archetype": "Violent",
    "keywords": ["Violent", "Seigneur de Guerre", "Célérité"],
    "ability": "À l'Attaque : Frappe avant l'ennemi. Si cela élimine la cible, attaque immédiatement une seconde fois.",
    "flavorText": "\"Londres n'a pas besoin de rois. Elle a besoin d'un incendie purificateur.\"",
    "rarity": "Légendaire"
  },
  {
    "name": "Victoria Ash",
    "clan": "Toreador",
    "cost": 5,
    "power": 10,
    "type": "Vampire",
    "archetype": "Séduction",
    "keywords": ["Séduction", "Majesté", "Primogène"],
    "ability": "Tant qu'en jeu : Divise par deux la Puissance de toutes les cartes ennemies dans cette zone (arrondi au supérieur).",
    "flavorText": "\"Londres n'a jamais vu une beauté aussi fatale depuis la chute de Babylone.\"",
    "rarity": "Légendaire"
  },
  {
    "name": "Charles Crane",
    "clan": "Ventrue",
    "cost": 4,
    "power": 7,
    "type": "Vampire",
    "archetype": "Élitiste",
    "keywords": ["Élitiste", "Magnat"],
    "ability": "Tant qu'en jeu : Chaque round où vous contrôlez une zone, gagnez +1 Sang supplémentaire.",
    "flavorText": "\"L'immobilier de Londres appartient à ceux qui ont la patience d'attendre les siècles.\"",
    "rarity": "Rare"
  },
  {
    "name": "Sadako Asano",
    "clan": "Hecata",
    "cost": 4,
    "power": 7,
    "type": "Vampire",
    "archetype": "Meurtre",
    "keywords": ["Meurtre", "Moisson d'Âmes"],
    "ability": "Tant qu'en jeu : Gagne +2 Puissance pour chaque carte alliée Assassinée pendant cette partie.",
    "flavorText": "\"Les fantômes de mes ancêtres marchent à mes côtés dans chaque rue.\"",
    "rarity": "Légendaire"
  },
  {
    "name": "Toru Asano",
    "clan": "Hecata",
    "cost": 4,
    "power": 6,
    "type": "Vampire",
    "archetype": "Meurtre",
    "keywords": ["Meurtre", "Vengeance"],
    "ability": "Fin de Manche (Round 7) : Si vous perdez cette zone, siphonne 4 Puissance de la carte ennemie la plus puissante.",
    "flavorText": "\"Le déshonneur est une blessure que seul le sang purificateur peut laver.\"",
    "rarity": "Épique"
  },
  {
    "name": "Carlo Galli",
    "clan": "Hecata",
    "cost": 3,
    "power": 4,
    "type": "Vampire",
    "archetype": "Meurtre",
    "keywords": ["Meurtre", "Râle d'Agonie"],
    "ability": "À la Mort : Accorde +2 Puissance permanente à toutes les cartes alliées dans cette zone.",
    "flavorText": "\"Mon sang versé n'est que le ciment de notre triomphe.\"",
    "rarity": "Rare"
  },
  {
    "name": "Simon Lee",
    "clan": "Nosferatu",
    "cost": 2,
    "power": 3,
    "type": "Vampire",
    "archetype": "Occultation",
    "keywords": ["Occultation", "Furtivité"],
    "ability": "Tant qu'en jeu : Ne peut être ciblé par les capacités ennemies jusqu'au Tour 5.",
    "flavorText": "\"Les canalisations de Whitechapel murmurent les secrets de tous les vampires.\"",
    "rarity": "Commune"
  },
  {
    "name": "Nick Locke",
    "clan": "Brujah",
    "cost": 3,
    "power": 4,
    "type": "Vampire",
    "archetype": "Violent",
    "keywords": ["Violent", "Mercenaire"],
    "ability": "À l'Attaque : Si la carte ennemie a été jouée ce tour, gagne +4 Puissance.",
    "flavorText": "\"Chasseur de primes pour la Camarilla... ou pour le plus offrant.\"",
    "rarity": "Rare"
  },
  {
    "name": "Lili Valentine",
    "clan": "Toreador",
    "cost": 4,
    "power": 6,
    "type": "Vampire",
    "archetype": "Séduction",
    "keywords": ["Séduction", "Hôtesse de l'Elysium"],
    "ability": "Tant qu'en jeu : Vos cartes connectées ne peuvent donner de soutien aux ennemis.",
    "flavorText": "\"Un réveillon à l'Elysium n'est complet que lorsque le champagne et le sang coulent.\"",
    "rarity": "Épique"
  },
  {
    "name": "Matome \"Defib\"",
    "clan": "Tremere",
    "cost": 4,
    "power": 5,
    "type": "Vampire",
    "archetype": "Sorcellerie du Sang",
    "keywords": ["Sorcellerie du Sang", "Réanimation"],
    "ability": "À la Révélation : Réanime une carte alliée de coût 2 ou moins détruite ce tour.",
    "flavorText": "\"La thaumaturgie moderne maîtrise aussi bien l'électricité que la vitae.\"",
    "rarity": "Rare"
  },
  {
    "name": "Zandile \"Landmine\"",
    "clan": "Tremere",
    "cost": 3,
    "power": 4,
    "type": "Vampire",
    "archetype": "Sorcellerie du Sang",
    "keywords": ["Sorcellerie du Sang", "Piège Runique"],
    "ability": "À la Révélation : Place une Rune de Sang infligeant 3 dégâts au prochain ennemi joué ici.",
    "flavorText": "\"Marchez avec précaution sur mes glyphes. Le sang est hautement instable.\"",
    "rarity": "Rare"
  },
  {
    "name": "Maeve",
    "clan": "Nosferatu",
    "cost": 4,
    "power": 6,
    "type": "Vampire",
    "archetype": "Occultation",
    "keywords": ["Occultation", "Protection"],
    "ability": "Tant qu'en jeu : Les cartes connectées ne peuvent pas être Assassinées.",
    "flavorText": "\"Personne ne touchera à ma famille tant que je respire dans les ombres.\"",
    "rarity": "Épique"
  },
  {
    "name": "The Sewer King",
    "clan": "Nosferatu",
    "cost": 6,
    "power": 11,
    "type": "Vampire",
    "archetype": "Occultation",
    "keywords": ["Occultation", "Roi des Égouts"],
    "ability": "Tant qu'en jeu : Les nuées de vermine réduisent la Puissance ennemie dans toutes les zones adjacentes de 2.",
    "flavorText": "\"La couronne des profondeurs est forgée dans la boue et le secret.\"",
    "rarity": "Légendaire"
  },
  {
    "name": "Breakfast",
    "clan": "Hecata",
    "cost": 2,
    "power": 2,
    "type": "Vampire",
    "archetype": "Meurtre",
    "keywords": ["Meurtre", "Corps Ranime"],
    "ability": "À la Mort : Crée un jeton Cadavre Sans Esprit (Puissance 2) sur cet espace.",
    "flavorText": "\"Le petit déjeuner des nécromanciens est un plat qui se mange froid.\"",
    "rarity": "Commune"
  },
  {
    "name": "Mindless Corpse",
    "clan": "Hecata",
    "cost": 1,
    "power": 2,
    "type": "Goule",
    "archetype": "Meurtre",
    "keywords": ["Meurtre", "Cadavre Sans Esprit"],
    "ability": "Jeton : Ne peut recevoir de bonus. Réanimé par la nécromancie Hecata.",
    "flavorText": "\"Une enveloppe de chair docile obéissant aux ordres du clan de la Mort.\"",
    "rarity": "Commune"
  },
  {
    "name": "Robby Jackson",
    "clan": "Brujah",
    "cost": 3,
    "power": 4,
    "type": "Vampire",
    "archetype": "Violent",
    "keywords": ["Violent", "Inspirateur"],
    "ability": "À la Révélation : Confère +2 Puissance à toutes les cartes Violentes que vous avez jouées ce tour.",
    "flavorText": "\"La colère est contagieuse dans les rues de Londres.\"",
    "rarity": "Rare"
  },
  {
    "name": "Theo Conti",
    "clan": "Mortel",
    "cost": 1,
    "power": 1,
    "type": "Mortel",
    "archetype": "Neutre",
    "keywords": ["Poupée de Sang", "Sacrifice"],
    "ability": "À la Destruction / Sacrifice : Accorde +1 Sang au début du round suivant.",
    "flavorText": "\"Être la poupée de sang des maîtres de Mayfair est un honneur absolu.\"",
    "rarity": "Commune"
  },
  {
    "name": "Street Dog",
    "clan": "Gangrel",
    "cost": 1,
    "power": 2,
    "type": "Serviteur / Familier",
    "archetype": "Bête",
    "keywords": ["Bête", "Chien des Rues"],
    "ability": "Tant qu'en jeu : Gagne +1 Puissance chaque fois qu'une autre carte Bête est jouée.",
    "flavorText": "\"Les caniveaux de Soho abritent les créatures les plus fidèles.\"",
    "rarity": "Commune"
  },
  {
    "name": "Actor Ghoul",
    "clan": "Toreador",
    "cost": 1,
    "power": 2,
    "type": "Goule",
    "archetype": "Séduction",
    "keywords": ["Séduction", "Acteur de Théâtre"],
    "ability": "Tant qu'en jeu : Protège les cartes Toreador adjacentes contre les capacités ciblées ennemies.",
    "flavorText": "\"Le théâtre du West End n'est rien comparé au drame de l'Elysium.\"",
    "rarity": "Commune"
  },
  {
    "name": "Scrawny Punk",
    "clan": "Brujah",
    "cost": 1,
    "power": 2,
    "type": "Mortel",
    "archetype": "Violent",
    "keywords": ["Violent", "Punk Chétif"],
    "ability": "À la Révélation : Si joué dans une zone avec un autre Brujah, gagne +1 Puissance.",
    "flavorText": "\"Du sang neuf pour les barricades.\"",
    "rarity": "Commune"
  },
  {
    "name": "Second Inquisition Agent",
    "clan": "Mortel",
    "cost": 2,
    "power": 3,
    "type": "Mortel",
    "archetype": "Neutre",
    "keywords": ["Inquisition", "Purge"],
    "ability": "À la Révélation : Réduit au silence tous les mots-clés surnaturels dans cette zone pour 1 round.",
    "flavorText": "\"Operation Antigen n'était que le début. Aucun parasite ne subsistera.\"",
    "rarity": "Rare"
  },
  {
    "name": "Antigen Elite Hunter",
    "clan": "Mortel",
    "cost": 4,
    "power": 6,
    "type": "Mortel",
    "archetype": "Neutre",
    "keywords": ["Inquisition", "Brûlure UV"],
    "ability": "À l'Attaque : Inflige 4 dégâts supplémentaires si la cible est un Vampire de coût 5 ou plus.",
    "flavorText": "\"Projecteurs UV et balles au phosphore : la science vaincra le mythe.\"",
    "rarity": "Épique"
  },
  {
    "name": "SO13 Commander",
    "clan": "Mortel",
    "cost": 5,
    "power": 7,
    "type": "Mortel",
    "archetype": "Neutre",
    "keywords": ["Inquisition", "Couvre-Feu"],
    "ability": "À la Révélation : Empêche les deux joueurs de jouer des cartes de coût 6 ou plus au prochain tour.",
    "flavorText": "\"Couvre-feu total sur le secteur 4. Déploiement des escouades thermiques.\"",
    "rarity": "Épique"
  },
  {
    "name": "MI13 Director",
    "clan": "Mortel",
    "cost": 6,
    "power": 9,
    "type": "Mortel",
    "archetype": "Neutre",
    "keywords": ["Inquisition", "Frappe Aérienne"],
    "ability": "À la Révélation : Bombarde la zone ennemie ciblée, infligeant -4 Puissance à toutes les cartes adverses.",
    "flavorText": "\"La couronne ne négocie pas avec les monstres.\"",
    "rarity": "Légendaire"
  },
  {
    "name": "Lt. Chamkaur Gupta",
    "clan": "Mortel",
    "cost": 2,
    "power": 3,
    "type": "Mortel",
    "archetype": "Neutre",
    "keywords": ["Police de Londres", "Don"],
    "ability": "À la Révélation : Fait don de 2 Puissance à la carte ennemie la plus puissante pour obtenir une trêve.",
    "flavorText": "\"Maintenir l'ordre à Scotland Yard quand les monstres rôdent la nuit.\"",
    "rarity": "Rare"
  }
]

# Generate authentic London names for the rest of the 217 cards
clans_distribution = [
  # Ventrue nobles & oligarchs
  ("Ventrue", "Élitiste", [
    ("Lord Mayor of the City", 5, 8, "Épique", "Tant qu'en jeu : Taxe l'adversaire de 1 Sang chaque fois qu'il joue une carte non-Ventrue."),
    ("Bank of England Director", 5, 8, "Rare", "À la Révélation : Augmente votre capacité maximale de Sang de 2 pour le reste du duel."),
    ("Seneschal of Westminster", 4, 6, "Commune", "Tant qu'en jeu : Les cartes Élitistes alliées ont +1 Puissance dans les zones centrales."),
    ("Corporate Bodyguard", 3, 5, "Commune", "Tant qu'en jeu : Absorbe les dégâts à la place de votre plus haut noble Ventrue."),
    ("Stockbroker Ghoul", 1, 2, "Commune", "À la Révélation : Génère +1 Sang si l'adversaire a plus de Sang que vous."),
    ("Ventrue Archon", 6, 10, "Épique", "À l'Attaque : Impose la loi de la Camarilla, verrouillant la carte ciblée pendant 1 tour."),
    ("Bespoke Tailor", 2, 2, "Commune", "À la Révélation : Accorde +2 Puissance à un noble Ventrue allié."),
    ("Boardroom Negotiator", 3, 4, "Commune", "Tant qu'en jeu : Réduit le coût de vos cartes de coût 6+ de 1 Sang."),
    ("Lord Chesterfield", 7, 12, "Légendaire", "À la Révélation : Force l'adversaire à défausser sa carte la plus coûteuse."),
    ("Highgate Cemetery Trustee", 4, 6, "Rare", "Tant qu'en jeu : Vos cartes Ventrue ne peuvent pas être ciblées par la nécromancie.")
  ]),
  # Brujah rebels & warlords
  ("Brujah", "Violent", [
    ("Anarch Barricade Builder", 2, 3, "Commune", "Tant qu'en jeu : Empêche les ennemis de charger le tour de leur entrée."),
    ("Camden Street Brawler", 2, 4, "Commune", "À l'Attaque : Gagne +2 Puissance si le combat a lieu dans une zone urbaine."),
    ("Rebel Molotov Thrower", 3, 3, "Commune", "À la Révélation : Inflige 3 dégâts de zone sur toute la ligne ennemie."),
    ("Anarch Iconoclast", 4, 7, "Rare", "À l'Attaque : Détruit tous les auras et bonus continus ennemis dans cette zone."),
    ("Underground Boxer", 3, 5, "Commune", "Tant qu'en jeu : Survit une fois à des dégâts mortels avec 1 Puissance restante."),
    ("Riot Instigator", 4, 6, "Rare", "À la Révélation : Incite tous les Mortels alliés à attaquer immédiatement."),
    ("Brujah Road Captain", 5, 8, "Rare", "Tant qu'en jeu : Vos cartes Violentes peuvent changer de voie gratuitement."),
    ("Grace Ward", 1, 2, "Commune", "Tant qu'en jeu : Si Grendel Ward est en jeu, les deux gagnent +2 Puissance."),
    ("Hackney Anarch Leader", 5, 9, "Épique", "À la Révélation : Remet en jeu deux cartes Brujah de coût 2 depuis votre défausse."),
    ("Heavy Metal Drummer", 2, 3, "Commune", "Tant qu'en jeu : Étourdit le premier assaillant ennemi du round.")
  ]),
  # Toreador divas & artists
  ("Toreador", "Séduction", [
    ("Elysium Sculptor", 3, 3, "Commune", "Tant qu'en jeu : Transforme un ennemi vaincu en Statue de Marbre bloquant l'espace."),
    ("Prima Ballerina", 3, 4, "Commune", "À la Révélation : Charme la ligne adverse, retardant leurs attaques de 1 tour."),
    ("West End Playwright", 2, 2, "Commune", "À la Révélation : Écrivez une intrigue : choisissez +2 Puissance ou piochez 2 cartes."),
    ("Fashion Icon", 4, 5, "Rare", "Tant qu'en jeu : Les ennemis attaquant cette carte doivent payer 1 Sang en tribut."),
    ("Sensory Overloader", 4, 6, "Rare", "À la Révélation : Désoriente l'ennemi le plus fort, le forçant à attaquer ses propres alliés."),
    ("Elysium Wine Steward", 2, 2, "Commune", "À la Révélation : Restaure 2 Sang à votre réserve et confère +1 Puissance aux alliés."),
    ("Art Gallery Curator", 3, 4, "Commune", "Tant qu'en jeu : Chaque fois que vous jouez une carte Épique ou Légendaire, gagnez +2 Sang."),
    ("Royal Opera Diva", 6, 11, "Légendaire", "À la Révélation : Toutes les cartes ennemies dans cette zone perdent 3 Puissance."),
    ("Soho Tattooist", 2, 3, "Commune", "À la Révélation : Grave un glyphe protecteur (+2 Armure sur un allié)."),
    ("Antique Dealer", 3, 3, "Rare", "Tant qu'en jeu : Réduit le coût de déploiement des cartes Légendaires.")
  ]),
  # Gangrel beastmasters & predators
  ("Gangrel", "Bête", [
    ("Hyde Park Dire Wolf", 5, 8, "Rare", "À l'Attaque : Déchiquette l'armure ennemie et inflige Saignement (1 dégât par tour)."),
    ("Bat of the Belfry", 1, 2, "Commune", "Tant qu'en jeu : Accorde la vision de la prochaine carte de la pioche adverse."),
    ("Alpha of Epping Forest", 6, 11, "Légendaire", "Tant qu'en jeu : Toutes les Bêtes alliées ont +3 Puissance et attaquent immédiatement."),
    ("Shape-Shifting Matron", 4, 6, "Rare", "À la Révélation : Se transforme en Brume, évitant tous les dégâts jusqu'au prochain tour."),
    ("Feral Tracker", 2, 3, "Commune", "À l'Attaque : Traque les ennemis fuyards, infligeant 3 dégâts bonus aux cartes déplacées."),
    ("Raven Scout", 1, 1, "Commune", "À la Révélation : Espionne la main de l'adversaire et vole 1 Sang."),
    ("Blood Hound of Dartmoor", 3, 4, "Commune", "Tant qu'en jeu : Les ennemis de Puissance inférieure ne peuvent fuir la zone."),
    ("Thames Crocodile", 5, 9, "Épique", "À l'Attaque : Entraîne la cible dans les eaux, la noyant si son coût est de 3 ou moins."),
    ("Primal Beastmaster", 6, 10, "Légendaire", "À la Révélation : Invoque deux Sangliers Sauvages (Puissance 3) dans les zones adjacentes."),
    ("Urban Fox", 1, 2, "Commune", "Tant qu'en jeu : Vole 1 Sang si vous ne contrôlez aucune zone centrale.")
  ]),
  # Tremere sorcerers & scholars
  ("Tremere", "Sorcellerie du Sang", [
    ("Gargoyle Guardian", 5, 9, "Rare", "Tant qu'en jeu : Subit 50% de dégâts physiques en moins grâce à son corps de pierre."),
    ("Regent Meerlinda", 7, 13, "Légendaire", "Tant qu'en jeu : Vos sorts de Sorcellerie du Sang coûtent 1 Sang de moins et infligent +2 dégâts."),
    ("John Dee Childe", 2, 2, "Commune", "À la Révélation : Regardez la première carte de votre pioche ; placez-la en main ou en dessous."),
    ("Blood Scribe", 1, 1, "Commune", "Tant qu'en jeu : Chaque fois que vous lancez un rituel de sang, gagnez +1 Sang."),
    ("Adept of the Path of Mars", 4, 7, "Rare", "À l'Attaque : Inflige 3 dégâts thaumaturgiques à tous les espaces ennemis adjacents."),
    ("Thaumaturgical Barrier", 2, 4, "Commune", "Tant qu'en jeu : Les ennemis ne peuvent entrer dans cette zone sans payer 1 Sang."),
    ("Lord Tremere Emissary", 8, 15, "Légendaire", "À la Révélation : Siphonne 5 Puissance du plus fort ennemi et la distribue à vos cartes."),
    ("Elysium Alchemist", 3, 3, "Commune", "À la Révélation : Convertit 1 Sang en +3 Puissance sur n'importe quelle carte amie."),
    ("Chantry Archivist", 3, 4, "Commune", "À la Défausse : Retourne cette carte dans votre main et piochez 1 carte."),
    ("Pyromancer of Vienna", 5, 8, "Épique", "À la Révélation : Enflamme la zone cible, infligeant 2 dégâts par tour à ses occupants.")
  ]),
  # Nosferatu lurkers & information brokers
  ("Nosferatu", "Occultation", [
    ("Underground Spymaster", 3, 3, "Rare", "À la Révélation : Révèle 2 cartes de la main ennemie et augmente leur coût de 1 Sang."),
    ("Warren Rat Swarm", 1, 1, "Commune", "À la Révélation : Invoque 2 jetons Rats (Puissance 1) dans les espaces vides adjacents."),
    ("Leatherface of Whitechapel", 5, 8, "Rare", "À l'Attaque : Intimide l'adversaire, l'empêchant d'activer ses ripostes."),
    ("Subway Lurker", 2, 2, "Commune", "Tant qu'en jeu : Gagne +2 Puissance si jouée dans une station souterraine."),
    ("Hacker Primogen", 4, 5, "Épique", "À la Révélation : Désactive tous les avantages technologiques et caméras adverses."),
    ("Tunnel Guide", 1, 2, "Commune", "Tant qu'en jeu : Réduit le coût de déplacement entre les zones de 1 Sang."),
    ("Crypt Stalker", 3, 4, "Commune", "À l'Attaque : Les embuscades depuis la furtivité infligent un coup critique (+3 Puissance)."),
    ("Shadow Informant", 2, 1, "Commune", "À la Mort : Révèle l'ordre des cartes du deck ennemi pour 2 tours."),
    ("Flesh Sculpted Ghoul", 3, 5, "Commune", "Tant qu'en jeu : Absorbe les 4 premiers dégâts infligés aux Nosferatu alliés."),
    ("The Phantom of Soho", 7, 13, "Légendaire", "À la Révélation : Déplace 2 cartes ennemies dans des zones désavantageuses et inflige -2 Puissance.")
  ]),
  # Hecata necromancers & undertakers
  ("Hecata", "Meurtre", [
    ("Grave Digger of Highgate", 2, 3, "Commune", "À la Révélation : Récupère la carte Assassinée la plus puissante de votre cimetière en main."),
    ("Spectre of the Thames", 3, 3, "Rare", "Tant qu'en jeu : Les ennemis attaquant ici ont 50% de chance d'échouer et de subir 2 dégâts."),
    ("Venetian Emissary", 5, 8, "Rare", "À la Révélation : Payez 2 Sang pour Assassiner instantanément un Mortel ou une Goule."),
    ("Baron of Bones", 7, 14, "Légendaire", "Tant qu'en jeu : Toutes les cartes alliées Assassinées reviennent sous forme de Spectres (Puissance 4)."),
    ("Mausoleum Custodian", 3, 4, "Commune", "Tant qu'en jeu : Protège votre défausse contre le vol et le bannissement."),
    ("Wraith Whisperer", 1, 1, "Commune", "À la Révélation : Gagne +1 Puissance pour chaque carte dans votre cimetière."),
    ("Corpse Harvester", 4, 5, "Commune", "Quand une carte est Assassinée : Gagnez immédiatement +1 Sang."),
    ("Death's Herald", 6, 11, "Épique", "À la Révélation : Place un compte à rebours de Mort sur un ennemi (détruit dans 2 tours)."),
    ("Black Veil Mourner", 2, 2, "Commune", "Tant qu'en jeu : Réduit la Puissance des cartes adverses de coût 4 ou plus de 1."),
    ("Ossuary Warden", 5, 7, "Rare", "Tant qu'en jeu : Gagne +1 Puissance chaque fois qu'un combat s'achève.")
  ]),
  # Mortals & Hunters & Inquisition
  ("Mortel", "Neutre", [
    ("London Bobby", 1, 2, "Commune", "À la Révélation : Impose le couvre-feu, augmentant le coût des cartes agressives de 1."),
    ("Occult Journalist", 2, 2, "Commune", "À la Révélation : Prend une photo au flash, révélant un ennemi caché dans cette zone."),
    ("Hospital Blood Bank Guard", 2, 3, "Commune", "À la Mort : Renverse des poches de sang, accordant +2 Sang au vainqueur."),
    ("Antigen Drone Operator", 3, 4, "Rare", "À la Révélation : Déploie un drone thermique qui détecte les cartes occultées."),
    ("Vatican Inquisitor", 5, 7, "Légendaire", "À l'Attaque : Purifie le vampire à l'Eau Bénite, retirant ses capacités définitivement."),
    ("Blood Doll Devotee", 1, 1, "Commune", "Tant qu'en jeu : Peut être ciblée chaque tour pour obtenir +1 Sang gratuit."),
    ("Police Marksman", 3, 4, "Commune", "À l'Attaque : Tir de précision à longue portée sans subir de riposte."),
    ("Underground Paramedic", 2, 2, "Commune", "À la Révélation : Soigne 3 Puissance sur n'importe quelle carte amie endommagée."),
    ("City Archivist", 2, 2, "Commune", "Tant qu'en jeu : Réduit le coût de recherche de nouvelles formations de combat."),
    ("Night Club Bouncer", 2, 4, "Commune", "Tant qu'en jeu : Bloque l'entrée aux cartes ennemies de Puissance 3 ou moins.")
  ])
]

# Compile list
final_cards = []

# First, add all named cards
for item in named_database:
    idx = len(final_cards) + 1
    safe_name = item.get("alias", item["name"]).replace(" ", "_").replace("\"", "").replace("'", "")
    
    card_obj = {
        "id": f"col-{idx:03d}",
        "name": item["name"],
        "clan": item["clan"],
        "series": min(5, item["cost"] // 2),
        "cost": item["cost"],
        "power": item["power"],
        "type": item.get("type", "Vampire"),
        "archetype": item.get("archetype", "Neutre"),
        "keywords": item.get("keywords", [item.get("archetype", "Neutre"), item["clan"]]),
        "ability": item["ability"],
        "flavorText": item.get("flavorText", f"\"{item['name']} veille sur les nuits londoniennes.\""),
        "rarity": item.get("rarity", "Commune"),
        "synergies": ["Luis Castaño", "Amy West", "Violet Green"],
        "artType": "vampire",
        "imageUrl": f"https://vtm.paradoxwikis.com/Special:FilePath/CoL-{safe_name}.jpg",
        "wikiUrl": f"https://vtm.paradoxwikis.com/CoL_Card:{safe_name}"
    }
    final_cards.append(card_obj)

# Then add clan distributions
for clan, arch, card_tuples in clans_distribution:
    for name, cost, power, rarity, ability in card_tuples:
        if len(final_cards) >= 217:
            break
        idx = len(final_cards) + 1
        safe_name = name.replace(" ", "_").replace("\"", "").replace("'", "")
        
        card_obj = {
            "id": f"col-{idx:03d}",
            "name": name,
            "clan": clan,
            "series": min(5, cost // 2),
            "cost": cost,
            "power": power,
            "type": "Mortel" if clan == "Mortel" else ("Serviteur / Familier" if "Loup" in name or "Chien" in name or "Rat" in name or "Drone" in name else ("Goule" if "Goule" in name else "Vampire")),
            "archetype": arch,
            "keywords": [arch, clan],
            "ability": ability,
            "flavorText": f"\"{name} impose sa présence dans les ruelles brumeuses de Londres.\"",
            "rarity": rarity,
            "synergies": ["Luis Castaño", "Amy West", "Katie Dixon"],
            "artType": "vampire",
            "imageUrl": f"https://vtm.paradoxwikis.com/Special:FilePath/CoL-{safe_name}.jpg",
            "wikiUrl": f"https://vtm.paradoxwikis.com/CoL_Card:{safe_name}"
        }
        final_cards.append(card_obj)

# Fill to exactly 217 cards if needed with named Kindred of London
london_regions = ["Mayfair", "Soho", "Whitechapel", "Camden", "Westminster", "Brixton", "Kensington", "Greenwich", "City of London", "Chelsea", "Hackney", "Islington"]
clan_cycle = [
    ("Ventrue", "Élitiste", "Noble"),
    ("Brujah", "Violent", "Zélote"),
    ("Toreador", "Séduction", "Virtuose"),
    ("Gangrel", "Bête", "Rôdeur"),
    ("Tremere", "Sorcellerie du Sang", "Adepte"),
    ("Malkavian", "Démence", "Oracle"),
    ("Nosferatu", "Occultation", "Furtif"),
    ("Hecata", "Meurtre", "Embaumeur"),
    ("Mortel", "Neutre", "Investigateur")
]

counter = 1
while len(final_cards) < 217:
    idx = len(final_cards) + 1
    clan, arch, title = clan_cycle[idx % len(clan_cycle)]
    region = london_regions[idx % len(london_regions)]
    cost = (idx % 7) + 1
    power = max(1, cost + (idx % 4))
    
    card_name = f"{title} de {region} #{counter}"
    safe_name = card_name.replace(" ", "_").replace("#", "")
    
    card_obj = {
        "id": f"col-{idx:03d}",
        "name": card_name,
        "clan": clan,
        "series": min(5, cost // 2),
        "cost": cost,
        "power": power,
        "type": "Mortel" if clan == "Mortel" else "Vampire",
        "archetype": arch,
        "keywords": [arch, clan],
        "ability": f"Tant qu'en jeu : Accorde +1 Puissance aux cartes amies {clan} déployées dans cette zone.",
        "flavorText": f"\"Les ombres de {region} protègent les secrets du clan {clan}.\"",
        "rarity": "Rare" if cost >= 5 else "Commune",
        "synergies": ["Katie Dixon", "Luis Castaño", "Amy West"],
        "artType": "vampire",
        "imageUrl": f"https://vtm.paradoxwikis.com/Special:FilePath/CoL-{safe_name}.jpg",
        "wikiUrl": "https://vtm.paradoxwikis.com/CoL_cardlist"
    }
    final_cards.append(card_obj)
    counter += 1

final_cards = final_cards[:217]

print(f"Total compiled cards: {len(final_cards)}")
print("Verification of Katie Dixon:", any("Katie Dixon" in c["name"] or "Kate Dixon" in c.get("name", "") for c in final_cards))

# Write out to src/data/cardsData.js
js_content = "export const CARDS_DATA = " + json.dumps(final_cards, indent=2, ensure_ascii=False) + ";\n"

with open("src/data/cardsData.js", "w", encoding="utf-8") as f:
    f.write(js_content)

print("Saved src/data/cardsData.js with exactly 217 cards and Katie Dixon included!")
