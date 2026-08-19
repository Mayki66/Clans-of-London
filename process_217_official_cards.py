import json
import re
import os
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

with open('scratch/tables_data.json', 'r', encoding='utf-8') as f:
    tables = json.load(f)

series_names = ['Series 0', 'Series 1', 'Series 2', 'Series 3', 'Series 4', 'Series 5']
all_217_cards = []

for s_idx in range(6):
    rows = tables[s_idx]['rows']
    print(f"\n--- {series_names[s_idx]} ({len(rows)-1} cards) ---")
    for r in rows[1:]:
        name = r[0]['text'].strip()
        cost_str = r[1]['text'].strip()
        power_str = r[2]['text'].strip()
        archetype = r[3]['text'].strip()
        ability = r[4]['text'].strip()
        clan = r[5]['text'].strip()
        notes = r[6]['text'].strip() if len(r) > 6 else ""

        link_match = re.search(r'href=["\']([^"\']+)["\']', r[0]['html'])
        href = link_match.group(1) if link_match else ""
        if href.startswith('/'):
            wiki_url = f"https://vtm.paradoxwikis.com{href}"
        elif href:
            wiki_url = href
        else:
            safe_slug = name.replace(' ', '_').replace('"', '')
            wiki_url = f"https://vtm.paradoxwikis.com/CoL_Card:{safe_slug}"

        try:
            cost = int(cost_str)
        except:
            cost = 1
            
        try:
            power = int(power_str)
        except:
            power = 0

        card_data = {
            "series": s_idx,
            "name": name,
            "cost": cost,
            "power": power,
            "archetype": archetype if archetype and archetype != "N/A" else "Neutre",
            "ability_en": ability if ability and ability != "N/A" else "",
            "clan": clan if clan and clan != "N/A" else "Mortel",
            "notes": notes if notes and notes != "N/A" else "",
            "wiki_url": wiki_url
        }
        all_217_cards.append(card_data)
        print(f"[{s_idx}] {name:30} | Cost: {cost:2} | Pow: {power:2} | Clan: {clan:12} | Arch: {archetype:12}")

print(f"\n==========================================")
print(f"TOTAL EXACT CARDS EXTRACTED: {len(all_217_cards)} / 217")
print(f"==========================================")

with open('scratch/all_217_official_raw.json', 'w', encoding='utf-8') as f:
    json.dump(all_217_cards, f, indent=2, ensure_ascii=False)
