import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DeckBuilderView from './components/DeckBuilder/DeckBuilderView';
import DatabaseView from './components/CardDatabase/DatabaseView';
import MetaDecksView from './components/MetaDecks/MetaDecksView';
import CommunityDecksView from './components/CommunityDecks/CommunityDecksView';
import RulesGuideView from './components/RulesGuide/RulesGuideView';
import ArenaDuelView from './components/ArenaDuel/ArenaDuelView';
import ProfileView from './components/Profile/ProfileView';
import CardModal from './components/Card/CardModal';
import OnboardingModal from './components/Onboarding/OnboardingModal';
import AdminLoginModal from './components/Admin/AdminLoginModal';
import GhostAdminModal from './components/Admin/GhostAdminModal';
import { CARDS_DATA } from './data/cardsData';
import { TRANSLATIONS } from './i18n/translations';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { trackVisit, trackInteraction, trackProfileExport, trackUserRegistration } from './utils/adminTelemetry';
import confetti from 'canvas-confetti';

const LOCAL_STORAGE_SAVED_DECKS = 'col_saved_decks_v1';
const LOCAL_STORAGE_CURRENT_DECK = 'col_current_deck_v1';
const LOCAL_STORAGE_USER_PROFILE = 'col_user_profile_v1';
const LOCAL_STORAGE_CUSTOM_IMAGES = 'col_custom_images_v1';
const LOCAL_STORAGE_LANG = 'col_lang';
const LOCAL_STORAGE_ONBOARDING = 'col_onboarding_completed';

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
  "col-160", "col-192", "col-ing-01", "col-ing-02", "col-ing-03"
];

export default function App() {
  const [activeView, setActiveView] = useState('rules'); // 'rules' (Home) | 'deckbuilder' | 'database' | 'community' | 'metadecks' | 'arena' | 'profile'
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_LANG) || 'fr';
    } catch {
      return 'fr';
    }
  });
  const [showOnboarding, setShowOnboarding] = useState(() => {
    try {
      return !localStorage.getItem(LOCAL_STORAGE_ONBOARDING);
    } catch {
      return false;
    }
  });

  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  const [deckName, setDeckName] = useState('Nouveau Deck Londonien');
  const [deckCards, setDeckCards] = useState([]);
  const [savedDecks, setSavedDecks] = useState([]);
  const [inspectedCard, setInspectedCard] = useState(null);
  const [customImages, setCustomImages] = useState({});

  // Translation dictionary
  const t = TRANSLATIONS[lang] || TRANSLATIONS.fr;

  const handleLangChange = (newLang) => {
    setLang(newLang);
    try {
      localStorage.setItem(LOCAL_STORAGE_LANG, newLang);
    } catch (e) {
      console.error("Error saving lang preference", e);
    }
  };

  // User Profile state (Collection, Arena Points, Match History)
  const [userProfile, setUserProfile] = useState({
    playerName: 'Mayki',
    collectionLevel: 14,
    arenaPoints: 1250,
    ownedCardIds: DEFAULT_OWNED_CARD_IDS,
    matchHistory: [
      { id: 'm-1', date: 'Aujourd\'hui', result: 'victory', deckName: 'Alchimie Explosive', opponentClan: 'Brujah', pointsChange: '+35' },
      { id: 'm-2', date: 'Hier', result: 'victory', deckName: 'Hégémonie Élitiste', opponentClan: 'Ventrue', pointsChange: '+35' }
    ]
  });

  // Load saved data on mount & track visit
  useEffect(() => {
    try {
      trackVisit();
    } catch (e) {
      console.error("Error tracking visit", e);
    }

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
          playerName: 'Mayki',
          collectionLevel: 14,
          arenaPoints: 1250,
          ownedCardIds: DEFAULT_OWNED_CARD_IDS,
          matchHistory: [
            { id: 'm-1', date: 'Aujourd\'hui', result: 'victory', deckName: 'Alchimie Explosive', opponentClan: 'Brujah', pointsChange: '+35' },
            { id: 'm-2', date: 'Hier', result: 'victory', deckName: 'Hégémonie Élitiste', opponentClan: 'Ventrue', pointsChange: '+35' }
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
        const starterCards = CARDS_DATA.slice(0, 10);
        setDeckCards(starterCards);
        setDeckName('Deck d\'Initiation (Série 0)');
      }
    } catch (e) {
      console.error('Error loading saved data from localStorage:', e);
    }
  }, []);

  const handleOnboardingComplete = (data) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_ONBOARDING, 'true');
    } catch (e) {
      console.error("Error setting onboarding complete", e);
    }
    if (data?.playerName) {
      handleUpdateProfile({
        ...userProfile,
        playerName: data.playerName
      });
    }
    setShowOnboarding(false);
  };

  const handleOnboardingImport = (importedData) => {
    if (importedData.ownedCardIds) {
      handleUpdateProfile({
        ...userProfile,
        playerName: importedData.playerName || userProfile.playerName || 'Mayki',
        collectionLevel: importedData.collectionLevel || Math.max(1, Math.floor(importedData.ownedCardIds.length / 5)),
        arenaPoints: importedData.arenaPoints !== undefined ? importedData.arenaPoints : userProfile.arenaPoints,
        ownedCardIds: importedData.ownedCardIds,
        matchHistory: importedData.matchHistory || userProfile.matchHistory
      });
    }
  };

  // Add Card to Deck
  const handleAddCard = (card) => {
    if (deckCards.length >= 15) {
      alert(lang === 'fr' ? 'Un deck ne peut contenir que 15 cartes maximum.' : 'A deck cannot exceed 15 cards.');
      return;
    }
    if (deckCards.some(c => c.id === card.id)) {
      alert(lang === 'fr' ? 'Cette carte est déjà dans votre deck (règle Singleton : 1 exemplaire max).' : 'This card is already in your deck (Singleton rule: 1 copy max).');
      return;
    }
    const newDeck = [...deckCards, card];
    setDeckCards(newDeck);
    try {
      localStorage.setItem(LOCAL_STORAGE_CURRENT_DECK, JSON.stringify({
        name: deckName,
        cardIds: newDeck.map(c => c.id)
      }));
    } catch (e) {
      console.error('Error saving current deck:', e);
    }
  };

  // Remove Card from Deck
  const handleRemoveCard = (cardId) => {
    const newDeck = deckCards.filter(c => c.id !== cardId);
    setDeckCards(newDeck);
    try {
      localStorage.setItem(LOCAL_STORAGE_CURRENT_DECK, JSON.stringify({
        name: deckName,
        cardIds: newDeck.map(c => c.id)
      }));
    } catch (e) {
      console.error('Error saving current deck:', e);
    }
  };

  // Clear Deck
  const handleClearDeck = () => {
    setDeckCards([]);
    try {
      localStorage.removeItem(LOCAL_STORAGE_CURRENT_DECK);
    } catch (e) {
      console.error('Error clearing current deck:', e);
    }
  };

  // Load Saved or Meta / Community Deck
  const handleLoadDeck = (deck) => {
    const cards = deck.cardIds
      .map(id => CARDS_DATA.find(c => c.id === id))
      .filter(Boolean);
    
    setDeckCards(cards);
    setDeckName(deck.name);
    setActiveView('deckbuilder');

    try {
      localStorage.setItem(LOCAL_STORAGE_CURRENT_DECK, JSON.stringify({
        name: deck.name,
        cardIds: cards.map(c => c.id)
      }));
    } catch (e) {
      console.error('Error loading deck into current:', e);
    }

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  };

  // Navigate directly to Arena with a loaded deck
  const handleNavigateToArenaWithDeck = (deck) => {
    handleLoadDeck(deck);
    setActiveView('arena');
  };

  // Save Deck
  const handleSaveDeck = () => {
    if (deckCards.length === 0) return;
    const newDeckEntry = {
      id: `deck-${Date.now()}`,
      name: deckName || 'Deck sans nom',
      createdAt: new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US'),
      cardIds: deckCards.map(c => c.id)
    };
    const updated = [newDeckEntry, ...savedDecks.filter(d => d.name !== newDeckEntry.name)];
    setSavedDecks(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_SAVED_DECKS, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving decks list:', e);
    }
  };

  // Delete Deck
  const handleDeleteSavedDeck = (deckId) => {
    const updated = savedDecks.filter(d => d.id !== deckId);
    setSavedDecks(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_SAVED_DECKS, JSON.stringify(updated));
    } catch (e) {
      console.error('Error deleting saved deck:', e);
    }
  };

  // Profile actions
  const handleUpdateProfile = (newProfile) => {
    setUserProfile(newProfile);
    try {
      localStorage.setItem(LOCAL_STORAGE_USER_PROFILE, JSON.stringify(newProfile));
    } catch (e) {
      console.error('Error updating user profile:', e);
    }
  };

  const handleToggleOwnedCard = (cardId) => {
    const currentOwned = userProfile.ownedCardIds || [];
    let updatedOwned;
    if (currentOwned.includes(cardId)) {
      updatedOwned = currentOwned.filter(id => id !== cardId);
    } else {
      updatedOwned = [...currentOwned, cardId];
    }
    const updatedProfile = {
      ...userProfile,
      ownedCardIds: updatedOwned,
      collectionLevel: Math.max(1, Math.floor(updatedOwned.length / 5))
    };
    handleUpdateProfile(updatedProfile);
  };

  const handleUnlockBatch = (mode) => {
    let updatedOwned = [];
    if (mode === 'all') {
      updatedOwned = CARDS_DATA.map(c => c.id);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } else if (mode === 'reset') {
      updatedOwned = [];
    }
    handleUpdateProfile({
      ...userProfile,
      ownedCardIds: updatedOwned,
      collectionLevel: mode === 'all' ? 44 : 1
    });
  };

  const handleUpdateCardImage = (cardId, customUrl) => {
    const updated = { ...customImages, [cardId]: customUrl };
    setCustomImages(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_CUSTOM_IMAGES, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving custom images:', e);
    }
  };

  const activeInspectedCard = inspectedCard ? {
    ...inspectedCard,
    imageUrl: customImages[inspectedCard.id] || inspectedCard.imageUrl,
    hasOfficialImage: !customImages[inspectedCard.id] && inspectedCard.hasOfficialImage
  } : null;

  const ownedCount = (userProfile.ownedCardIds || []).length;

  return (
    <div className="min-h-screen bg-[#07090e] text-gray-100 flex flex-col font-sans selection:bg-red-700 selection:text-white pb-20">
      
      {/* First Visit Onboarding Modal */}
      {showOnboarding && (
        <OnboardingModal
          onComplete={handleOnboardingComplete}
          onImportProfile={handleOnboardingImport}
          lang={lang}
          onChangeLang={handleLangChange}
          t={t}
        />
      )}

      {/* Top Navbar */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        deckCardsCount={deckCards.length}
        ownedCount={ownedCount}
        totalCount={CARDS_DATA.length}
        lang={lang}
        onChangeLang={handleLangChange}
        t={t}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 md:py-8">
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
            userProfile={userProfile}
            lang={lang}
            t={t}
          />
        )}

        {activeView === 'database' && (
          <DatabaseView
            onInspectCard={setInspectedCard}
            onAddCard={handleAddCard}
            onRemoveCard={handleRemoveCard}
            deckCards={deckCards}
            ownedCardIds={userProfile.ownedCardIds || []}
            lang={lang}
            t={t}
          />
        )}

        {activeView === 'community' && (
          <CommunityDecksView
            onLoadDeck={handleLoadDeck}
            onInspectCard={setInspectedCard}
            onNavigateToArena={handleNavigateToArenaWithDeck}
            currentDeckCards={deckCards}
            currentDeckName={deckName}
            userProfile={userProfile}
            lang={lang}
            t={t}
          />
        )}

        {activeView === 'metadecks' && (
          <MetaDecksView
            onLoadMetaDeck={handleLoadDeck}
            onInspectCard={setInspectedCard}
            ownedCardIds={userProfile.ownedCardIds || []}
            lang={lang}
            t={t}
          />
        )}

        {activeView === 'arena' && (
          <ArenaDuelView
            customDeckCardIds={deckCards.map(c => c.id)}
            onInspectCard={setInspectedCard}
            lang={lang}
            t={t}
          />
        )}

        {activeView === 'rules' && (
          <RulesGuideView
            onGoToDeckBuilder={() => setActiveView('deckbuilder')}
            lang={lang}
            t={t}
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
            lang={lang}
            t={t}
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
          lang={lang}
          t={t}
        />
      )}

      {/* Fixed Sticky Footer across entire app */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-[#050608]/95 backdrop-blur-lg py-2 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.8)] text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
          <div className="flex items-center space-x-2 flex-wrap justify-center md:justify-start">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <p className="font-gothic font-bold text-gray-300 text-[11px]">
              {t?.brand?.title || "CLANS OF LONDON"} • {t?.brand?.subtitle || "Vampire: The Masquerade"}
            </p>
            <span className="text-gray-600 hidden sm:inline">•</span>
            <span className="text-[11px] text-gray-400">
              {lang === 'fr' ? 'Données :' : 'Data source:'}{' '}
              <a 
                href="https://vtm.paradoxwikis.com/CoL_cardlist" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-red-400 hover:text-red-300 hover:underline"
              >
                Wiki Paradox (CoL_cardlist)
              </a>
            </span>
          </div>

          <div className="flex items-center space-x-2 font-mono text-[11px] text-amber-400/90 font-semibold select-none">
            <span>
              {lang === 'fr' ? 'Application développée, créée, éditée et remplie par ' : 'Application developed, created, edited and curated by '}
              <span
                onClick={() => setShowAdminLogin(true)}
                className="cursor-default"
              >
                Mayki
              </span>
              {' via Antigravity'}
            </span>
          </div>
        </div>
      </footer>

      {/* Secret Admin Authentication Modal */}
      {showAdminLogin && (
        <AdminLoginModal
          onClose={() => setShowAdminLogin(false)}
          onSuccess={() => {
            setShowAdminLogin(false);
            setShowAdminDashboard(true);
          }}
        />
      )}

      {/* Ghost Admin Telemetry & Registration Dashboard */}
      {showAdminDashboard && (
        <GhostAdminModal
          onClose={() => setShowAdminDashboard(false)}
        />
      )}

      {/* Vercel Web Analytics & Speed Insights Tracking */}
      <Analytics />
      <SpeedInsights />
    </div>
  );
}
