import React, { useState, useEffect, Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import { CARDS_DATA } from './data/cardsData';
import { TRANSLATIONS } from './i18n/translations';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { trackVisit, trackInteraction, trackProfileExport, trackUserRegistration } from './utils/adminTelemetry';
import { parseCurrentRoute, navigateTo } from './utils/router';
import confetti from 'canvas-confetti';
import {
  LS_SAVED_DECKS, LS_CURRENT_DECK, LS_USER_PROFILE, LS_CUSTOM_IMAGES,
  LS_LANG, LS_ONBOARDING, MAX_DECK_SIZE,
  DEFAULT_OWNED_CARD_IDS, DEFAULT_USER_PROFILE, DEFAULT_STARTER_DECK_NAME, DEFAULT_STARTER_DECK_COUNT
} from './config/constants';
import { storageGet, storageSet, storageGetRaw, storageSetRaw, storageRemove } from './services/storageService';


// Lazy-loaded Views and Modals for high-performance Code-Splitting
const DeckBuilderView = lazy(() => import('./components/DeckBuilder/DeckBuilderView'));
const DatabaseView = lazy(() => import('./components/CardDatabase/DatabaseView'));
const MetaDecksView = lazy(() => import('./components/MetaDecks/MetaDecksView'));
const CommunityDecksView = lazy(() => import('./components/CommunityDecks/CommunityDecksView'));
const RulesGuideView = lazy(() => import('./components/RulesGuide/RulesGuideView'));
const ArenaDuelView = lazy(() => import('./components/ArenaDuel/ArenaDuelView'));
const ProfileView = lazy(() => import('./components/Profile/ProfileView'));
const CardModal = lazy(() => import('./components/Card/CardModal'));
const OnboardingModal = lazy(() => import('./components/Onboarding/OnboardingModal'));
const AdminLoginModal = lazy(() => import('./components/Admin/AdminLoginModal'));
const GhostAdminModal = lazy(() => import('./components/Admin/GhostAdminModal'));

function ViewLoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-fadeIn">
      <div className="relative flex items-center justify-center">
        <div className="w-14 h-14 rounded-full border-2 border-red-600/30 border-t-red-500 animate-spin" />
        <div className="absolute w-8 h-8 rounded-full bg-red-950/80 border border-red-500/50 flex items-center justify-center shadow-blood">
          <span className="text-red-400 font-gothic text-xs font-bold animate-pulse">☥</span>
        </div>
      </div>
      <p className="font-gothic text-xs text-red-400 tracking-widest uppercase animate-pulse">
        Invocation des Arcanes...
      </p>
    </div>
  );
}

export default function App() {
  const initialRoute = parseCurrentRoute();
  const [activeView, setActiveView] = useState(initialRoute.view || 'rules');
  const [targetDeckId, setTargetDeckId] = useState(initialRoute.deckId || null);

  const [lang, setLang] = useState(() => storageGetRaw(LS_LANG, 'fr'));
  const [showOnboarding, setShowOnboarding] = useState(() => !storageGetRaw(LS_ONBOARDING));

  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  const [deckName, setDeckName] = useState('Nouveau Deck Londonien');
  const [deckCards, setDeckCards] = useState([]);
  const [savedDecks, setSavedDecks] = useState([]);
  const [inspectedCard, setInspectedCard] = useState(() => {
    if (initialRoute.cardId) {
      return CARDS_DATA.find(c => c.id.toLowerCase() === initialRoute.cardId.toLowerCase()) || null;
    }
    return null;
  });
  const [customImages, setCustomImages] = useState({});

  // Translation dictionary
  const t = TRANSLATIONS[lang] || TRANSLATIONS.fr;

  const handleLangChange = (newLang) => {
    setLang(newLang);
    storageSetRaw(LS_LANG, newLang);
  };

  // User Profile state (Collection, Arena Points, Match History)
  const [userProfile, setUserProfile] = useState(DEFAULT_USER_PROFILE);

  // Load saved data on mount & track visit
  useEffect(() => {
    try { trackVisit(); } catch (e) { console.error('Error tracking visit', e); }

    try {
      const savedDecksData = storageGet(LS_SAVED_DECKS);
      if (savedDecksData) setSavedDecks(savedDecksData);

      const profile = storageGet(LS_USER_PROFILE);
      if (profile) {
        setUserProfile(profile);
      } else {
        storageSet(LS_USER_PROFILE, DEFAULT_USER_PROFILE);
        setUserProfile(DEFAULT_USER_PROFILE);
      }

      const images = storageGet(LS_CUSTOM_IMAGES);
      if (images) setCustomImages(images);

      const current = storageGet(LS_CURRENT_DECK);
      if (current) {
        if (current.name) setDeckName(current.name);
        if (current.cardIds && Array.isArray(current.cardIds)) {
          const loadedCards = current.cardIds
            .map(id => CARDS_DATA.find(c => c.id === id))
            .filter(Boolean);
          setDeckCards(loadedCards);
        }
      } else {
        const starterCards = CARDS_DATA.slice(0, DEFAULT_STARTER_DECK_COUNT);
        setDeckCards(starterCards);
        setDeckName(DEFAULT_STARTER_DECK_NAME);
      }
    } catch (e) {
      console.error('Error loading saved data from localStorage:', e);
    }
  }, []);

  // Synchronisation avec l'historique du navigateur (Précédent / Suivant et Deep-links)
  useEffect(() => {
    const handleLocationChange = () => {
      const route = parseCurrentRoute();
      setActiveView(route.view);
      if (route.cardId) {
        const foundCard = CARDS_DATA.find(c => c.id.toLowerCase() === route.cardId.toLowerCase());
        if (foundCard) setInspectedCard(foundCard);
      } else {
        setInspectedCard(null);
      }
      if (route.deckId) {
        setTargetDeckId(route.deckId);
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('col-route-change', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('col-route-change', handleLocationChange);
    };
  }, []);

  // Navigation avec mise à jour d'URL sans rechargement
  const handleNavigate = (view, options = {}) => {
    setActiveView(view);
    if (options.deckId !== undefined) {
      setTargetDeckId(options.deckId);
    }
    navigateTo(view, options);
  };

  // Inspection de carte avec mise à jour du paramètre ?card=...
  const handleInspectCard = (card) => {
    setInspectedCard(card);
    if (card) {
      navigateTo(activeView, { cardId: card.id, deckId: targetDeckId });
    } else {
      navigateTo(activeView, { cardId: null, deckId: targetDeckId });
    }
  };

  const handleOnboardingComplete = (data) => {
    storageSetRaw(LS_ONBOARDING, 'true');
    if (data?.playerName) {
      handleUpdateProfile({ ...userProfile, playerName: data.playerName });
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
    if (deckCards.length >= MAX_DECK_SIZE) {
      alert(t?.deckbuilder?.maxCardsAlert || 'A deck cannot exceed 15 cards.');
      return;
    }
    if (deckCards.some(c => c.id === card.id)) {
      alert(t?.deckbuilder?.singletonAlert || 'This card is already in your deck (Singleton rule: 1 copy max).');
      return;
    }
    const newDeck = [...deckCards, card];
    setDeckCards(newDeck);
    storageSet(LS_CURRENT_DECK, { name: deckName, cardIds: newDeck.map(c => c.id) });
  };

  // Remove Card from Deck
  const handleRemoveCard = (cardId) => {
    const newDeck = deckCards.filter(c => c.id !== cardId);
    setDeckCards(newDeck);
    storageSet(LS_CURRENT_DECK, { name: deckName, cardIds: newDeck.map(c => c.id) });
  };

  // Clear Deck
  const handleClearDeck = () => {
    setDeckCards([]);
    storageRemove(LS_CURRENT_DECK);
  };

  // Load Saved or Meta / Community Deck
  const handleLoadDeck = (deck) => {
    const cards = deck.cardIds.map(id => CARDS_DATA.find(c => c.id === id)).filter(Boolean);
    setDeckCards(cards);
    setDeckName(deck.name);
    handleNavigate('deckbuilder');
    storageSet(LS_CURRENT_DECK, { name: deck.name, cardIds: cards.map(c => c.id) });
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  };

  // Navigate directly to Arena with a loaded deck
  const handleNavigateToArenaWithDeck = (deck) => {
    handleLoadDeck(deck);
    handleNavigate('arena');
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
    storageSet(LS_SAVED_DECKS, updated);
  };


  // Delete Deck
  const handleDeleteSavedDeck = (deckId) => {
    const updated = savedDecks.filter(d => d.id !== deckId);
    setSavedDecks(updated);
    storageSet(LS_SAVED_DECKS, updated);
  };

  // Profile actions
  const handleUpdateProfile = (newProfile) => {
    setUserProfile(newProfile);
    storageSet(LS_USER_PROFILE, newProfile);
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
    storageSet(LS_CUSTOM_IMAGES, updated);
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
        setActiveView={handleNavigate}
        deckCardsCount={deckCards.length}
        ownedCount={ownedCount}
        totalCount={CARDS_DATA.length}
        lang={lang}
        onChangeLang={handleLangChange}
        t={t}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 md:py-8">
        <Suspense fallback={<ViewLoadingFallback />}>
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
              onInspectCard={handleInspectCard}
              ownedCardIds={userProfile.ownedCardIds || []}
              userProfile={userProfile}
              lang={lang}
              t={t}
            />
          )}

          {activeView === 'database' && (
            <DatabaseView
              onInspectCard={handleInspectCard}
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
              onInspectCard={handleInspectCard}
              onNavigateToArena={handleNavigateToArenaWithDeck}
              currentDeckCards={deckCards}
              currentDeckName={deckName}
              userProfile={userProfile}
              targetDeckId={targetDeckId}
              lang={lang}
              t={t}
            />
          )}

          {activeView === 'metadecks' && (
            <MetaDecksView
              onLoadMetaDeck={handleLoadDeck}
              onInspectCard={handleInspectCard}
              ownedCardIds={userProfile.ownedCardIds || []}
              lang={lang}
              t={t}
            />
          )}

          {activeView === 'arena' && (
            <ArenaDuelView
              customDeckCardIds={deckCards.map(c => c.id)}
              onInspectCard={handleInspectCard}
              userProfile={userProfile}
              onUpdateProfile={handleUpdateProfile}
              lang={lang}
              t={t}
            />
          )}

          {activeView === 'rules' && (
            <RulesGuideView
              onGoToDeckBuilder={() => handleNavigate('deckbuilder')}
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
        </Suspense>
      </main>

      {/* Fullscreen Card Inspection Modal */}
      <Suspense fallback={null}>
        {activeInspectedCard && (
          <CardModal
            card={activeInspectedCard}
            onClose={() => handleInspectCard(null)}
            onAdd={handleAddCard}
            onRemove={handleRemoveCard}
            countInDeck={deckCards.some(c => c.id === activeInspectedCard.id) ? 1 : 0}
            onSelectCard={(c) => handleInspectCard(c)}
            onUpdateCardImage={handleUpdateCardImage}
            lang={lang}
            t={t}
          />
        )}

        {/* Secret Admin Authentication Modal */}
        {showAdminLogin && (
          <AdminLoginModal
            onClose={() => setShowAdminLogin(false)}
            onSuccess={() => {
              setShowAdminLogin(false);
              setShowAdminDashboard(true);
            }}
            lang={lang}
            t={t}
          />
        )}

        {/* Ghost Admin Telemetry & Registration Dashboard */}
        {showAdminDashboard && (
          <GhostAdminModal
            onClose={() => setShowAdminDashboard(false)}
            lang={lang}
            t={t}
          />
        )}
      </Suspense>

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
              {t?.brand?.dataSource || 'Data source:'}{' '}
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
              {t?.brand?.footerDevBy || 'Application developed by '}
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

      {/* Vercel Web Analytics & Speed Insights Tracking */}
      <Analytics />
      <SpeedInsights />
    </div>
  );
}
