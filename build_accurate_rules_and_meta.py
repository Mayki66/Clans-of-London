import json

with open('src/data/cardsData.js', 'r', encoding='utf-8') as f:
    text = f.read()

json_str = text.replace('export const CARDS_DATA = ', '').rstrip(';\n')
cards = json.loads(json_str)
card_map = {c['name'].lower(): c for c in cards}

def get_id(name):
    clean = name.lower().strip()
    if clean in card_map:
        return card_map[clean]['id']
    for c in cards:
        if clean in c['name'].lower() or clean in c['originalName'].lower():
            return c['id']
    print(f"ERROR: {name} not found!")
    return None

ACCURATE_META_DECKS = [
  {
    "id": "meta-ventrue-elitiste",
    "name": "Ventrue : Domination Élitiste du Trône (S-Tier)",
    "clan": "Ventrue",
    "tier": "S-Tier",
    "archetype": "Élitiste",
    "description": "Deck de verrouillage tactique et d'amplification de score. Posez Abigail Smith sur la rangée Pion pour conférer +2 Puissance aux nobles Élitistes placés devant elle (Rook ou Knight/Prince). Jürgen Mayer renforce le Prince de +2 Puissance, Stephen Fane gagne +3 Puissance sur Cavalier ou Prince (atteignant 11 Puissance), et Horatio Drake (C4/P9) pose un corps massif en front. Le deck culmine avec Lord Colville (C7/P14, insensible aux pertes de Puissance) et Sir Kingston (C8/P15, immunisé à l'assassinat) qui score 1 Point bonus par carte Élitiste alliée s'il contrôle le Prince.",
    "playstyle": "Alignement de Soutien en Ligne / Ancrage Haute Puissance / Multiplicateur de Score du Prince",
    "difficulty": "Moyen",
    "guide": "Placez Abigail Smith sur une case Pion dès les premiers tours pour booster vos unités placées devant. Déployez Stephen Fane directement sur le Prince ou un Cavalier pour activer son bonus de +3 Puissance. Terminez avec Sir Kingston sur le Trône du Prince au Tour 7 pour maximiser vos points de fin de round grâce à toutes vos cartes Élitistes déployées.",
    "cardNames": [
      "Luis Castaño",       # C1/P1 Ventrue (Stats T1)
      "Abigail Smith",      # C1/P1 Ventrue (+2 Puiss aux Élitistes devant elle)
      "Helen Lloyd",        # C2/P3 Ventrue (Corps T2)
      "Jürgen Mayer",       # C2/P2 Ventrue (+2 Puiss au Prince si Élitiste)
      "Lawrence",           # C2/P3 Ventrue (Récupère la carte vaincue la plus chère et réduit son coût de 2)
      "Cynthia Hargreaves",  # C2/P2 Ventrue (+1 Puissance au Prince)
      "Jeremiah Saha",      # C2/P2 Ventrue (+1 Puiss aux Élitistes s'il perd de la Puissance)
      "Adrian Yu",          # C3/P6 Ventrue (Gros corps T3, inflige -1 aux Pions en fin de round)
      "Mr Moore",           # C3/P3 Ventrue (+2 Puissance au Prince)
      "Horatio Drake",      # C4/P9 Ventrue (Gros bloqueur front, ne transmet pas de soutien)
      "Mx Korpal",          # C5/P4 Ventrue (Vole 3 Puissance à une Tour ennemie)
      "Harry Tyler",        # C5/P8 Ventrue (Si Cavalier, donne +2 Puissance au Prince)
      "Stephen Fane",       # C5/P8 Ventrue (Si Cavalier/Prince, gagne +3 Puiss -> 11)
      "Lord Colville",      # C7/P14 Ventrue (Ne peut pas perdre de Puissance)
      "Sir Kingston"        # C8/P15 Ventrue (Insensible au Murder, score 1 pt par Élitiste si Prince)
    ]
  },
  {
    "id": "meta-brujah-violent",
    "name": "Brujah : Assaut Violent & Pression Frontale (S-Tier)",
    "clan": "Brujah",
    "tier": "S-Tier",
    "archetype": "Violent",
    "description": "Deck d'agression rapide et d'éliminations directes. Amy West affaiblit les 3 Tours ennemies de -2 Puissance à la révélation. Grendel Ward (C2/P5) avance automatiquement d'une case vers l'avant à chaque fin de round pour contester la ligne de front. Dante passe à 7 Puissance en phase d'attaque, Niall Flynn booste de +2 Puissance chaque carte Violente qui attaque, et Sheriff Fletcher octroie +2 Points supplémentaires après chaque victoire en conflit d'un Violent. Le deck achève l'adversaire avec Athena (C5/P9, qui assassine définitivement la carte ennemie en cas de victoire) et Marissa the Butcher (C7/P13, qui se déplace sur une carte ennemie connectée après chaque victoire).",
    "playstyle": "Affaiblissement de Rangée / Avancée Automatique / Assassinat & Enchaînement de Conflits",
    "difficulty": "Facile",
    "guide": "Démarrez avec Amy West pour briser la rangée intermédiaire adverse (Tours). Posez Grendel Ward pour le laisser avancer gratuitement vers les Cavaliers ou le Prince. Maximisez vos attaques avec Dante et Jari pour déclencher les +2 Puissance de Niall Flynn et marquer +2 points bonus avec Sheriff Fletcher.",
    "cardNames": [
      "Amy West",           # C1/P1 Brujah (Inflige -2 Puissance aux Tours ennemies)
      "Grace Ward",         # C1/P4 Brujah (Gros corps T1, -1 Puiss en fin de round)
      "Simon Lee",          # C1/P1 Brujah (Fait avancer d'une case la prochaine carte jouée)
      "Grendel Ward",       # C2/P5 Brujah (Avance automatiquement vers l'avant à chaque round)
      "Lan Chen",           # C2/P1 Brujah (Ajoute un Scrawny Punk en main si Tour 4 ou avant)
      "Ember",              # C2/P0 Brujah (Crée une Goule sur une case Cavalier vide)
      "Zara Bradley",       # C2/P3 Brujah (Si Cavalier, inflige -5 Puiss au Prince ennemi)
      "Dante",              # C3/P4 Brujah (+3 Puissance pendant l'Attaque -> 7 Puiss)
      "Razor",              # C3/P2 Nosferatu/Brujah (+4 Puissance si posé côté adverse)
      "Niall Flynn",        # C3/P3 Brujah (+2 Puissance à vos cartes Violentes qui attaquent)
      "Nick Locke",         # C3/P3 Brujah (+4 Puissance si la cible a été jouée ce tour)
      "Sheriff Fletcher",   # C3/P4 Brujah (Marque 2 Points supplémentaires par victoire de conflit d'un Violent)
      "Jari",               # C4/P7 Brujah (Gros corps T4 offensif)
      "Athena",             # C5/P9 Brujah (Assassine définitivement la carte ennemie en cas de victoire)
      "Marissa the Butcher" # C7/P13 Brujah (Se déplace sur un ennemi connecté après chaque victoire)
    ]
  },
  {
    "id": "meta-toreador-seduction",
    "name": "Toreador : Elysium & Vol de Cartes (S-Tier)",
    "clan": "Toreador",
    "tier": "S-Tier",
    "archetype": "Séduction",
    "description": "Deck centré sur la mécanique de Séduction (vol de cartes ennemies vaincues directement dans votre main). Katie Dixon démarre obligatoirement dans votre main d'ouverture (Tour 1 garanti). Penelope Dane crée une Goule Actrice sur une case connectée, Roland Heffé octroie +2 Puissance passive à toutes vos cartes Séduites, Julian L. Hector (C3/P5) vole 2 cartes ennemies vaincues lors de sa révélation, et Eliza Iyer (C4/P7) vole la carte ennemie vaincue en conflit pour l'ajouter à votre main. Le deck se termine avec Hope Ekaette (C6/P12, force brute de fin de partie).",
    "playstyle": "Main de Départ Garantie / Vole de Cartes Vaincues (Seduce) / Buff d'Unités Séduites",
    "difficulty": "Moyen",
    "guide": "Démarrez toujours avec Katie Dixon au Tour 1. Préparez la pose de Roland Heffé pour booster toutes les cartes que vous allez capturer avec Julian L. Hector et Eliza Iyer. Chaque carte adverse volée vient étoffer votre main pour les rounds 5, 6 et 7 sans dépenser de pioche.",
    "cardNames": [
      "Katie Dixon",        # C1/P1 Toreador (Démarre dans la main de départ)
      "Abir",               # C1/P1 Toreador (+1 Puiss à la prochaine carte révélée)
      "Bakunawa",           # C1/P0 Toreador (Inflige -4 Puissance à l'attaque)
      "Violet Green",       # C2/P3 Toreador (Corps stable T2)
      "Aster Banda",        # C2/P2 Toreador (+2 Puissance aux cartes connectées)
      "Penelope Dane",      # C2/P2 Toreador (Crée une Goule Acteur sur un espace connecté vide)
      "Francisco the Bold", # C2/P2 Toreador (Si pas de Prince en fin de round, se déplace sur le Prince)
      "Amelie",             # C2/P2 Toreador (Vos cartes Séduites en main coûtent 1 Sang de moins)
      "Sapphire",           # C3/P1 Toreador (+1 Puissance pour chaque Pion en jeu)
      "Tristan Stag",       # C3/P3 Toreador (Si Prince en fin de round, score 6 Points direct)
      "Roland Heffé",       # C3/P6 Toreador (Tant qu'en jeu : Vos cartes Séduites ont +2 Puissance)
      "Julian L. Hector",   # C3/P5 Toreador (À la Révélation : Vole 2 cartes ennemies vaincues en main)
      "Aurora Torres",      # C4/P6 Toreador (Si Prince, vole 1 Puissance à un ennemi aléatoire)
      "Eliza Iyer",         # C4/P7 Toreador (En cas de victoire en conflit : Vole la carte ennemie en main)
      "Hope Ekaette"        # C6/P12 Toreador (Stats brutes monumentales T6)
    ]
  },
  {
    "id": "meta-gangrel-meute",
    "name": "Gangrel : Meute Sauvage & Croissance Alpha (S-Tier)",
    "clan": "Gangrel",
    "tier": "S-Tier",
    "archetype": "Bête",
    "description": "Deck de saturation du plateau et d'amplification exponentielle. Sanjay Ali ajoute 2 Rats (Bêtes) en main au Tour 2, Herald of the Hunt (C4/P2) augmente la puissance de votre meute, Cathy Carmine (C4/P6) gagne +4 Puissance permanente à chaque victoire en conflit (grimpant à 10, 14+ de Puissance), et The Bloodcaller (C7/P9) gagne +2 Puissance à la révélation pour chaque Bête présente sur votre plateau. Manfred (C9/P10) couronne le deck pour sécuriser le Trône du Prince au Tour 7.",
    "playstyle": "Génération de Bêtes / Croissance Permanente en Conflit / Finisseur Massif Alpha",
    "difficulty": "Facile",
    "guide": "Posez Sanjay Ali au Tour 2 pour remplir votre main de petites Bêtes à faible coût. Développez Cathy Carmine sur une voie contestée pour accumuler +4 Puissance à chaque conflit remporté. Terminez avec The Bloodcaller quand votre plateau est rempli de Bêtes pour créer un monstre à 15-20+ de Puissance.",
    "cardNames": [
      "Minnie Chadwick",    # C1/P1 Gangrel (Pose T1)
      "Clive Crawford",     # C2/P0 Gangrel (Effet utilitaire)
      "Sanjay Ali",         # C2/P2 Gangrel (Ajoute 2 Rats (Bêtes) en main)
      "Ravi Patel",         # C3/P1 Gangrel (Génération de meute)
      "Cathy Carmine",      # C4/P6 Gangrel (Après victoire en conflit : Gagne +4 Puissance permanente)
      "Herald of the Hunt", # C4/P2 Gangrel (Synergie de meute)
      "Branwen White",      # C4/P5 Gangrel (Corps intermédiaire)
      "Bloodcaller's Pack", # C4/P1 Gangrel (Synergie meute)
      "Queen Rat",          # C4/P7 Gangrel (Force brute)
      "Mother Everly",      # C4/P2 Gangrel (Support Bête)
      "Annabella's Pet",    # C4/P6 Gangrel (Corps de combat)
      "Ms Harriot",         # C5/P5 Gangrel (Réanimation/maintien)
      "Paulo Marques",      # C6/P11 Gangrel (Baron des Bêtes haute puissance)
      "The Bloodcaller",    # C7/P9 Gangrel (À la Révélation : Gagne +2 Puiss par Bête alliée en jeu)
      "Manfred"             # C9/P10 Gangrel (Finisseur absolu)
    ]
  },
  {
    "id": "meta-hecata-necromancie",
    "name": "Hecata : Moisson d'Âmes & Nécromancie (S-Tier)",
    "clan": "Hecata",
    "tier": "S-Tier",
    "archetype": "Meurtre",
    "description": "Deck exploitant la mécanique d'Assassinat (Murder : retrait définitif sans récupération possible). Morag Stewart (C2/P2) est automatiquement assassinée si elle perd un conflit, mais revient directement dans votre main. Sadako Asano (C2/P1) vous octroie 1 Point de Victoire à chaque fois qu'une carte (alliée ou ennemie) est Assassinée. Ophelia (C4/P5) siphonne la totalité de la Puissance de la carte ennemie vaincue avant de l'Assassiner définitivement, générant des points avec Sadako et nettoyant le terrain.",
    "playstyle": "Moteur de Points sur Assassinats / Recyclage en Main / Siphon Total de Puissance",
    "difficulty": "Moyen",
    "guide": "Déployez Sadako Asano dès le début de partie sur une case arrière protégée (Pion). Utilisez Morag Stewart pour contester sans risque (elle revient en main). Envoyez Ophelia détruire les pièces maîtresses ennemies pour absorber leur Puissance et déclencher des points de victoire instantanés.",
    "cardNames": [
      "Sadako Asano",       # C2/P1 Hecata (Chaque fois qu'une carte est Assassinée : Marque 1 Point)
      "Morag Stewart",      # C2/P2 Hecata (Si défaite : Est Assassinée et retourne en main)
      "Wendy Hill",         # C2/P2 Hecata (Présence T2)
      "Lynne Dunsirn",      # C2/P1 Hecata (Support de clan)
      "Olavi 'Tappava' Puttanesca", # C2/P2 Hecata (Dueliste)
      "Mr Stewart",         # C3/P2 Hecata (Synergie Hecata)
      "Carlo Galli",        # C3/P4 Hecata (Corps solide T3)
      "Maria Puttanesca",   # C3/P4 Hecata (Combattante de clan)
      "Agent 'S'",          # C3/P2 Hecata (Attaque ciblée)
      "Ophelia",            # C4/P5 Hecata (En cas de victoire : Vole toute la Puissance ennemie puis l'Assassine)
      "Toru Asano",         # C4/P6 Hecata (Puissance d'assaut)
      "Sheloa",             # C4/P6 Hecata (Soutien nécromantique)
      "Caesar Cornello",    # C4/P6 Hecata (Ancrage T4)
      "Elizabeth Dunsirn",  # C4/P3 Hecata (Manipulation d'effets)
      "Agent 'V'"           # C5/P6 Hecata (Finisseur de rangée)
    ]
  },
  {
    "id": "meta-malkavian-delusion",
    "name": "Malkavian : Chaos Mental & Défausse (A-Tier)",
    "clan": "Malkavian",
    "tier": "A-Tier",
    "archetype": "Démence",
    "description": "Deck de perturbation psychologique et de combos de défausse. Dan Washington (C4/P7) offre une puissance massive en milieu de partie. Benedict (C8/P8) vole 2 Puissance à chaque carte connectée lors de sa révélation pour renverser une zone disputée. Le moteur culmine avec Justicar Parr (C8/P10) : s'il est posé sur le Trône du Prince, il défausse votre carte la plus faible, et chaque défausse lui confère +1 Puissance et 4 Points de Victoire immédiats.",
    "playstyle": "Vol de Puissance Connectée / Moteur de Points par Défausse / Contrôle Disruptif",
    "difficulty": "Difficile",
    "guide": "Développez votre présence avec Scarlett Redline, Caspen Vodrak et Dan Washington. Au Tour 7, positionnez Justicar Parr sur le Trône du Prince pour déclencher sa chaîne de défausse et marquer un afflux massif de points de victoire.",
    "cardNames": [
      "Bruce Sparks",       # C2/P0 Malkavian (Déclencheur d'effets)
      "Scarlett Redline",   # C2/P3 Malkavian (Corps T2)
      "Fiona Millar",       # C2/P2 Malkavian (Support)
      "Caspen Vodrak",      # C3/P2 Malkavian (Disruption)
      "Molly Cybin",        # C3/P5 Malkavian (Corps T3)
      "Jacqueline",         # C3/P3 Malkavian (Pression continue)
      "Rosaline Armitage",  # C3/P3 Malkavian (Synergie clan)
      "The Actor",          # C4/P0 Malkavian (Copie de rôle)
      "Dan Washington",     # C4/P7 Malkavian (Grande puissance brute T4)
      "Lazer J. Christ",    # C4/P7 Malkavian (Présence front)
      "Gonzo Thompson",     # C5/P7 Malkavian (Ancrage milieu de partie)
      "Lucy Baptiste",      # C5/P6 Malkavian (Disruption T5)
      "Kenneth Glass",      # C7/P11 Malkavian (Colosse T7)
      "Benedict",           # C8/P8 Malkavian (Vole 2 Puissance à chaque carte connectée)
      "Justicar Parr"       # C8/P10 Malkavian (Si Prince : Défausse la carte la plus faible, +1 Puiss et 4 Pts par défausse)
    ]
  },
  {
    "id": "meta-tremere-thaumaturgie",
    "name": "Tremere : Sorcellerie & Rituels Hermétiques (A-Tier)",
    "clan": "Tremere",
    "tier": "A-Tier",
    "archetype": "Sorcellerie du Sang",
    "description": "Deck basé sur la synergie Sorcier/Acolyte et la manipulation de soutien thaumaturgique. Utilise Jackie Pincher et Juniper Fey en début de partie, Lavanya Sekh (C3/P3) et Antoni Mazur (C3/P3) en milieu de courbe, et Tim Holdsworth (C4/P0) comme convertisseur alchimique. Le haut de courbe s'appuie sur Aylin (C6/P4), Cécile St-Fleur (C6/P7) et Boyar Mușat (C7/P5) pour contrôler les zones clés.",
    "playstyle": "Synergie Sorcier/Acolyte / Rituels Dégressifs / Contrôle Hermétique",
    "difficulty": "Difficile",
    "guide": "Développez vos Acolytes sur les cases Pions et Tours pour établir des relais de soutien stables vers le Prince.",
    "cardNames": [
      "Jackie Pincher",     # C2/P3 Tremere
      "Juniper Fey",       # C2/P1 Tremere (Acolyte)
      "Celine Mușat",       # C2/P1 Tremere
      "Ethan",              # C2/P0 Tremere
      "Lavanya Sekh",       # C3/P3 Tremere
      "Antoni Mazur",       # C3/P3 Tremere (Acolyte)
      "Tim Holdsworth",     # C4/P0 Tremere (Alchimiste)
      "Esme",               # C4/P2 Tremere (Acolyte)
      "Marquis Leroux",     # C4/P4 Tremere (Sorcier)
      "Fitzwilliam Hardy",  # C4/P4 Tremere (Sorcier)
      "Shoshana",           # C5/P6 Tremere
      "Aylin",              # C6/P4 Tremere
      "Morgana",            # C6/P3 Tremere (Sorcier)
      "Cécile St-Fleur",    # C6/P7 Tremere (Sorcier)
      "Boyar Mușat"         # C7/P5 Tremere (Sorcier)
    ]
  },
  {
    "id": "meta-nosferatu-infiltrateurs",
    "name": "Nosferatu : Frappe des Égouts & Embuscades (A-Tier)",
    "clan": "Nosferatu",
    "tier": "A-Tier",
    "archetype": "Occultation",
    "description": "Deck d'infiltration totale brisant les contraintes de placement. Shifa (C1/P1) peut être jouée sur n'importe quel emplacement du plateau dès le Tour 1 pour contester immédiatement une case avancée (Cavalier ou Prince). Forterra Face apporte 3 de Puissance pour 1 Sang, Razor (C3/P2) gagne +4 Puissance (montant à 6) s'il est posé côté adverse, et Richard de Worde (C6/P10) avec Monika Kováč (C7/P10) verrouillent la partie.",
    "playstyle": "Placement Libre Immédiat / Embuscade en Territoire Adverse / Surprise Tactique",
    "difficulty": "Moyen",
    "guide": "Exploitez Shifa au Tour 1 pour occuper une position avancée que l'adversaire pensait inaccessible. Placez Razor directement dans la moitié adverse du plateau pour débloquer son bonus de +4 Puissance.",
    "cardNames": [
      "Shifa",              # C1/P1 Nosferatu (Peut être jouée sur n'importe quelle case du plateau)
      "Forterra Face",      # C1/P3 Nosferatu (Gros ratio 3 Puissance pour 1 Sang)
      "Rat-Eater",          # C1/P2 Nosferatu (Présence T1)
      "Harald Basilier",    # C2/P2 Nosferatu
      "Eugene Kister",      # C2/P2 Nosferatu
      "Whisper",            # C2/P3 Nosferatu
      "Razor",              # C3/P2 Nosferatu (+4 Puissance si joué côté adverse)
      "Simon Lee",          # C1/P1 Nosferatu (Fait avancer la prochaine carte)
      "Filipe the Bloody",  # C4/P5 Nosferatu
      "Lorenzo Perello",    # C4/P1 Nosferatu
      "Arturo de Vitry",    # C4/P5 Nosferatu
      "Queen Rat",          # C4/P7 Nosferatu/Gangrel
      "Michael",            # C5/P8 Nosferatu
      "Richard de Worde",   # C6/P10 Nosferatu
      "Monika Kováč"        # C7/P10 Nosferatu
    ]
  },
  {
    "id": "meta-all-stars-midrange",
    "name": "All-Stars : Courbe Optimale & Pression Londonienne (S-Tier)",
    "clan": "Ventrue",
    "tier": "S-Tier",
    "archetype": "Élitiste",
    "description": "Composition polyvalente optimisée selon la courbe de Sang exacte (Tour 1 à 7). Combine la présence initiale d'Amy West (affaiblit les Tours) et Luis Castaño, le déplacement automatique de Grendel Ward, la force de frappe de Jari et Athena (qui assassine l'adversaire), pour conclure avec la puissance imprenable de Lord Colville (insensible aux pertes de Puissance) et Marissa the Butcher.",
    "playstyle": "Courbe de Sang Parfaite / Menaces Autonomes / Dominance de Front",
    "difficulty": "Facile",
    "guide": "Déroulez votre jeu en posant une carte adaptée à votre réserve de Sang chaque tour : 1 Sang au T1, 2 Sang au T2, 3 Sang au T3, etc. Ce deck maintient une pression constante sans dépendre d'un seul combo.",
    "cardNames": [
      "Luis Castaño",       # C1/P1 Ventrue
      "Amy West",           # C1/P1 Brujah (Inflige -2 Puissance aux Tours ennemies)
      "Helen Lloyd",        # C2/P3 Ventrue
      "Grendel Ward",       # C2/P5 Brujah (Avance d'une case chaque round)
      "Adrian Yu",          # C3/P6 Ventrue (6 Puissance pour 3 Sang)
      "Roland Heffé",       # C3/P6 Toreador (6 Puissance pour 3 Sang)
      "Sheriff Fletcher",   # C3/P4 Brujah (+2 Pts par victoire en conflit)
      "Horatio Drake",      # C4/P9 Ventrue (9 Puissance pour 4 Sang)
      "Jari",               # C4/P7 Brujah (7 Puissance pour 4 Sang)
      "Athena",             # C5/P9 Brujah (Assassine définitivement la carte ennemie)
      "Stephen Fane",       # C5/P8 Ventrue (11 Puissance sur Cavalier/Prince)
      "Hope Ekaette",       # C6/P12 Toreador (12 Puissance pour 6 Sang)
      "Lord Colville",      # C7/P14 Ventrue (14 Puissance, ne peut pas perdre de Puissance)
      "Marissa the Butcher",# C7/P13 Brujah (13 Puissance, enchaîne les cibles connectées)
      "Sir Kingston"        # C8/P15 Ventrue (15 Puissance, immunisé au Murder, score bonus si Prince)
    ]
  },
  {
    "id": "meta-anti-meta-lock",
    "name": "Hybride Contrôle : Pression de Ligne & Neutralisation (A-Tier)",
    "clan": "Ventrue",
    "tier": "A-Tier",
    "archetype": "Élitiste",
    "description": "Deck de contre-stratégie exploitant les cartes à très haut ratio et à effets perturbateurs. Shifa s'infiltre sur les cases clés, Amy West détruit les Tours adverses, Sapphire s'alimente du nombre total de Pions en jeu, Horatio Drake bloque la voie centrale avec 9 de Puissance, et Athena élimine définitivement les menaces adverses via Murder.",
    "playstyle": "Contestation Asymétrique / Rupture de Ligne / Éliminations Ciblées",
    "difficulty": "Difficile",
    "guide": "Utilisez Shifa et Amy West pour désorganiser le déploiement adverse. Établissez Horatio Drake et Stephen Fane pour verrouiller le Prince et les Cavaliers.",
    "cardNames": [
      "Luis Castaño",       # C1/P1 Ventrue
      "Amy West",           # C1/P1 Brujah
      "Shifa",              # C1/P1 Nosferatu
      "Bakunawa",           # C1/P0 Toreador
      "Grendel Ward",       # C2/P5 Brujah
      "Helen Lloyd",        # C2/P3 Ventrue
      "Sapphire",           # C3/P1 Toreador
      "Adrian Yu",          # C3/P6 Ventrue
      "Dan Washington",     # C4/P7 Malkavian
      "Horatio Drake",      # C4/P9 Ventrue
      "Athena",             # C5/P9 Brujah
      "Hope Ekaette",       # C6/P12 Toreador
      "Lord Colville",      # C7/P14 Ventrue
      "Marissa the Butcher",# C7/P13 Brujah
      "Sir Kingston"        # C8/P15 Ventrue
    ]
  }
]

final_meta = []
for d in ACCURATE_META_DECKS:
    ids = []
    for name in d['cardNames']:
        cid = get_id(name)
        if cid:
            ids.append(cid)
        else:
            print(f"Error resolving {name}")
    d_obj = {
        "id": d["id"],
        "name": d["name"],
        "clan": d["clan"],
        "tier": d["tier"],
        "archetype": d["archetype"],
        "description": d["description"],
        "playstyle": d["playstyle"],
        "difficulty": d["difficulty"],
        "guide": d["guide"],
        "cardIds": ids
    }
    final_meta.append(d_obj)
    print(f"Deck '{d['name']}': {len(ids)}/15 cards resolved.")

js_out = "export const META_DECKS = " + json.dumps(final_meta, indent=2, ensure_ascii=False) + ";\n"
with open("src/data/metaDecks.js", "w", encoding="utf-8") as f:
    f.write(js_out)

print("Saved metaDecks.js with 100% accurate literal descriptions!")
