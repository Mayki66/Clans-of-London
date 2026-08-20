import json

with open('src/data/cardsData.js', 'r', encoding='utf-8') as f:
    text = f.read()

json_str = text.replace('export const CARDS_DATA = ', '').rstrip(';\n')
cards = json.loads(json_str)

test_names = [
    'Sapphire', 'Horatio Drake', 'Adrian Yu', 'Luis Castaño', 'Abigail Smith',
    'Helen Lloyd', 'Jürgen Mayer', 'Lawrence', 'Stephen Fane', 'Lord Colville',
    'Sir Kingston', 'Mrs Fitzgerald', 'Amy West', 'Grendel Ward', 'Dante',
    'Razor', 'Athena', 'Marissa the Butcher', 'Katie Dixon', 'Hope Ekaette',
    'Roland Heffé', 'Julian L. Hector', 'Eliza Iyer', 'Morag Stewart',
    'Ophelia', 'Sadako Asano', 'The Bloodcaller', 'Cathy Carmine', 'Benedict', 'Justicar Parr'
]

for name in test_names:
    found = [c for c in cards if c['name'].lower() == name.lower() or c['originalName'].lower() == name.lower()]
    if found:
        c = found[0]
        print(f"[{c['id']}] {c['name']} (C{c['cost']}/P{c['power']}) [{c['clan']}] [{c['archetype']}]")
        print(f"   Ability FR: {c['ability']}")
        print(f"   Ability EN: {c['ability_en']}")
        print(f"   Notes: {c['notes']}")
        print("-" * 50)
