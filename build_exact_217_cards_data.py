import json
import re

with open('scratch/all_217_official_raw.json', 'r', encoding='utf-8') as f:
    raw_cards = json.load(f)

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

def translate_ability_to_french(ability_en):
    if not ability_en or ability_en == 'N/A':
        return "Aucune capacité spéciale."
    
    t = ability_en.strip()
    
    # Specific full phrase mappings
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

    # Triggers
    t = re.sub(r'\bOn Reveal:\s*', 'À la Révélation : ', t, flags=re.IGNORECASE)
    t = re.sub(r'\bWhile in Play:\s*', 'Tant qu\'en jeu : ', t, flags=re.IGNORECASE)
    t = re.sub(r'\bOn Attack:\s*', 'À l\'Attaque : ', t, flags=re.IGNORECASE)
    t = re.sub(r'\bWhen Murdered:\s*', 'À la Mort : ', t, flags=re.IGNORECASE)
    t = re.sub(r'\bWhen Discarded:\s*', 'À la Défausse : ', t, flags=re.IGNORECASE)
    t = re.sub(r'\bEnd of Round:\s*', 'Fin de Manche : ', t, flags=re.IGNORECASE)
    t = re.sub(r'\bAt Start of Game:\s*', 'Au Début de Partie : ', t, flags=re.IGNORECASE)
    t = re.sub(r'\bOn Conflict Won:\s*', 'En cas de Victoire en Conflit : ', t, flags=re.IGNORECASE)
    t = re.sub(r'\bWhile Attacking:\s*', 'Pendant l\'Attaque : ', t, flags=re.IGNORECASE)

    # Word substitutions
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
    'Mr. Moore': 'Mr Moore'
}

final_cards = []

for i, raw in enumerate(raw_cards):
    idx = i + 1
    raw_name = raw['name']
    name_fr = FRENCH_NAME_OVERRIDES.get(raw_name, raw_name)
    
    clan_raw = raw['clan']
    primary_clan = clan_raw.split(',')[0].strip()
    clan = CLAN_MAP.get(clan_raw, CLAN_MAP.get(primary_clan, 'Mortel'))
    
    arch_raw = raw['archetype']
    archetype = ARCHETYPE_MAP.get(arch_raw, 'Neutre')
    
    ability_fr = translate_ability_to_french(raw['ability_en'])
    
    # Determine type
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
        
    # Determine rarity
    cost = raw['cost']
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
        "cost": raw['cost'],
        "power": raw['power'],
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

print(f"Generated {len(final_cards)} official cards!")

# Write markdown table
md_table = "# Table Officielle Complète des 217 Cartes de Vampire: The Masquerade – Clans of London\n\n"
md_table += "Source officielle : [Paradox Wikis - CoL_cardlist](https://vtm.paradoxwikis.com/CoL_cardlist)\n\n"
md_table += "| ID | Série | Nom de la Carte (FR / EN) | Clan | Coût | Puissance | Archétype | Type | Rareté | Capacité Officielle (Français) |\n"
md_table += "|---|---|---|---|---|---|---|---|---|---|\n"

for c in final_cards:
    name_display = f"**{c['name']}**" if c['name'] == c['originalName'] else f"**{c['name']}** *({c['originalName']})*"
    md_table += f"| `{c['id']}` | S{c['series']} | {name_display} | {c['clan']} | {c['cost']} Sang | {c['power']} | {c['archetype']} | {c['type']} | {c['rarity']} | {c['ability']} |\n"

with open("official_217_cards_table.md", "w", encoding="utf-8") as f:
    f.write(md_table)

# Write to src/data/cardsData.js
js_content = "export const CARDS_DATA = " + json.dumps(final_cards, indent=2, ensure_ascii=False) + ";\n"
with open("src/data/cardsData.js", "w", encoding="utf-8") as f:
    f.write(js_content)

print("Saved official_217_cards_table.md & src/data/cardsData.js successfully with perfect translations!")
