import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DeckBuilderView from './components/DeckBuilder/DeckBuilderView';
import DatabaseView from './components/CardDatabase/DatabaseView';
import MetaDecksView from './components/MetaDecks/MetaDecksView';
import RulesGuideView from './components/RulesGuide/RulesGuideView';
import ProfileView from './components/Profile/ProfileView';
import CardModal from './components/Card/CardModal';
import { CARDS_DATA } from './data/cardsData';
import confetti from 'canvas-confetti';

const LOCAL_STORAGE_SAVED_DECKS = 'col_saved_decks_v1';
const LOCAL_STORAGE_CURRENT_DECK = 'col_current_deck_v1';
const LOCAL_STORAGE_USER_PROFILE = 'col_user_profile_v1';
const LOCAL_STORAGE_CUSTOM_IMAGES = 'col_custom_images_v1';

const DEFAULT_OWNED_CARD_IDS = [
  "col-001", "col-002", "col-029", "col-003", "col-004", "col-032", "col-028", 
  "col-005", "col-006", "col-007", "col-008", "col-009", "col-033", "col-034", 
  "col-035", "col-010", "col-011", "col-040", "col-051", "col-012", "col-041", 
  "col-013", "col-014", "col-043", "col-044", "col-045", "col-015", "col-016", 
  "col-017", "col-046", "col-047", "col-048", "col-050", "col-052", "col-018", 
  "col-019", "col-053", "col-054", "col-055", "col-056", "col-057", "col-058", 
  "col-059", "col-060", "col-061", "col-020", "col-022", "col-023", "col-153", 
  "col-021", "col-155", "col-024", "col-065", "col-066", "col-067", "col-068", 
  "col-069", "col-025", "col-070", "col-071", "col-026", "col-027", "col-072", 
  "col-160"
];

export default function App() {
  const [activeView, setActiveView] = useState('deckbuilder'); // 'deckbuilder' | 'database' | 'metadecks' | 'rules' | 'profile'
  const [deckName, setDeckName] = useState('Nouveau Deck Londonien');
  const [deckCards, setDeckCards] = useState([]);
  const [savedDecks, setSavedDecks] = useState([]);
  const [inspectedCard, setInspectedCard] = useState(null);
  const [customImages, setCustomImages] = useState({});

  // User Profile state (Collection 64/217, Arena Points, Match History)
  const [userProfile, setUserProfile] = useState({
    playerName: 'Mayki (Kindred)',
    collectionLevel: 14,
    arenaPoints: 1250,
    ownedCardIds: DEFAULT_OWNED_CARD_IDS,
    matchHistory: [
      { id: 'm-1', date: 'Aujourd\'hui', result: 'victory', deckName: 'Hégémonie Élitiste', opponentClan: 'Brujah', pointsChange: '+35' },
      { id: 'm-2', date: 'Hier', result: 'victory', deckName: 'Pression Martiale', opponentClan: 'Ventrue', pointsChange: '+35' },
      { id: 'm-3', date: 'Hier', result: 'defeat', deckName: 'Meute Sauvage', opponentClan: 'Gangrel', pointsChange: '-15' }
    ]
  });

  // Load saved data on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_SAVED_DECKS);
      if (saved) {
        setSavedDecks(JSON.parse(saved));
      }

      const profile = localStorage.getItem(LOCAL_STORAGE_USER_PROFILE);
      if (profile) {
        const parsedProfile = JSON.parse(profile);
        setUserProfile(parsedProfile);
      } else {
        const initial = {
          playerName: 'Mayki (Kindred)',
          collectionLevel: 14,
          arenaPoints: 1250,
          ownedCardIds: DEFAULT_OWNED_CARD_IDS,
          matchHistory: [
            { id: 'm-1', date: 'Aujourd\'hui', result: 'victory', deckName: 'Hégémonie Élitiste', opponentClan: 'Brujah', pointsChange: '+35' },
            { id: 'm-2', date: 'Hier', result: 'victory', deckName: 'Pression Martiale', opponentClan: 'Ventrue', pointsChange: '+35' }
          ]
        };
        localStorage.setItem(LOCAL_STORAGE_USER_PROFILE, JSON.stringify(initial));
        setUserProfile(initial);
      }

      const images = localStorage.getItem(LOCAL_STORAGE_CUSTOM_IMAGES);
      if (images) {
        setCustomImages(JSON.parse(images));
      }

      const current = localStorage.getItem(LOCAL_STORAGE_CURRENT_DECK);
      if (current) {
        const parsed = JSON.parse(current);
        if (parsed.name) setDeckName(parsed.name);
        if (parsed.cardIds && Array.isArray(parsed.cardIds)) {
          const loadedCards = parsed.cardIds
            .map(id => CARDS_DATA.find(c => c.id === id))
            .filter(Boolean);
          setDeckCards(loadedCards);
        }
      } else {
        // Pre-load tutorial starter deck (Series 0 cards)
        const starterCards = CARDS_DATA.slice(0, 10);
        setDeckCards(starterCards);
        setDeckName('Deck d\'Initiation (Série 0)');
      }
    } catch (e) {
      console.error('Error loading decks from storage', e);
    }
  }, []);

  // Update card image override
  const handleUpdateCardImage = (cardId, newUrl) => {
    const updated = { ...customImages, [cardId]: newUrl };
    setCustomImages(updated);
    localStorage.setItem(LOCAL_STORAGE_CUSTOM_IMAGES, JSON.stringify(updated));

    // Also update inspected card if currently open
    if (inspectedCard && inspectedCard.id === cardId) {
      setInspectedCard(prev => ({ ...prev, imageUrl: newUrl }));
    }
  };

  // Sync current deck to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CURRENT_DECK, JSON.stringify({
        name: deckName,
        cardIds: deckCards.map(c => c.id)
      }));
    } catch (e) {
      console.error('Error saving current deck', e);
    }
  }, [deckName, deckCards]);

  // Sync user profile to LocalStorage
  const handleUpdateProfile = (updatedProfile) => {
    setUserProfile(updatedProfile);
    localStorage.setItem(LOCAL_STORAGE_USER_PROFILE, JSON.stringify(updatedProfile));
  };

  // Toggle single card in collection
  const handleToggleOwnedCard = (cardId) => {
    const isOwned = (userProfile.ownedCardIds || []).includes(cardId);
    const newOwned = isOwned
      ? userProfile.ownedCardIds.filter(id => id !== cardId)
      : [...(userProfile.ownedCardIds || []), cardId];

    handleUpdateProfile({
      ...userProfile,
      ownedCardIds: newOwned,
      collectionLevel: Math.max(1, Math.floor(newOwned.length / 2))
    });
  };

  // Batch unlock cards by series
  const handleUnlockBatch = (seriesArray) => {
    if (seriesArray.length === 0) {
      handleUpdateProfile({
        ...userProfile,
        ownedCardIds: [],
        collectionLevel: 1
      });
      return;
    }
    const cardIdsToUnlock = CARDS_DATA
      .filter(c => seriesArray.includes(c.series))
      .map(c => c.id);

    const merged = Array.from(new Set([...(userProfile.ownedCardIds || []), ...cardIdsToUnlock]));
    handleUpdateProfile({
      ...userProfile,
      ownedCardIds: merged,
      collectionLevel: Math.max(1, Math.floor(merged.length / 2))
    });
  };

  // Add Card to deck
  const handleAddCard = (card) => {
    if (deckCards.some(c => c.id === card.id)) {
      return;
    }
    if (deckCards.length >= 15) {
      alert('Votre deck a déjà atteint la limite maximale de 15 cartes !');
      return;
    }

    const newDeck = [...deckCards, card];
    setDeckCards(newDeck);

    if (newDeck.length === 15) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  // Remove Card from deck
  const handleRemoveCard = (card) => {
    setDeckCards(prev => prev.filter(c => c.id !== card.id));
  };

  // Clear deck
  const handleClearDeck = () => {
    setDeckCards([]);
  };

  // Load a deck from saved list or meta deck
  const handleLoadDeck = (deckObj) => {
    if (deckObj.name) setDeckName(deckObj.name);
    if (deckObj.cardIds) {
      const loaded = deckObj.cardIds
        .map(id => CARDS_DATA.find(c => c.id === id))
        .filter(Boolean);
      setDeckCards(loaded);
    }
    setActiveView('deckbuilder');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Save deck to custom saved list
  const handleSaveDeck = (newDeck) => {
    const updated = [newDeck, ...savedDecks.filter(d => d.id !== newDeck.id)];
    setSavedDecks(updated);
    localStorage.setItem(LOCAL_STORAGE_SAVED_DECKS, JSON.stringify(updated));
  };

  // Delete saved deck
  const handleDeleteSavedDeck = (deckId) => {
    const updated = savedDecks.filter(d => d.id !== deckId);
    setSavedDecks(updated);
    localStorage.setItem(LOCAL_STORAGE_SAVED_DECKS, JSON.stringify(updated));
  };

  const ownedCount = (userProfile.ownedCardIds || []).length;

  // Merge custom image overrides into inspected card
  const activeInspectedCard = inspectedCard ? {
    ...inspectedCard,
    imageUrl: customImages[inspectedCard.id] !== undefined ? customImages[inspectedCard.id] : inspectedCard.imageUrl
  } : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#07080c] text-gray-200">
      {/* Top Navbar */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        deckCardsCount={deckCards.length}
        ownedCount={ownedCount}
        totalCount={CARDS_DATA.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {activeView === 'deckbuilder' && (
          <DeckBuilderView
            deckName={deckName}
            setDeckName={setDeckName}
            deckCards={deckCards}
            onAddCard={handleAddCard}
            onRemoveCard={handleRemoveCard}
            onClearDeck={handleClearDeck}
            onLoadDeck={handleLoadDeck}
            savedDecks={savedDecks}
            onSaveDeck={handleSaveDeck}
            onDeleteSavedDeck={handleDeleteSavedDeck}
            onInspectCard={setInspectedCard}
            ownedCardIds={userProfile.ownedCardIds || []}
          />
        )}

        {activeView === 'database' && (
          <DatabaseView
            onInspectCard={setInspectedCard}
            onAddCard={handleAddCard}
            onRemoveCard={handleRemoveCard}
            deckCards={deckCards}
            ownedCardIds={userProfile.ownedCardIds || []}
          />
        )}

        {activeView === 'metadecks' && (
          <MetaDecksView
            onLoadMetaDeck={handleLoadDeck}
            onInspectCard={setInspectedCard}
            ownedCardIds={userProfile.ownedCardIds || []}
          />
        )}

        {activeView === 'rules' && (
          <RulesGuideView
            onGoToDeckBuilder={() => setActiveView('deckbuilder')}
          />
        )}

        {activeView === 'profile' && (
          <ProfileView
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            onToggleOwnedCard={handleToggleOwnedCard}
            onUnlockBatch={handleUnlockBatch}
            deckCards={deckCards}
            savedDecks={savedDecks}
          />
        )}
      </main>

      {/* Fullscreen Card Inspection Modal */}
      {activeInspectedCard && (
        <CardModal
          card={activeInspectedCard}
          onClose={() => setInspectedCard(null)}
          onAdd={handleAddCard}
          onRemove={handleRemoveCard}
          countInDeck={deckCards.some(c => c.id === activeInspectedCard.id) ? 1 : 0}
          onSelectCard={(c) => setInspectedCard(c)}
          onUpdateCardImage={handleUpdateCardImage}
        />
      )}

      {/* Footer */}
      <footer className="mt-16 border-t border-white/10 bg-[#050608] py-8 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-1">
            <p className="font-gothic font-bold text-gray-300">
              Vampire: The Masquerade – Clans of London • Deck Builder & Base de Cartes
            </p>
            <p className="text-gray-600 text-[11px]">
              Données alignées sur le wiki <a href="https://vtm.paradoxwikis.com/CoL_cardlist" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">VTM Paradox Wikis (CoL_cardlist)</a>.
            </p>
          </div>

          <div className="flex items-center space-x-4 font-mono text-[11px] text-gray-400">
            <span>70+ Cartes</span>
            <span>•</span>
            <span>Séries 0 à 5</span>
            <span>•</span>
            <span>8 Clans</span>
            <span>•</span>
            <span>7 Tours King of the Hill</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
