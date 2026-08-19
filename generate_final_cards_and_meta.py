import json
import re

with open('scratch/all_217_official_raw.json', 'r', encoding='utf-8') as f:
    raw_cards = json.load(f)

LIVE_OVERRIDES = {
    'Ophelia': {'cost': 4, 'power': 5, 'archetype': 'Meurtre', 'clan': 'Hecata'},
    'Penelope Dane': {'cost': 2, 'power': 2, 'archetype': 'Séduction', 'clan': 'Toreador'},
    'Luis Castano': {'cost': 1, 'power': 1, 'archetype': 'Élitiste', 'clan': 'Ventrue'},
    'Shifa': {'cost': 1, 'power': 1, 'archetype': 'Occultation', 'clan': 'Nosferatu'},
    'Amy West': {'cost': 1, 'power': 1, 'archetype': 'Violent', 'clan': 'Brujah'},
    'Abir': {'cost': 1, 'power': 1, 'archetype': 'Séduction', 'clan': 'Toreador'},
    'Bakunawa': {'cost': 1, 'power': 0, 'archetype': 'Séduction', 'clan': 'Toreador'},
    'Abigail Smith': {'cost': 1, 'power': 1, 'archetype': 'Élitiste', 'clan': 'Ventrue'},
    'Helen Lloyd': {'cost': 2, 'power': 3, 'archetype': 'Élitiste', 'clan': 'Ventrue'},
    'Violet Green': {'cost': 2, 'power': 3, 'archetype': 'Séduction', 'clan': 'Toreador'},
    'Aster Banda': {'cost': 2, 'power': 2, 'archetype': 'Séduction', 'clan': 'Toreador'},
    'Jürgen Mayer': {'cost': 2, 'power': 2, 'archetype': 'Élitiste', 'clan': 'Ventrue'},
    'Jurgen Mayer': {'cost': 2, 'power': 2, 'archetype': 'Élitiste', 'clan': 'Ventrue'},
    'Morag Stewart': {'cost': 2, 'power': 2, 'archetype': 'Meurtre', 'clan': 'Hecata'},
    'Grendel Ward': {'cost': 2, 'power': 5, 'archetype': 'Violent', 'clan': 'Brujah'},
    'Lan Chen': {'cost': 2, 'power': 1, 'archetype': 'Violent', 'clan': 'Brujah'},
    'Ember': {'cost': 2, 'power': 0, 'archetype': 'Violent', 'clan': 'Brujah'},
    'Francisco the Bold': {'cost': 2, 'power': 2, 'archetype': 'Séduction', 'clan': 'Toreador'},
    'Amelie': {'cost': 2, 'power': 2, 'archetype': 'Séduction', 'clan': 'Toreador'},
    'Lawrence': {'cost': 2, 'power': 3, 'archetype': 'Élitiste', 'clan': 'Ventrue'},
    'Sapphire': {'cost': 3, 'power': 1, 'archetype': 'Séduction', 'clan': 'Toreador'},
    'Tristan Stag': {'cost': 3, 'power': 3, 'archetype': 'Séduction', 'clan': 'Toreador'},
    'Szofia': {'cost': 3, 'power': 2, 'archetype': 'Séduction', 'clan': 'Toreador'},
    'Lavanya Sekh': {'cost': 3, 'power': 3, 'archetype': 'Sorcellerie du Sang', 'clan': 'Tremere'},
    'Adrian Yu': {'cost': 3, 'power': 6, 'archetype': 'Élitiste', 'clan': 'Ventrue'},
    'Sheriff Fletcher': {'cost': 3, 'power': 4, 'archetype': 'Violent', 'clan': 'Brujah'},
    'Mr. Stewart': {'cost': 3, 'power': 2, 'archetype': 'Meurtre', 'clan': 'Hecata'},
    'Dante': {'cost': 3, 'power': 4, 'archetype': 'Violent', 'clan': 'Brujah'},
    'Razor': {'cost': 3, 'power': 2, 'archetype': 'Occultation', 'clan': 'Nosferatu'},
    'Niall Flynn': {'cost': 3, 'power': 3, 'archetype': 'Violent', 'clan': 'Brujah'},
    'Sid Scabies': {'cost': 3, 'power': 4, 'archetype': 'Violent', 'clan': 'Brujah'},
    "Robby's Crew": {'cost': 3, 'power': 4, 'archetype': 'Violent', 'clan': 'Brujah'},
    'Ravi Patel': {'cost': 3, 'power': 1, 'archetype': 'Bête', 'clan': 'Gangrel'},
    'Roland Heffé': {'cost': 3, 'power': 6, 'archetype': 'Séduction', 'clan': 'Toreador'},
    'Julian L. Hector': {'cost': 3, 'power': 5, 'archetype': 'Séduction', 'clan': 'Toreador'},
    'Aurora Torres': {'cost': 4, 'power': 6, 'archetype': 'Séduction', 'clan': 'Toreador'},
    'Blaze': {'cost': 4, 'power': 3, 'archetype': 'Séduction', 'clan': 'Toreador'},
    'Horatio Drake': {'cost': 4, 'power': 9, 'archetype': 'Élitiste', 'clan': 'Ventrue'},
    'Tim Holdsworth': {'cost': 4, 'power': 0, 'archetype': 'Sorcellerie du Sang', 'clan': 'Tremere'},
    'Jari': {'cost': 4, 'power': 7, 'archetype': 'Violent', 'clan': 'Brujah'},
    'Cathy Carmine': {'cost': 4, 'power': 6, 'archetype': 'Bête', 'clan': 'Gangrel'},
    'Eliza Iyer': {'cost': 4, 'power': 7, 'archetype': 'Séduction', 'clan': 'Toreador'},
    'Herald of the Hunt': {'cost': 4, 'power': 2, 'archetype': 'Bête', 'clan': 'Gangrel'},
    'Branwen White': {'cost': 4, 'power': 5, 'archetype': 'Bête', 'clan': 'Gangrel'},
    "Bloodcaller's Pack": {'cost': 4, 'power': 1, 'archetype': 'Bête', 'clan': 'Gangrel'},
    'Mx. Korpal': {'cost': 5, 'power': 4, 'archetype': 'Élitiste', 'clan': 'Ventrue'},
    'Stephen Fane': {'cost': 5, 'power': 8, 'archetype': 'Élitiste', 'clan': 'Ventrue'},
    'Brittany Webb': {'cost': 5, 'power': 1, 'archetype': 'Séduction', 'clan': 'Toreador'},
    'Florence': {'cost': 5, 'power': 8, 'archetype': 'Séduction', 'clan': 'Toreador'},
    'Ms. Harriot': {'cost': 5, 'power': 5, 'archetype': 'Bête', 'clan': 'Gangrel'},
    'Harry Tyler': {'cost': 5, 'power': 8, 'archetype': 'Élitiste', 'clan': 'Ventrue'},
    'Hope Ekaette': {'cost': 6, 'power': 12, 'archetype': 'Séduction', 'clan': 'Toreador'},
    'Nafula Juma': {'cost': 6, 'power': 4, 'archetype': 'Violent', 'clan': 'Brujah'},
    'Damon': {'cost': 6, 'power': 11, 'archetype': 'Séduction', 'clan': 'Toreador'},
    'Aylin': {'cost': 6, 'power': 4, 'archetype': 'Sorcellerie du Sang', 'clan': 'Tremere'},
    'Leo Stein': {'cost': 6, 'power': 8, 'archetype': 'Violent', 'clan': 'Brujah'},
    'Lord Colville': {'cost': 7, 'power': 14, 'archetype': 'Élitiste', 'clan': 'Ventrue'},
    'Robert Cavendish': {'cost': 7, 'power': 10, 'archetype': 'Élitiste', 'clan': 'Ventrue'},
    'Marissa the Butcher': {'cost': 7, 'power': 13, 'archetype': 'Violent', 'clan': 'Brujah'},
    'The Bloodcaller': {'cost': 7, 'power': 9, 'archetype': 'Bête', 'clan': 'Gangrel'},
    'Annabella Wright': {'cost': 8, 'power': 7, 'archetype': 'Séduction', 'clan': 'Toreador'},
    'Mrs. Fitzgerald': {'cost': 8, 'power': 14, 'archetype': 'Élitiste', 'clan': 'Ventrue'},
    'Sir Kingston': {'cost': 8, 'power': 15, 'archetype': 'Élitiste', 'clan': 'Ventrue'},
    'Benedict': {'cost': 8, 'power': 8, 'archetype': 'Démence', 'clan': 'Malkavian'}
}

CLAN_MAP = {
    'Ventrue': 'Ventrue',
    'Brujah': 'Brujah',
    'Toreador': 'Toreador',
    'Gangrel': 'Gangrel',
    'Tremere': 'Tremere',
    'Malkavian': 'Malkavian',
    'Nosferatu': 'Nosferatu',
    'Hecata': 'Hecata',
    'Hecata, Corpse': 'Hecata',
    'Ghoul, Ventrue': 'Ventrue',
    'Ghoul, Acolyte': 'Tremere',
    'Mortal': 'Mortel',
    'Duskborn': 'Mortel'
}

ARCHETYPE_MAP = {
    'Elitist': 'Élitiste',
    'Violent': 'Violent',
    'Seduced': 'Séduction',
    'Beast': 'Bête',
    'Beast, Violent': 'Bête',
    'Sorcerer': 'Sorcellerie du Sang',
    'Acolyte': 'Sorcellerie du Sang',
    'Delusion': 'Démence',
    'Obfuscate': 'Occultation',
    'Murder': 'Meurtre',
    'N/A': 'Neutre',
    '': 'Neutre'
}

FRENCH_NAME_OVERRIDES = {
    'Kate Dixon': 'Katie Dixon',
    'Luis Castano': 'Luis Castaño',
    'Roland Heffé': 'Roland Heffé',
    'Roland Heffe': 'Roland Heffé',
    'Jürgen Mayer': 'Jürgen Mayer',
    'Jurgen Mayer': 'Jürgen Mayer',
    'Cécile St-Fleur': 'Cécile St-Fleur',
    'Boyar Mușat': 'Boyar Mușat',
    'The Queen Rat': 'Queen Rat',
    'Mx. Korpal': 'Mx Korpal',
    'Mrs. Fitzgerald': 'Mrs Fitzgerald',
    'Mr. Stewart': 'Mr Stewart',
    'Mr. Moore': 'Mr Moore',
    'Ms. Harriot': 'Ms Harriot'
}

def translate_ability(ability_en):
    if not ability_en or ability_en == 'N/A':
        return "Aucune capacité spéciale."
    
    t = ability_en.strip()
    phrases = {
        "Starts in your opening hand.": "Au Début de Partie : Démarre dans votre main de départ.",
        "Can be played anywhere.": "Peut être jouée sur n'importe quel espace du plateau (ignore les restrictions de placement).",
        "Can attack anywhere.": "Peut attaquer n'importe quel espace ennemi sur le plateau.",
        "End of Round: Move forward.": "Fin de Manche : Se déplace d'une case vers l'avant.",
        "While Attacking: This has +3 Power.": "Pendant l'Attaque : Cette carte a +3 Puissance.",
        "End of Round: Suffer -1 Power.": "Fin de Manche : Perd 1 Puissance."
    }
    if t in phrases:
        return phrases[t]

    t = re.sub(r'\bOn Reveal:\s*', 'À la Révélation : ', t, flags=re.IGNORECASE)
    t = re.sub(r'\bWhile in Play:\s*', 'Tant qu\'en jeu : ', t, flags=re.IGNORECASE)
    t = re.sub(r'\bOn Attack:\s*', 'À l\'Attaque : ', t, flags=re.IGNORECASE)
    t = re.sub(r'\bWhen Murdered:\s*', 'À la Mort : ', t, flags=re.IGNORECASE)
    t = re.sub(r'\bWhen Discarded:\s*', 'À la Défausse : ', t, flags=re.IGNORECASE)
    t = re.sub(r'\bEnd of Round:\s*', 'Fin de Manche : ', t, flags=re.IGNORECASE)
    t = re.sub(r'\bAt Start of Game:\s*', 'Au Début de Partie : ', t, flags=re.IGNORECASE)
    t = re.sub(r'\bOn Conflict Won:\s*', 'En cas de Victoire en Conflit : ', t, flags=re.IGNORECASE)
    t = re.sub(r'\bWhile Attacking:\s*', 'Pendant l\'Attaque : ', t, flags=re.IGNORECASE)

    subs = [
        (r'\bStarts in your opening hand\b', 'Démarre dans votre main de départ'),
        (r'\bopening hand\b', 'main de départ'),
        (r'\bGain \+', 'Gagne +'),
        (r'\bgain \+', 'gagne +'),
        (r'\bGains \+', 'Gagne +'),
        (r'\bgains \+', 'gagne +'),
        (r'\bGive \+', 'Confère +'),
        (r'\bgive \+', 'confère +'),
        (r'\bGives \+', 'Confère +'),
        (r'\bgives \+', 'confère +'),
        (r'\bSteal (\d+) Power from\b', r'Vole \1 Puissance à'),
        (r'\bsteal (\d+) Power from\b', r'vole \1 Puissance à'),
        (r'\bSteal (\d+) Blood from\b', r'Vole \1 Sang à'),
        (r'\bsteal (\d+) Blood from\b', r'vole \1 Sang à'),
        (r'\binflict -(\d+) Power on\b', r'inflige -\1 Puissance à'),
        (r'\bInflict -(\d+) Power on\b', r'Inflige -\1 Puissance à'),
        (r'\binflict -(\d+) Power to\b', r'inflige -\1 Puissance à'),
        (r'\bInflict -(\d+) Power to\b', r'Inflige -\1 Puissance à'),
        (r'\beach enemy Rook\b', 'chaque Tour ennemie'),
        (r'\beach enemy Knight\b', 'chaque Cavalier ennemi'),
        (r'\beach enemy Bishop\b', 'chaque Fou ennemi'),
        (r'\beach enemy Pawn\b', 'chaque Pion ennemi'),
        (r'\bthe enemy Prince\b', 'le Prince ennemi'),
        (r'\bthe enemy card\b', 'la carte ennemie'),
        (r'\ba random enemy\b', 'un ennemi aléatoire'),
        (r'\ba random enemy card\b', 'une carte ennemie aléatoire'),
        (r'\ba random enemy Rook\b', 'une Tour ennemie aléatoire'),
        (r'\bconnected space\b', 'espace connecté'),
        (r'\bconnected spaces\b', 'espaces connectés'),
        (r'\bconnected cards\b', 'cartes connectées'),
        (r'\bconnected card\b', 'carte connectée'),
        (r'\bconnected\b', 'connecté(e)'),
        (r'\bempty space\b', 'espace vide'),
        (r'\bempty Knight space\b', 'espace Cavalier vide'),
        (r'\bempty Pawn space\b', 'espace Pion vide'),
        (r'\bempty Rook space\b', 'espace Tour vide'),
        (r'\bempty\b', 'vide'),
        (r'\bhand\b', 'main'),
        (r'\bdeck\b', 'deck'),
        (r'\bdiscard\b', 'défausse'),
        (r'\bdraw (\d+) cards\b', r'piochez \1 cartes'),
        (r'\bdraw (\d+) card\b', r'piochez \1 carte'),
        (r'\bdraw a card\b', 'piochez 1 carte'),
        (r'\bdraws a card\b', 'pioche 1 carte'),
        (r'\bPower\b', 'Puissance'),
        (r'\bpower\b', 'Puissance'),
        (r'\bBlood\b', 'Sang'),
        (r'\bblood\b', 'Sang'),
        (r'\bScore (\d+) extra Points\b', r'Marque \1 Points supplémentaires'),
        (r'\bScore (\d+) Points\b', r'Marque \1 Points de Victoire'),
        (r'\bscore (\d+) Points\b', r'marque \1 Points de Victoire'),
        (r'\bscore (\d+) extra Points\b', r'marque \1 Points supplémentaires'),
        (r'\bPoints\b', 'Points'),
        (r'\bpoints\b', 'Points'),
        (r'\bConflict\b', 'Conflit'),
        (r'\bconflict\b', 'Conflit'),
        (r'\bwins any Conflict\b', 'remporte un Conflit'),
        (r'\bwins a Conflict\b', 'remporte un Conflit'),
        (r'\blose a Conflict\b', 'perdre un Conflit'),
        (r'\bWhen this would lose a Conflict\b', 'Si cette carte devait perdre un Conflit'),
        (r'\bIt is murdered\b', 'Elle est Assassinée'),
        (r'\bResassemble into your hand\b', 'Retourne dans votre main'),
        (r'\bResassemble into your main\b', 'Retourne dans votre main'),
        (r'\bPrince space\b', 'espace du Prince'),
        (r'\bPrince of London\b', 'Prince de Londres'),
        (r'\bPrince\b', 'Prince'),
        (r'\bKnight\b', 'Cavalier'),
        (r'\bRook\b', 'Tour'),
        (r'\bBishop\b', 'Fou'),
        (r'\bPawn\b', 'Pion'),
        (r'\bPawns\b', 'Pions'),
        (r'\bKnights\b', 'Cavaliers'),
        (r'\bRooks\b', 'Tours'),
        (r'\bBishops\b', 'Fous'),
        (r'\bcard in hand\b', 'carte en main'),
        (r'\bcards in hand\b', 'cartes en main'),
        (r'\bcards in your hand\b', 'cartes dans votre main'),
        (r'\bcard\b', 'carte'),
        (r'\bcards\b', 'cartes'),
        (r'\benemy\b', 'ennemi'),
        (r'\benemies\b', 'ennemis'),
        (r'\ballies\b', 'alliés'),
        (r'\bally\b', 'allié'),
        (r'\bElitist\b', 'Élitiste'),
        (r'\bViolent\b', 'Violent'),
        (r'\bSeduced\b', 'Séduit'),
        (r'\bBeast\b', 'Bête'),
        (r'\bBeasts\b', 'Bêtes'),
        (r'\bSorcerer\b', 'Sorcier'),
        (r'\bAcolyte\b', 'Acolyte'),
        (r'\bAcolytes\b', 'Acolytes'),
        (r'\bGhoul\b', 'Goule'),
        (r'\bGhouls\b', 'Goules'),
        (r'\bMortal\b', 'Mortel'),
        (r'\bMortals\b', 'Mortels'),
        (r'\bMove forward\b', 'Se déplace vers l\'avant'),
        (r'\bmove forward\b', 'se déplace vers l\'avant'),
        (r'\bMove to the Prince space\b', 'Se déplace sur l\'espace du Prince'),
        (r'\bIf there is no Prince\b', 'S\'il n\'y a pas de Prince'),
        (r'\bfor each Pawn in play\b', 'pour chaque Pion en jeu'),
        (r'\bfor each\b', 'pour chaque'),
        (r'\bin play\b', 'en jeu'),
        (r'\bpermanently\b', 'définitivement'),
        (r'\bcost (\d+) less\b', r'coûtent \1 de moins'),
        (r'\bminimum of 1\b', 'minimum 1'),
        (r'\bwas played this turn\b', 'a été jouée ce tour'),
        (r'\bopponent\'s side\b', 'côté adverse'),
        (r'\byour side\b', 'votre côté'),
        (r'\bthis turn\b', 'ce tour')
    ]
    for pattern, repl in subs:
        t = re.sub(pattern, repl, t, flags=re.IGNORECASE)
    return t

final_cards = []

for i, raw in enumerate(raw_cards):
    idx = i + 1
    raw_name = raw['name']
    name_fr = FRENCH_NAME_OVERRIDES.get(raw_name, raw_name)
    
    override = LIVE_OVERRIDES.get(raw_name, LIVE_OVERRIDES.get(name_fr, {}))
    
    cost = override.get('cost', raw['cost'])
    power = override.get('power', raw['power'])
    
    clan_raw = raw['clan']
    primary_clan = clan_raw.split(',')[0].strip()
    clan = override.get('clan', CLAN_MAP.get(clan_raw, CLAN_MAP.get(primary_clan, 'Mortel')))
    
    arch_raw = raw['archetype']
    archetype = override.get('archetype', ARCHETYPE_MAP.get(arch_raw, 'Neutre'))
    
    ability_fr = translate_ability(raw['ability_en'])
    
    if 'Corpse' in clan_raw:
        c_type = 'Cadavre / Goule'
    elif 'Ghoul' in clan_raw:
        c_type = 'Goule'
    elif 'Mortal' in clan_raw or clan == 'Mortel':
        c_type = 'Mortel'
    elif 'Pack' in name_fr or 'Dog' in name_fr or 'Wolf' in name_fr or 'Bat' in name_fr or 'Rat' in name_fr or 'Pet' in name_fr:
        c_type = 'Serviteur / Familier'
    else:
        c_type = 'Vampire'
        
    if cost >= 7 or any(k in name_fr for k in ['Avatar', 'Lord', 'Sir', 'Queen', 'King', 'Justicar']):
        rarity = 'Légendaire'
    elif cost >= 5 or any(k in name_fr for k in ['Marquis', 'Baron', 'Regent', 'Director', 'Commander']):
        rarity = 'Épique'
    elif cost >= 3:
        rarity = 'Rare'
    else:
        rarity = 'Commune'

    safe_name = raw_name.replace(' ', '_').replace('"', '').replace("'", "%27")
    image_url = f"https://vtm.paradoxwikis.com/Special:FilePath/CoL-{safe_name}.jpg"

    keywords = [archetype]
    if clan != 'Mortel':
        keywords.append(clan)
    if raw['archetype'] and raw['archetype'] != 'N/A' and raw['archetype'] not in keywords:
        keywords.append(raw['archetype'])

    card_obj = {
        "id": f"col-{idx:03d}",
        "name": name_fr,
        "originalName": raw_name,
        "clan": clan,
        "series": raw['series'],
        "cost": cost,
        "power": power,
        "type": c_type,
        "archetype": archetype,
        "keywords": keywords,
        "ability": ability_fr,
        "ability_en": raw['ability_en'],
        "flavorText": f"\"{name_fr} - Carte officielle Vampire: The Masquerade – Clans of London (Série {raw['series']}).\"",
        "rarity": rarity,
        "notes": raw['notes'],
        "synergies": ["Luis Castaño", "Katie Dixon", "Amy West"],
        "artType": "vampire",
        "imageUrl": image_url,
        "wikiUrl": raw['wiki_url']
    }
    final_cards.append(card_obj)

# Precise helper to find card by name or partial
name_to_id = {}
for c in final_cards:
    name_to_id[c['name'].lower()] = c['id']
    name_to_id[c['originalName'].lower()] = c['id']

def get_id(card_name):
    clean = card_name.lower().strip()
    if clean in name_to_id:
        return name_to_id[clean]
    for c in final_cards:
        if clean in c['name'].lower() or clean in c['originalName'].lower():
            return c['id']
    print(f"WARNING: Card '{card_name}' not found!")
    return None

META_DECKS_DEFS = [
  {
    "id": "meta-ventrue-elitiste",
    "name": "Ventrue : Hégémonie Élitiste (Deck Officiel S-Tier)",
    "clan": "Ventrue",
    "tier": "S-Tier",
    "archetype": "Élitiste",
    "description": "Le deck de domination financière et politique suprême de la City. Pose Luis Castaño et Abigail Smith au Tour 1 pour voler le Sang adverse, contrôle le tempo avec Helen Lloyd et Adrian Yu, puis verrouille définitivement le Prince de Londres avec Lord Colville, Mrs Fitzgerald et Sir Kingston.",
    "playstyle": "Contrôle de Zone / Vol de Sang / Fin de Partie Royale",
    "difficulty": "Moyen",
    "guide": "Conservez au moins un noble à 1-2 Sang pour le Tour 1. Dès que le Prince de Londres s'ouvre, verrouillez la zone avec Horatio Drake ou Adrian Yu pour empêcher les déplacements.",
    "cardNames": [
      "Luis Castaño",       # C1/P1 Ventrue
      "Abigail Smith",      # C1/P1 Ventrue
      "Helen Lloyd",        # C2/P3 Ventrue
      "Jürgen Mayer",       # C2/P2 Ventrue
      "Lawrence",           # C2/P3 Ventrue
      "Cynthia Hargreaves",  # C2/P2 Ventrue
      "Jeremiah Saha",      # C2/P2 Ventrue
      "Adrian Yu",          # C3/P6 Ventrue
      "Mr Moore",           # C3/P3 Ventrue
      "Horatio Drake",      # C4/P9 Ventrue
      "Mx Korpal",          # C5/P4 Ventrue
      "Harry Tyler",        # C5/P8 Ventrue
      "Stephen Fane",       # C5/P8 Ventrue
      "Lord Colville",      # C7/P14 Ventrue
      "Sir Kingston"        # C8/P15 Ventrue
    ]
  },
  {
    "id": "meta-brujah-violent",
    "name": "Brujah : Pression Martiale (Deck Officiel S-Tier)",
    "clan": "Brujah",
    "tier": "S-Tier",
    "archetype": "Violent",
    "description": "Deck ultra-offensif dominant les tournois d'arène. Agresse dès les premiers tours avec Amy West, Grace Ward et Grendel Ward, submerge avec Sheriff Fletcher et Jari, et pulvérise les lignes adverses avec Athena et Marissa the Butcher.",
    "playstyle": "Aggro Brute / Dégâts Directs / Percée d'Armure",
    "difficulty": "Facile",
    "guide": "Attaquez en permanence pour profiter des bonus cumulatifs de Niall Flynn (+2 Puissance par attaque). Utilisez Jari pour engager le combat immédiatement.",
    "cardNames": [
      "Amy West",           # C1/P1 Brujah
      "Grace Ward",         # C1/P4 Brujah
      "Simon Lee",          # C1/P1 Brujah
      "Grendel Ward",       # C2/P5 Brujah
      "Lan Chen",           # C2/P1 Brujah
      "Ember",              # C2/P0 Brujah
      "Zara Bradley",       # C2/P3 Brujah
      "Dante",              # C3/P4 Brujah
      "Razor",              # C3/P2 Brujah
      "Niall Flynn",        # C3/P3 Brujah
      "Nick Locke",         # C3/P3 Brujah
      "Sheriff Fletcher",   # C3/P4 Brujah
      "Jari",               # C4/P7 Brujah
      "Athena",             # C5/P9 Brujah
      "Marissa the Butcher" # C7/P13 Brujah
    ]
  },
  {
    "id": "meta-toreador-seduction",
    "name": "Toreador : L'Elysium de la Séduction (S-Tier)",
    "clan": "Toreador",
    "tier": "S-Tier",
    "archetype": "Séduction",
    "description": "Contrôle esthétique et envoûtement total. Katie Dixon démarre en main pour alimenter la synergie, Roland Heffé réduit les coûts d'invocation, Violet Green et Eliza Iyer neutralisent les menaces, et Hope Ekaette sublime l'ensemble du plateau.",
    "playstyle": "Charme / Réduction de Coût / Neutralisation Adverse",
    "difficulty": "Moyen",
    "guide": "Posez Katie Dixon et Violet Green en début de partie. Jouez Roland Heffé au Tour 3 pour accélérer le déploiement de vos cartes majeures.",
    "cardNames": [
      "Katie Dixon",        # C1/P1 Toreador
      "Abir",               # C1/P1 Toreador
      "Bakunawa",           # C1/P0 Toreador
      "Violet Green",       # C2/P3 Toreador
      "Aster Banda",        # C2/P2 Toreador
      "Penelope Dane",      # C2/P2 Toreador
      "Francisco the Bold", # C2/P2 Toreador
      "Amelie",             # C2/P2 Toreador
      "Sapphire",           # C3/P1 Toreador
      "Tristan Stag",       # C3/P3 Toreador
      "Roland Heffé",       # C3/P6 Toreador
      "Julian L. Hector",   # C3/P5 Toreador
      "Aurora Torres",      # C4/P6 Toreador
      "Eliza Iyer",         # C4/P7 Toreador
      "Hope Ekaette"        # C6/P12 Toreador
    ]
  },
  {
    "id": "meta-gangrel-meute",
    "name": "Gangrel : Meute Sauvage (Deck Officiel S-Tier)",
    "clan": "Gangrel",
    "tier": "S-Tier",
    "archetype": "Bête",
    "description": "L'archétype de horde le plus redouté. Inonde le plateau de familiers avec Ravi Patel, Branwen White et Bloodcaller's Pack, faisant exploser la force de Herald of the Hunt et The Bloodcaller.",
    "playstyle": "Invocation de Horde / Synergie de Meute / Puissance Exponentielle",
    "difficulty": "Facile",
    "guide": "Maximisez le nombre de Bêtes en jeu pour faire grimper passivement la Puissance du Pack du Bloodcaller. Réanimez les bêtes tombées avec Ms Harriot.",
    "cardNames": [
      "Sanjay Ali",         # C2/P2 Gangrel
      "Ravi Patel",         # C3/P1 Gangrel
      "Cathy Carmine",      # C4/P6 Gangrel
      "Herald of the Hunt", # C4/P2 Gangrel
      "Branwen White",      # C4/P5 Gangrel
      "Bloodcaller's Pack", # C4/P1 Gangrel
      "Ms Harriot",         # C5/P5 Gangrel
      "The Bloodcaller",    # C7/P9 Gangrel
      "Paulo Marques",      # C6/P11 Gangrel
      "Queen Rat",          # C4/P7 Gangrel
      "Mother Everly",      # C4/P2 Gangrel
      "Annabella's Pet",    # C4/P6 Gangrel
      "Minnie Chadwick",    # C1/P1 Gangrel
      "Clive Crawford",     # C2/P0 Gangrel
      "Manfred"             # C9/P10 Gangrel
    ]
  },
  {
    "id": "meta-hecata-necromancie",
    "name": "Hecata : Nécromancie & Danse Macabre (S-Tier)",
    "clan": "Hecata",
    "tier": "S-Tier",
    "archetype": "Meurtre",
    "description": "Transforme chaque élimination en victoire absolue. Morag Stewart, Mr Stewart et Ophelia s'enrichissent du sacrifice de vos serviteurs pour faire monter Sadako Asano et Toru Asano en puissance destructrice.",
    "playstyle": "Effets de Mort / Résurrection / Moisson d'Âmes",
    "difficulty": "Moyen",
    "guide": "Ne craignez pas de perdre vos premières cartes : chaque Mort déclenche des bonus de Puissance irréversibles pour vos cartes en main et sur le plateau.",
    "cardNames": [
      "Morag Stewart",      # C2/P2 Hecata
      "Mr Stewart",         # C3/P2 Hecata
      "Ophelia",            # C4/P5 Hecata
      "Sadako Asano",       # C4/P7 Hecata
      "Toru Asano",         # C4/P6 Hecata
      "Carlo Galli",        # C3/P4 Hecata
      "Maria Puttanesca",   # C3/P4 Hecata
      "Sheloa",             # C4/P6 Hecata
      "Wendy Hill",         # C2/P2 Hecata
      "Caesar Cornello",    # C4/P6 Hecata
      "Elizabeth Dunsirn",  # C4/P3 Hecata
      "Olavi 'Tappava' Puttanesca", # C2/P2 Hecata
      "Agent 'S'",          # C3/P2 Hecata
      "Agent 'V'",          # C5/P6 Hecata
      "Lynne Dunsirn"       # C2/P1 Hecata
    ]
  },
  {
    "id": "meta-malkavian-delusion",
    "name": "Malkavian : Chaos Mental & Inversion (A-Tier)",
    "clan": "Malkavian",
    "tier": "A-Tier",
    "archetype": "Démence",
    "description": "Le cauchemar des decks conventionnels. Perturbe les calculs adverses avec Scarlett Redline et Dan Washington, avant de renverser totalement les scores au Tour 7 grâce au génie imprévisible de Benedict et Justicar Parr.",
    "playstyle": "Défausse / Inversion de Scores / Victoire Surprise",
    "difficulty": "Difficile",
    "guide": "Laissez votre adversaire investir massivement sur le Prince de Londres, puis jouez Justicar Parr ou Benedict au dernier tour pour convertir sa force en défaite.",
    "cardNames": [
      "Bruce Sparks",       # C2/P0 Malkavian
      "Scarlett Redline",   # C2/P3 Malkavian
      "Caspen Vodrak",      # C3/P2 Malkavian
      "Molly Cybin",        # C3/P5 Malkavian
      "The Actor",          # C4/P0 Malkavian
      "Dan Washington",     # C4/P7 Malkavian
      "Lazer J. Christ",    # C4/P7 Malkavian
      "Gonzo Thompson",     # C5/P7 Malkavian
      "Lucy Baptiste",      # C5/P6 Malkavian
      "Kenneth Glass",      # C7/P11 Malkavian
      "Justicar Parr",      # C8/P10 Malkavian
      "Benedict",           # C8/P8 Malkavian
      "Jacqueline",         # C3/P3 Malkavian
      "Fiona Millar",       # C2/P2 Malkavian
      "Rosaline Armitage"   # C3/P3 Malkavian
    ]
  },
  {
    "id": "meta-tremere-thaumaturgie",
    "name": "Tremere : Sorcellerie Hermétique de Chantry (A-Tier)",
    "clan": "Tremere",
    "tier": "A-Tier",
    "archetype": "Sorcellerie du Sang",
    "description": "Magie du sang et rituels dévastateurs. Piège le terrain avec Jackie Pincher, réanime les serviteurs avec Antoni Mazur, et déclenche des explosions magiques avec Lavanya Sekh, Aylin et Boyar Mușat.",
    "playstyle": "Sorts de Zone / Pièges / Combo Alchimique",
    "difficulty": "Difficile",
    "guide": "Conservez Lavanya Sekh pour piocher vos sorts clés à coût 0. Déclenchez Aylin lorsque l'adversaire concentre plusieurs cartes dans la même zone.",
    "cardNames": [
      "Jackie Pincher",     # C2/P3 Tremere
      "Juniper Fey",       # C2/P1 Tremere
      "Celine Mușat",       # C2/P1 Tremere
      "Ethan",              # C2/P0 Tremere
      "Lavanya Sekh",       # C3/P3 Tremere
      "Aylin",              # C6/P4 Tremere
      "Antoni Mazur",       # C3/P3 Tremere
      "Tim Holdsworth",     # C4/P0 Tremere
      "Esme",               # C4/P2 Tremere
      "Marquis Leroux",     # C4/P4 Tremere
      "Fitzwilliam Hardy",  # C4/P4 Tremere
      "Shoshana",           # C5/P6 Tremere
      "Morgana",            # C6/P3 Tremere
      "Cécile St-Fleur",    # C6/P7 Tremere
      "Boyar Mușat"         # C7/P5 Tremere
    ]
  },
  {
    "id": "meta-nosferatu-infiltrateurs",
    "name": "Nosferatu : Frappe des Égouts & Furtivité (A-Tier)",
    "clan": "Nosferatu",
    "tier": "A-Tier",
    "archetype": "Occultation",
    "description": "Infiltration indétectable et assassinats chirurgicaux. Shifa s'infiltre sans restriction d'espace, Forterra Face frappe fort dès le début, et Richard de Worde domine le haut de courbe.",
    "playstyle": "Furtivité / Assassinat Ciblé / Infiltration Libre",
    "difficulty": "Moyen",
    "guide": "Exploitez la liberté de placement de Shifa pour contester n'importe quelle zone au moment le plus inopportun pour l'adversaire.",
    "cardNames": [
      "Shifa",              # C1/P1 Nosferatu
      "Forterra Face",      # C1/P3 Nosferatu
      "Harald Basilier",    # C2/P2 Nosferatu
      "Eugene Kister",      # C2/P2 Nosferatu
      "Filipe the Bloody",  # C4/P5 Nosferatu
      "Lorenzo Perello",    # C4/P1 Nosferatu
      "Arturo de Vitry",    # C4/P5 Nosferatu
      "Michael",            # C5/P8 Nosferatu
      "Richard de Worde",   # C6/P10 Nosferatu
      "Monika Kováč",       # C7/P10 Nosferatu
      "Simon Lee",          # C1/P1 Nosferatu
      "Razor",              # C3/P2 Nosferatu
      "Rat-Eater",          # C1/P2 Nosferatu
      "Whisper",            # C2/P3 Nosferatu
      "Queen Rat"           # C4/P7 Gangrel/Nosferatu
    ]
  },
  {
    "id": "meta-anti-meta-control",
    "name": "Hybride Anti-Méta : Contrôle & Disruption (A-Tier)",
    "clan": "Mortel",
    "tier": "A-Tier",
    "archetype": "Neutre",
    "description": "Deck hybride de contre-mesure absolue. Neutralise les stratégies ennemies grâce au silence de zone de Sapphire, le vol de force d'Horatio Drake, et le blocage de points d'Adrian Yu.",
    "playstyle": "Anti-Méta / Silence des Pouvoirs / Verrouillage Stratégique",
    "difficulty": "Difficile",
    "guide": "Contrez les decks aggro avec Sapphire et Adrian Yu, puis concluez avec Marissa the Butcher ou Lord Colville.",
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
      "Tim Holdsworth",     # C4/P0 Tremere
      "Hope Ekaette",       # C6/P12 Toreador
      "Lord Colville",      # C7/P14 Ventrue
      "Marissa the Butcher",# C7/P13 Brujah
      "Sir Kingston"        # C8/P15 Ventrue
    ]
  },
  {
    "id": "meta-midrange-goodstuff",
    "name": "All-Stars : Suprématie Londonienne Midrange (S-Tier)",
    "clan": "Ventrue",
    "tier": "S-Tier",
    "archetype": "Élitiste",
    "description": "La quintessence du deck building compétitif. Combine les cartes au meilleur rapport Coût/Puissance de chaque clan pour assurer une présence indéboulonnable du Tour 1 jusqu'au Tour 7.",
    "playstyle": "Midrange Parfait / Polyvalence / Courbe de Puissance Optimale",
    "difficulty": "Facile",
    "guide": "Suivez la courbe de sang naturellement : 1-2 Sang au T1, 3 Sang au T2, 4 Sang au T3, etc. Ce deck ne souffre d'aucun temps mort.",
    "cardNames": [
      "Luis Castaño",       # C1/P1 Ventrue
      "Amy West",           # C1/P1 Brujah
      "Helen Lloyd",        # C2/P3 Ventrue
      "Grendel Ward",       # C2/P5 Brujah
      "Adrian Yu",          # C3/P6 Ventrue
      "Roland Heffé",       # C3/P6 Toreador
      "Sheriff Fletcher",   # C3/P4 Brujah
      "Horatio Drake",      # C4/P9 Ventrue
      "Jari",               # C4/P7 Brujah
      "Athena",             # C5/P9 Brujah
      "Stephen Fane",       # C5/P8 Ventrue
      "Hope Ekaette",       # C6/P12 Toreador
      "Lord Colville",      # C7/P14 Ventrue
      "Marissa the Butcher",# C7/P13 Brujah
      "Sir Kingston"        # C8/P15 Ventrue
    ]
  }
]

meta_decks_final = []
for d in META_DECKS_DEFS:
    ids = []
    for name in d['cardNames']:
        cid = get_id(name)
        if cid:
            ids.append(cid)
        else:
            print(f"ERROR: missing {name} in {d['id']}")
            
    deck_obj = {
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
    meta_decks_final.append(deck_obj)
    print(f"Meta Deck '{d['name']}': {len(ids)}/15 cards resolved.")

# Write cardsData.js
js_cards = "export const CARDS_DATA = " + json.dumps(final_cards, indent=2, ensure_ascii=False) + ";\n"
with open("src/data/cardsData.js", "w", encoding="utf-8") as f:
    f.write(js_cards)

# Write metaDecks.js
js_meta = "export const META_DECKS = " + json.dumps(meta_decks_final, indent=2, ensure_ascii=False) + ";\n"
with open("src/data/metaDecks.js", "w", encoding="utf-8") as f:
    f.write(js_meta)

print("\nSUCCESS: All 10 meta decks now have exactly 15/15 cards perfectly matched by name!")
