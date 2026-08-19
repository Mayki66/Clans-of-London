# 🩸 Vampire: The Masquerade – Clans of London (Companion & Deck Builder)

Application web moderne, réactive et complète (100% en Français) conçue comme l'outil ultime de deckbuilding, de suivi de collection et d'aide stratégique pour le jeu officiel **Vampire: The Masquerade – Clans of London**.

---

## 🌟 Fonctionnalités Principales

### 🗃️ 1. Base de Données Intégrale des 217 Cartes (Séries 0 à 5)
* **100% Fidèle aux Données Officielles** de [Paradox Wikis](https://vtm.paradoxwikis.com/CoL_cardlist).
* **Tous les Clans représentés** : *Ventrue, Brujah, Toreador, Gangrel, Tremere, Malkavian, Nosferatu, Hecata, Mortels et Inquisition*.
* **Recherche Bilingue Instantanée** (recherche par nom français ou nom anglais, mots-clés, texte de capacité, archétype).
* **Capacités en Français** avec déclencheurs officiels (`À la Révélation :`, `Tant qu'en jeu :`, `À l'Attaque :`, `À la Mort :`, `À la Défausse :`, `Fin de Manche :`).
* **Visualisation Complète & Foils** : Agrandissement de carte avec inspection des statistiques, illustrations de clan et liens directs vers le Wiki Paradox.

### 🃏 2. Deck Builder Compétitif (Format 15 Cartes)
* Respect strict des règles du jeu : **exactement 15 cartes** par deck (1 exemplaire de chaque).
* **Calculateur en direct de la Courbe de Sang** (Coût 1 à 7+) style Draftsim / MTG.
* Répartition dynamique des clans, archétypes et ratio de puissance.
* Sauvegarde locale illimitée de vos compositions personnalisées.
* Outil d'**Exportation & Importation de Deck** en texte brut / presse-papier.

### 🏆 3. 10 Decks Méta Compétitifs & Suggestions de Remplacement Intelligentes
* **10 Compositions Méta Complètes** (15/15) adaptées aux styles dominants de l'arène :
  * 👑 *Ventrue : Hégémonie Élitiste (S-Tier)*
  * 🥊 *Brujah : Pression Martiale (S-Tier)*
  * 🌹 *Toreador : L'Elysium de la Séduction (S-Tier)*
  * 🐺 *Gangrel : Meute Sauvage (S-Tier)*
  * 💀 *Hecata : Nécromancie & Danse Macabre (S-Tier)*
  * 🌀 *Malkavian : Chaos Mental & Inversion (A-Tier)*
  * 🔮 *Tremere : Sorcellerie Hermétique de Chantry (A-Tier)*
  * 👥 *Nosferatu : Frappe des Égouts & Furtivité (A-Tier)*
  * 🛡️ *Hybride Anti-Méta : Contrôle & Disruption (A-Tier)*
  * ⭐ *All-Stars : Suprématie Londonienne Midrange (S-Tier)*
* **Surlignement en Vert** des cartes que vous possédez dans votre collection de jeu.
* **Moteur de Remplacement Intelligent** : S'il vous manque des cartes pour un deck, l'application analyse votre collection et vous propose en 1 clic les **meilleurs équivalents** (même clan, même archétype, coût proche) grâce au bouton `⚡ Charger avec Remplacements Intelligents`.

### ⚔️ 4. Simulateur de Duel 7 Tours
* Testez vos mains d'ouverture (4 cartes) et vos tirages.
* Simulation de l'économie de Sang tour par tour (**Tour 1 = 2 Sang**, Tour 2 = 3 Sang ... Tour 7 = 8 Sang).
* Pose de cartes sur les 3 zones d'affrontement (*Camden & Soho, Le Prince de Londres, Whitechapel & Docks*).
* Calcul en direct des scores et détection de victoire.

### 👤 5. Gestion de Collection & Suivi d'Arène
* Suivi précis de votre collection : **X / 217 Cartes**.
* Possibilité de cocher/décocher n'importe quelle carte acquise en jeu.
* Historique des matchs d'arène et points de réputation kindred.

---

## 🚀 Installation & Lancement Local

### Prérequis
* [Node.js](https://nodejs.org/) (version 18 ou supérieure recommandée)
* `npm` ou `yarn`

### Commandes
```bash
# 1. Cloner le dépôt
git clone https://github.com/Mayki66/Clans-of-London.git
cd Clans-of-London

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm run dev

# 4. Compiler pour la production
npm run build
```

L'application sera accessible sur `http://localhost:5173`.

---

## 🛠️ Technologies Utilisées
* **Frontend** : React 18, Vite
* **Styling** : Tailwind CSS, Thème Dark Gothique Londonien (Vampire: The Masquerade)
* **Icônes** : Lucide React
* **Effets & Animations** : Canvas Confetti, Tailwind Animations
* **Base de données** : Données extraites de [Paradox Wikis](https://vtm.paradoxwikis.com/CoL_cardlist) et enrichies en français.

---

## 📄 Licence
Projet conçu pour la communauté des joueurs de **Vampire: The Masquerade – Clans of London**.
Vampire: The Masquerade est une marque déposée de Paradox Interactive AB.
