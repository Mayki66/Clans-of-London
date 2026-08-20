import React, { useState, useEffect } from 'react';
import { 
  Crown, Shield, Droplets, Trophy, RotateCcw, Play, ChevronRight, 
  Sparkles, Swords, ArrowUp, Undo2, HelpCircle, Eye, RefreshCw, Zap, X, Info, Layers, BookOpen, ScrollText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CARDS_DATA } from '../../data/cardsData';
import { META_DECKS } from '../../data/metaDecks';
import { ARENA_LOCATIONS } from '../../data/arenaLocations';
import { AI_OPPONENTS, playAITurn } from '../../utils/aiOpponent';

export default function ArenaDuelView({ customDeckCardIds = [], onInspectCard }) {
  // Setup & Matchmaking state
  const [selectedLocation, setSelectedLocation] = useState(ARENA_LOCATIONS[0]); // Buckingham Palace
  const [selectedAI, setSelectedAI] = useState(AI_OPPONENTS[0]); // Klinklecut
  const [playerDeckId, setPlayerDeckId] = useState('custom');
  const [gamePhase, setGamePhase] = useState('setup'); // 'setup' | 'playing' | 'revealing' | 'scoring' | 'round_transition' | 'game_over'
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Match progression
  const [turn, setTurn] = useState(1);
  const [maxTurns] = useState(7);
  const [bloodAvailable, setBloodAvailable] = useState(2);
  const [totalBloodTurn, setTotalBloodTurn] = useState(2);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAIScore] = useState(0);
  
  // Entire 15-Card Player Deck (for Left Column Deck Tracker)
  const [fullPlayerDeck, setFullPlayerDeck] = useState([]);

  // Hands & Piles
  const [playerHand, setPlayerHand] = useState([]);
  const [playerDrawPile, setPlayerDrawPile] = useState([]);
  const [playerDiscard, setPlayerDiscard] = useState([]);

  const [aiHand, setAIHand] = useState([]);
  const [aiDrawPile, setAIDrawPile] = useState([]);
  const [aiDiscard, setAIDiscard] = useState([]);

  // Animation states
  const [revealingCard, setRevealingCard] = useState(null);
  const [roundTransitionText, setRoundTransitionText] = useState('');
  const [scoringMedals, setScoringMedals] = useState({ knight_left: 0, prince: 0, knight_right: 0 });
  const [selectedHandCard, setSelectedHandCard] = useState(null);
  const [historyLogs, setHistoryLogs] = useState([]);
  const [turnActionHistory, setTurnActionHistory] = useState([]);

  // 15-Space Tactical Board
  const [board, setBoard] = useState({
    ai_pawn_0: { key: 'ai_pawn_0', name: 'Pion Nord Ouest', row: 'ai_pawn', col: 0, card: null, power: 0, faceDown: false },
    ai_pawn_1: { key: 'ai_pawn_1', name: 'Pion Nord Centre', row: 'ai_pawn', col: 1, card: null, power: 0, faceDown: false },
    ai_pawn_2: { key: 'ai_pawn_2', name: 'Pion Nord Est', row: 'ai_pawn', col: 2, card: null, power: 0, faceDown: false },

    ai_rook_0: { key: 'ai_rook_0', name: 'Tour Nord Ouest', row: 'ai_rook', col: 0, card: null, power: 0, faceDown: false },
    ai_rook_1: { key: 'ai_rook_1', name: 'Tour Nord Centre', row: 'ai_rook', col: 1, card: null, power: 0, faceDown: false },
    ai_rook_2: { key: 'ai_rook_2', name: 'Tour Nord Est', row: 'ai_rook', col: 2, card: null, power: 0, faceDown: false },

    knight_left: { key: 'knight_left', name: 'Cavalier Ouest', type: 'Knight', points: 2, playerCard: null, aiCard: null, playerPower: 0, aiPower: 0, col: 0, faceDownPlayer: false, faceDownAI: false },
    prince: { key: 'prince', name: 'Trône du Prince', type: 'Prince', points: '1 pt/allié', playerCard: null, aiCard: null, playerPower: 0, aiPower: 0, col: 1, faceDownPlayer: false, faceDownAI: false },
    knight_right: { key: 'knight_right', name: 'Cavalier Est', type: 'Knight', points: 2, playerCard: null, aiCard: null, playerPower: 0, aiPower: 0, col: 2, faceDownPlayer: false, faceDownAI: false },

    player_rook_0: { key: 'player_rook_0', name: 'Tour Sud Ouest', row: 'player_rook', col: 0, card: null, power: 0, faceDown: false },
    player_rook_1: { key: 'player_rook_1', name: 'Tour Sud Centre', row: 'player_rook', col: 1, card: null, power: 0, faceDown: false },
    player_rook_2: { key: 'player_rook_2', name: 'Tour Sud Est', row: 'player_rook', col: 2, card: null, power: 0, faceDown: false },

    player_pawn_0: { key: 'player_pawn_0', name: 'Pion Sud Ouest', row: 'player_pawn', col: 0, card: null, power: 0, faceDown: false },
    player_pawn_1: { key: 'player_pawn_1', name: 'Pion Sud Centre', row: 'player_pawn', col: 1, card: null, power: 0, faceDown: false },
    player_pawn_2: { key: 'player_pawn_2', name: 'Pion Sud Est', row: 'player_pawn', col: 2, card: null, power: 0, faceDown: false },
  });

  // Dynamic Passive Powers (Cynthia +1 to Prince, Mr Moore +2 to Prince, Abigail Smith +2 in front, etc.)
  const computeBoardPowers = (currentBoard) => {
    let updated = { ...currentBoard };

    let playerPrinceBonus = 0;
    let aiPrinceBonus = 0;

    ['player_pawn_0', 'player_pawn_1', 'player_pawn_2', 'player_rook_0', 'player_rook_1', 'player_rook_2'].forEach(k => {
      const c = updated[k]?.card;
      if (!c) return;
      if (c.name === 'Cynthia Hargreaves') playerPrinceBonus += 1;
      if (c.name === 'Mr Moore') playerPrinceBonus += 2;
      if (c.name === 'Jürgen Mayer' && updated.prince.playerCard?.archetype === 'Élitiste') playerPrinceBonus += 2;
    });

    ['ai_pawn_0', 'ai_pawn_1', 'ai_pawn_2', 'ai_rook_0', 'ai_rook_1', 'ai_rook_2'].forEach(k => {
      const c = updated[k]?.card;
      if (!c) return;
      if (c.name === 'Cynthia Hargreaves') aiPrinceBonus += 1;
      if (c.name === 'Mr Moore') aiPrinceBonus += 2;
      if (c.name === 'Jürgen Mayer' && updated.prince.aiCard?.archetype === 'Élitiste') aiPrinceBonus += 2;
    });

    if (updated.prince.playerCard) {
      updated.prince = {
        ...updated.prince,
        playerPower: (updated.prince.playerCard.power || 0) + playerPrinceBonus
      };
    }
    if (updated.prince.aiCard) {
      updated.prince = {
        ...updated.prince,
        aiPower: (updated.prince.aiCard.power || 0) + aiPrinceBonus
      };
    }

    [0, 1, 2].forEach(col => {
      const pawnCard = updated[`player_pawn_${col}`]?.card;
      const rookSpace = updated[`player_rook_${col}`];
      if (pawnCard?.name === 'Abigail Smith' && rookSpace?.card?.archetype === 'Élitiste') {
        updated[`player_rook_${col}`] = {
          ...rookSpace,
          power: (rookSpace.card.power || 0) + 2
        };
      }
    });

    return updated;
  };

  // Support Chains Calculation (including diagonal links to Prince)
  const calculateEffectivePower = () => {
    const playerChain = [0, 1, 2].map(col => {
      const pawn = board[`player_pawn_${col}`]?.card;
      const rook = board[`player_rook_${col}`]?.card;
      
      let pawnPower = board[`player_pawn_${col}`]?.power || 0;
      let rookPower = board[`player_rook_${col}`]?.power || 0;

      if (pawn && (pawn.ability_en?.includes('Cannot give support') || pawn.ability?.includes('Ne peut pas donner de soutien'))) pawnPower = 0;
      if (rook && (rook.ability_en?.includes('Cannot give support') || rook.ability?.includes('Ne peut pas donner de soutien'))) rookPower = 0;

      return {
        col,
        hasPawn: !!pawn,
        hasRook: !!rook,
        totalSupportToFront: (pawn ? pawnPower : 0) + (rook ? rookPower : 0)
      };
    });

    const aiChain = [0, 1, 2].map(col => {
      const pawn = board[`ai_pawn_${col}`]?.card;
      const rook = board[`ai_rook_${col}`]?.card;

      let pawnPower = board[`ai_pawn_${col}`]?.power || 0;
      let rookPower = board[`ai_rook_${col}`]?.power || 0;

      if (pawn && (pawn.ability_en?.includes('Cannot give support') || pawn.ability?.includes('Ne peut pas donner de soutien'))) pawnPower = 0;
      if (rook && (rook.ability_en?.includes('Cannot give support') || rook.ability?.includes('Ne peut pas donner de soutien'))) rookPower = 0;

      return {
        col,
        hasPawn: !!pawn,
        hasRook: !!rook,
        totalSupportToFront: (pawn ? pawnPower : 0) + (rook ? rookPower : 0)
      };
    });

    return { playerChain, aiChain };
  };

  const { playerChain, aiChain } = calculateEffectivePower();

  // Validate placement according to Support Chain rules:
  // - Pawn: Always allowed (Row 1 base)
  // - Rook Col i: Requires Pawn Col i
  // - Knight Left: Requires Rook 0
  // - Knight Right: Requires Rook 2
  // - Prince: Requires Rook 0 OR Rook 1 OR Rook 2!
  const isPlacementValid = (spaceKey, card) => {
    if (!card) return false;

    // Special bypass: Shifa can be played anywhere
    if (card.name === 'Shifa' || card.ability_en?.toLowerCase().includes('can be played anywhere')) {
      return true;
    }
    // Special bypass: Brixton can only be Knight and requires no support
    if (card.name === 'Brixton' || card.originalName === 'Brixton') {
      return spaceKey === 'knight_left' || spaceKey === 'knight_right';
    }

    // Pawn row: always valid base
    if (spaceKey.startsWith('player_pawn')) {
      return true;
    }

    // Rook row: requires pawn behind in same column
    if (spaceKey === 'player_rook_0') return !!board.player_pawn_0.card;
    if (spaceKey === 'player_rook_1') return !!board.player_pawn_1.card;
    if (spaceKey === 'player_rook_2') return !!board.player_pawn_2.card;

    // Knight Left: requires Rook 0
    if (spaceKey === 'knight_left') return !!board.player_rook_0.card;

    // Knight Right: requires Rook 2
    if (spaceKey === 'knight_right') return !!board.player_rook_2.card;

    // Prince (Center Throne): Connected from Rook 0, Rook 1, OR Rook 2!
    if (spaceKey === 'prince') {
      return !!board.player_rook_0.card || !!board.player_rook_1.card || !!board.player_rook_2.card;
    }

    return false;
  };

  // Start match
  const initMatch = () => {
    let pCards = [];
    if (playerDeckId === 'custom' && customDeckCardIds.length >= 10) {
      pCards = customDeckCardIds.map(id => CARDS_DATA.find(c => c.id === id)).filter(Boolean);
    } else {
      const selectedMeta = META_DECKS.find(d => d.id === playerDeckId) || META_DECKS[0];
      pCards = selectedMeta.cardIds.map(id => CARDS_DATA.find(c => c.id === id)).filter(Boolean);
    }

    setFullPlayerDeck(pCards);

    const pGuaranteed = pCards.filter(c => c.ability_en?.toLowerCase().includes('starts in your opening hand') || c.name === 'Katie Dixon');
    const pRest = pCards.filter(c => !pGuaranteed.some(g => g.id === c.id)).sort(() => Math.random() - 0.5);
    const pHand = [...pGuaranteed, ...pRest.slice(0, 4 - pGuaranteed.length)];
    const pDraw = pRest.slice(4 - pGuaranteed.length);

    const aiMeta = META_DECKS.find(d => d.id === selectedAI.metaDeckId) || META_DECKS[2];
    const aiCards = aiMeta.cardIds.map(id => CARDS_DATA.find(c => c.id === id)).filter(Boolean);
    const aiGuaranteed = aiCards.filter(c => c.ability_en?.toLowerCase().includes('starts in your opening hand') || c.name === 'Katie Dixon');
    const aiRest = aiCards.filter(c => !aiGuaranteed.some(g => g.id === c.id)).sort(() => Math.random() - 0.5);
    const aiHandInitial = [...aiGuaranteed, ...aiRest.slice(0, 4 - aiGuaranteed.length)];
    const aiDrawInitial = aiRest.slice(4 - aiGuaranteed.length);

    setTurn(1);
    setBloodAvailable(2);
    setTotalBloodTurn(2);
    setPlayerScore(0);
    setAIScore(0);
    setPlayerHand(pHand);
    setPlayerDrawPile(pDraw);
    setPlayerDiscard([]);
    setAIHand(aiHandInitial);
    setAIDrawPile(aiDrawInitial);
    setAIDiscard([]);
    setSelectedHandCard(null);
    setTurnActionHistory([]);
    setRevealingCard(null);

    const freshBoard = {
      ai_pawn_0: { key: 'ai_pawn_0', name: 'Pion Nord Ouest', row: 'ai_pawn', col: 0, card: null, power: 0, faceDown: false },
      ai_pawn_1: { key: 'ai_pawn_1', name: 'Pion Nord Centre', row: 'ai_pawn', col: 1, card: null, power: 0, faceDown: false },
      ai_pawn_2: { key: 'ai_pawn_2', name: 'Pion Nord Est', row: 'ai_pawn', col: 2, card: null, power: 0, faceDown: false },

      ai_rook_0: { key: 'ai_rook_0', name: 'Tour Nord Ouest', row: 'ai_rook', col: 0, card: null, power: 0, faceDown: false },
      ai_rook_1: { key: 'ai_rook_1', name: 'Tour Nord Centre', row: 'ai_rook', col: 1, card: null, power: 0, faceDown: false },
      ai_rook_2: { key: 'ai_rook_2', name: 'Tour Nord Est', row: 'ai_rook', col: 2, card: null, power: 0, faceDown: false },

      knight_left: { key: 'knight_left', name: 'Cavalier Ouest', type: 'Knight', points: 2, playerCard: null, aiCard: null, playerPower: 0, aiPower: 0, col: 0, faceDownPlayer: false, faceDownAI: false },
      prince: { key: 'prince', name: 'Trône du Prince', type: 'Prince', points: '1 pt/allié', playerCard: null, aiCard: null, playerPower: 0, aiPower: 0, col: 1, faceDownPlayer: false, faceDownAI: false },
      knight_right: { key: 'knight_right', name: 'Cavalier Est', type: 'Knight', points: 2, playerCard: null, aiCard: null, playerPower: 0, aiPower: 0, col: 2, faceDownPlayer: false, faceDownAI: false },

      player_rook_0: { key: 'player_rook_0', name: 'Tour Sud Ouest', row: 'player_rook', col: 0, card: null, power: 0, faceDown: false },
      player_rook_1: { key: 'player_rook_1', name: 'Tour Sud Centre', row: 'player_rook', col: 1, card: null, power: 0, faceDown: false },
      player_rook_2: { key: 'player_rook_2', name: 'Tour Sud Est', row: 'player_rook', col: 2, card: null, power: 0, faceDown: false },

      player_pawn_0: { key: 'player_pawn_0', name: 'Pion Sud Ouest', row: 'player_pawn', col: 0, card: null, power: 0, faceDown: false },
      player_pawn_1: { key: 'player_pawn_1', name: 'Pion Sud Centre', row: 'player_pawn', col: 1, card: null, power: 0, faceDown: false },
      player_pawn_2: { key: 'player_pawn_2', name: 'Pion Sud Est', row: 'player_pawn', col: 2, card: null, power: 0, faceDown: false },
    };

    setBoard(freshBoard);
    setHistoryLogs([
      `Arène : ${selectedLocation.name} (${selectedLocation.modifierName} active).`,
      `Duel contre ${selectedAI.name} (${selectedAI.clan}). Tour 1 : 2 Sang disponibles.`
    ]);

    setGamePhase('playing');
    setShowLocationModal(true);
  };

  // Deploy Card
  const handleDeployToSpace = (spaceKey) => {
    if (!selectedHandCard) return;
    if (selectedHandCard.cost > bloodAvailable) {
      alert(`Pas assez de Sang ! Coût : ${selectedHandCard.cost} Sang (Disponible : ${bloodAvailable})`);
      return;
    }

    // Check Placement Connection Rule
    if (!isPlacementValid(spaceKey, selectedHandCard)) {
      alert("Placement interdit : Vous devez d'abord poser une carte sur le Pion (ou la Tour) derrière pour établir le lien de chaîne !");
      return;
    }

    const targetSpace = board[spaceKey];
    if (targetSpace.card || (targetSpace.playerCard && (spaceKey === 'prince' || spaceKey.startsWith('knight')))) {
      alert('Cet emplacement est déjà occupé par une de vos unités !');
      return;
    }

    // Save state for undo
    setTurnActionHistory(prev => [...prev, {
      boardState: { ...board },
      handState: [...playerHand],
      bloodState: bloodAvailable,
      cardPlayed: selectedHandCard,
      spaceKey
    }]);

    setBloodAvailable(prev => prev - selectedHandCard.cost);
    setPlayerHand(prev => prev.filter(c => c.id !== selectedHandCard.id));

    let updatedBoard = { ...board };
    if (spaceKey === 'prince' || spaceKey.startsWith('knight')) {
      updatedBoard[spaceKey] = {
        ...updatedBoard[spaceKey],
        playerCard: selectedHandCard,
        playerPower: selectedHandCard.power,
        faceDownPlayer: true
      };
    } else {
      updatedBoard[spaceKey] = {
        ...updatedBoard[spaceKey],
        card: selectedHandCard,
        power: selectedHandCard.power,
        faceDown: true
      };
    }

    const finalBoard = computeBoardPowers(updatedBoard);
    setBoard(finalBoard);

    setHistoryLogs(prev => [
      `Vous avez placé "${selectedHandCard.name}" sur ${targetSpace.name}.`,
      ...prev
    ]);

    setSelectedHandCard(null);
  };

  // Undo
  const handleUndo = () => {
    if (turnActionHistory.length === 0) return;
    const last = turnActionHistory[turnActionHistory.length - 1];
    setBoard(last.boardState);
    setPlayerHand(last.handState);
    setBloodAvailable(last.bloodState);
    setSelectedHandCard(null);
    setTurnActionHistory(prev => prev.slice(0, -1));
  };

  // End Turn & Combat Phase
  const handleEndTurn = async () => {
    setGamePhase('revealing');

    const aiResult = playAITurn(
      { hand: aiHand, bloodAvailable: totalBloodTurn, board },
      { hand: playerHand, bloodAvailable, board },
      selectedLocation
    );

    let tempBoard = { ...aiResult.updatedBoard };
    let tempAIHand = aiResult.remainingHand;

    const cardsToReveal = [];
    Object.keys(tempBoard).forEach(k => {
      if (tempBoard[k].faceDown && tempBoard[k].card) {
        cardsToReveal.push({ card: tempBoard[k].card, spaceKey: k, owner: 'player' });
      }
      if (tempBoard[k].faceDownPlayer && tempBoard[k].playerCard) {
        cardsToReveal.push({ card: tempBoard[k].playerCard, spaceKey: k, owner: 'player' });
      }
    });

    aiResult.playedCards.forEach(pc => {
      cardsToReveal.push({ card: pc.card, spaceKey: pc.spaceKey, owner: 'ai' });
    });

    for (const item of cardsToReveal) {
      setRevealingCard(item.card);
      await new Promise(r => setTimeout(r, 1100));
    }
    setRevealingCard(null);

    Object.keys(tempBoard).forEach(k => {
      tempBoard[k].faceDown = false;
      tempBoard[k].faceDownPlayer = false;
      tempBoard[k].faceDownAI = false;
    });

    tempBoard = computeBoardPowers(tempBoard);
    setBoard(tempBoard);

    setGamePhase('scoring');
    await new Promise(r => setTimeout(r, 800));

    let roundPlayerPts = 0;
    let roundAIPts = 0;
    const combatLogs = [...aiResult.logs];

    const { playerChain: pCh, aiChain: aCh } = calculateEffectivePower();

    // Knight West
    const kw = tempBoard.knight_left;
    const pKW = (kw.playerCard ? kw.playerPower : 0) + pCh[0].totalSupportToFront;
    const aKW = (kw.aiCard ? kw.aiPower : 0) + aCh[0].totalSupportToFront;
    let kwMedal = 0;

    if (pKW > aKW && pKW > 0) {
      roundPlayerPts += 2;
      kwMedal = 2;
      combatLogs.push(`⚔️ Cavalier Ouest : Vous l'emportez (${pKW} vs ${aKW}) -> +2 Pts.`);
    } else if (aKW > pKW && aKW > 0) {
      roundAIPts += 2;
      combatLogs.push(`⚔️ Cavalier Ouest : ${selectedAI.name} l'emporte (${aKW} vs ${pKW}) -> +2 Pts IA.`);
    }

    // Knight East
    const ke = tempBoard.knight_right;
    const pKE = (ke.playerCard ? ke.playerPower : 0) + pCh[2].totalSupportToFront;
    const aKE = (ke.aiCard ? ke.aiPower : 0) + aCh[2].totalSupportToFront;
    let keMedal = 0;

    if (pKE > aKE && pKE > 0) {
      roundPlayerPts += 2;
      keMedal = 2;
      combatLogs.push(`⚔️ Cavalier Est : Vous l'emportez (${pKE} vs ${aKE}) -> +2 Pts.`);
    } else if (aKE > pKE && aKE > 0) {
      roundAIPts += 2;
      combatLogs.push(`⚔️ Cavalier Est : ${selectedAI.name} l'emporte (${aKE} vs ${pKE}) -> +2 Pts IA.`);
    }

    // Prince Throne (Support from Col 0, 1, 2)
    const pr = tempBoard.prince;
    const pPr = (pr.playerCard ? pr.playerPower : 0) + pCh[1].totalSupportToFront;
    const aPr = (pr.aiCard ? pr.aiPower : 0) + aCh[1].totalSupportToFront;

    const totalPlayerAllies = ['player_pawn_0', 'player_pawn_1', 'player_pawn_2', 'player_rook_0', 'player_rook_1', 'player_rook_2']
      .filter(k => tempBoard[k]?.card).length + (kw.playerCard ? 1 : 0) + (ke.playerCard ? 1 : 0) + (pr.playerCard ? 1 : 0);

    const totalAIAllies = ['ai_pawn_0', 'ai_pawn_1', 'ai_pawn_2', 'ai_rook_0', 'ai_rook_1', 'ai_rook_2']
      .filter(k => tempBoard[k]?.card).length + (kw.aiCard ? 1 : 0) + (ke.aiCard ? 1 : 0) + (pr.aiCard ? 1 : 0);

    let prMedal = 0;
    if (pPr > aPr && pPr > 0) {
      roundPlayerPts += totalPlayerAllies;
      prMedal = totalPlayerAllies;
      combatLogs.push(`👑 Trône du Prince : Vous régnez ! (${pPr} vs ${aPr}) -> +${totalPlayerAllies} Pts.`);
    } else if (aPr > pPr && aPr > 0) {
      roundAIPts += totalAIAllies;
      combatLogs.push(`👑 Trône du Prince : ${selectedAI.name} règne ! (${aPr} vs ${pPr}) -> +${totalAIAllies} Pts IA.`);
    }

    setScoringMedals({ knight_left: kwMedal, prince: prMedal, knight_right: keMedal });
    await new Promise(r => setTimeout(r, 1200));

    let newPlayerDiscard = [...playerDiscard];
    let newPlayerHand = [...playerHand];
    if (selectedLocation.id === 'st-pauls-cathedral' && newPlayerDiscard.length > 0) {
      const recovered = newPlayerDiscard.pop();
      newPlayerHand.push(recovered);
      combatLogs.push(`⛪ Résilience Impie : "${recovered.name}" retourne de votre défausse dans votre main !`);
    }

    const updatedPScore = playerScore + roundPlayerPts;
    const updatedAIScore = aiScore + roundAIPts;
    setPlayerScore(updatedPScore);
    setAIScore(updatedAIScore);
    setTurnActionHistory([]);
    setScoringMedals({ knight_left: 0, prince: 0, knight_right: 0 });

    if (turn >= maxTurns) {
      setGamePhase('game_over');
      if (updatedPScore > updatedAIScore) {
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
      }
      setHistoryLogs(prev => [
        `🏆 FIN DU MATCH : Score Final -> MAYKI : ${updatedPScore} Pts | ${selectedAI.name} : ${updatedAIScore} Pts`,
        ...combatLogs,
        ...prev
      ]);
      return;
    }

    const nextTurnNum = turn + 1;
    const nextBlood = nextTurnNum + 1;

    setRoundTransitionText(nextTurnNum === 7 ? 'DERNIÈRE MANCHE' : `MANCHE ${nextTurnNum} SUR 7`);
    setGamePhase('round_transition');
    await new Promise(r => setTimeout(r, 1400));
    setRoundTransitionText('');

    let pDraw = [...playerDrawPile];
    let pDrawn = pDraw.shift();
    if (pDrawn) newPlayerHand.push(pDrawn);

    let aiDraw = [...aiDrawPile];
    let aiDrawn = aiDraw.shift();
    if (aiDrawn) tempAIHand.push(aiDrawn);

    setTurn(nextTurnNum);
    setBloodAvailable(nextBlood);
    setTotalBloodTurn(nextBlood);
    setPlayerHand(newPlayerHand);
    setPlayerDrawPile(pDraw);
    setPlayerDiscard(newPlayerDiscard);
    setAIHand(tempAIHand);
    setAIDrawPile(aiDraw);
    setGamePhase('playing');

    setHistoryLogs(prev => [
      `--- MANCHE ${nextTurnNum} / 7 (+${nextBlood} Sang) ---`,
      ...combatLogs,
      ...prev
    ]);
  };

  // Helper to determine card state for the Deck Tracker
  const getDeckCardStatus = (card) => {
    // 1. Is in Hand?
    if (playerHand.some(c => c.id === card.id)) return 'hand';
    // 2. Is on Board?
    const onBoard = Object.values(board).some(sp => sp.card?.id === card.id || sp.playerCard?.id === card.id);
    if (onBoard) return 'board';
    // 3. Is Defeated / in Discard?
    if (playerDiscard.some(c => c.id === card.id)) return 'defeated';
    // 4. Default in deck
    return 'deck';
  };

  // Setup / Matchmaking Screen
  if (gamePhase === 'setup') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="glass-panel-blood rounded-2xl p-6 md:p-8 border border-red-500/30 shadow-2xl text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-semibold uppercase tracking-wider">
            <Swords className="w-3.5 h-3.5" />
            <span>Arène Officielle & Simulateur Duel IA</span>
          </div>
          <h1 className="font-gothic font-extrabold text-3xl md:text-4xl text-gray-100">
            Arène de Combat de Londres
          </h1>
          <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Affrontez une Intelligence Artificielle en conditions réelles sur le plateau officiel à 15 cases. Gérez votre Sang, établissez vos chaînes de soutien et conquérez le Trône du Prince en 7 manches !
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Location Choice */}
          <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-amber-400 font-gothic font-bold text-sm mb-3">
                <Crown className="w-4 h-4" />
                <span>1. Lieu & Règle Globale</span>
              </div>
              <div className="space-y-2">
                {ARENA_LOCATIONS.map(loc => (
                  <div
                    key={loc.id}
                    onClick={() => setSelectedLocation(loc)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      selectedLocation.id === loc.id
                        ? 'bg-red-950/60 border-red-500 shadow-blood text-white'
                        : 'bg-[#0c0f16] border-white/10 text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <div className="font-gothic font-bold text-xs text-amber-300">{loc.name}</div>
                    <div className="text-[11px] font-mono text-red-300 mt-0.5">{loc.modifierName}</div>
                    <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">{loc.modifierDescription}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Opponent Choice */}
          <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-purple-400 font-gothic font-bold text-sm mb-3">
                <Sparkles className="w-4 h-4" />
                <span>2. Adversaire IA</span>
              </div>
              <div className="space-y-2">
                {AI_OPPONENTS.map(ai => (
                  <div
                    key={ai.id}
                    onClick={() => setSelectedAI(ai)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center space-x-3 ${
                      selectedAI.id === ai.id
                        ? 'bg-purple-950/60 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)] text-white'
                        : 'bg-[#0c0f16] border-white/10 text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <img src={ai.avatarUrl} alt={ai.name} className="w-10 h-10 rounded-full border border-white/20 object-cover" />
                    <div>
                      <div className="font-gothic font-bold text-xs text-gray-100">{ai.name}</div>
                      <div className="text-[10px] font-mono text-purple-300">Clan {ai.clan}</div>
                      <div className="text-[9px] text-gray-400 line-clamp-1">{ai.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Deck Choice */}
          <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-emerald-400 font-gothic font-bold text-sm mb-3">
                <Shield className="w-4 h-4" />
                <span>3. Votre Deck de Combat</span>
              </div>
              <div className="space-y-2">
                <div
                  onClick={() => setPlayerDeckId('custom')}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    playerDeckId === 'custom'
                      ? 'bg-emerald-950/60 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)] text-white'
                      : 'bg-[#0c0f16] border-white/10 text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <div className="font-gothic font-bold text-xs text-emerald-300">Mon Deck Personnalisé</div>
                  <div className="text-[10px] font-mono text-gray-400 mt-0.5">
                    {customDeckCardIds.length} cartes sélectionnées
                  </div>
                </div>

                <div className="text-[10px] uppercase font-mono text-gray-500 pt-1">Ou choisir un Deck Méta :</div>
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                  {META_DECKS.slice(0, 5).map(md => (
                    <div
                      key={md.id}
                      onClick={() => setPlayerDeckId(md.id)}
                      className={`p-2 rounded-lg border text-xs transition-all cursor-pointer ${
                        playerDeckId === md.id
                          ? 'bg-red-950/70 border-red-500 text-white'
                          : 'bg-[#090b10] border-white/5 text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      <div className="font-gothic font-bold text-[11px] truncate">{md.name}</div>
                      <div className="text-[9px] font-mono text-amber-400">{md.tier} • {md.clan}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            onClick={initMatch}
            className="px-10 py-4 rounded-2xl bg-gradient-to-r from-red-800 via-red-700 to-rose-900 hover:from-red-700 hover:to-rose-800 text-white font-gothic font-extrabold text-base shadow-blood transition-all transform hover:scale-105"
          >
            ⚔️ Lancer le Match d'Arène
          </button>
        </div>
      </div>
    );
  }

  // Active Match: 3-Column Ergonomic Layout (Left: Deck | Center: Board & Hand | Right: Combat Log)
  return (
    <div className="max-w-7xl mx-auto pb-8 select-none relative space-y-3">
      
      {/* 1. Location Rule Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel-blood max-w-sm w-full rounded-2xl overflow-hidden border border-red-500/40 shadow-2xl p-6 text-center space-y-4 relative">
            <button
              onClick={() => setShowLocationModal(false)}
              className="absolute top-3 right-3 p-1 rounded-full bg-white/10 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-16 h-16 mx-auto rounded-full bg-red-950 border-2 border-red-500 flex items-center justify-center shadow-blood text-3xl">
              👑
            </div>

            <div>
              <h3 className="font-gothic font-extrabold text-2xl text-amber-300">{selectedLocation.name}</h3>
              <p className="text-xs text-gray-300 mt-1">{selectedLocation.subtitle}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-black/60 border border-red-500/30 space-y-1">
              <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider block">
                {selectedLocation.modifierName}
              </span>
              <p className="text-xs text-gray-200 leading-relaxed font-gothic">
                « {selectedLocation.modifierDescription} »
              </p>
            </div>

            <button
              onClick={() => setShowLocationModal(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-rose-900 text-white font-gothic font-bold text-xs shadow-blood"
            >
              Entrer dans l'Arène
            </button>
          </div>
        </div>
      )}

      {/* 2. Giant Card Showcase Zoom Reveal Overlay */}
      {revealingCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-zoomIn pointer-events-none">
          <div className="w-72 sm:w-80 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-[0_0_40px_rgba(212,175,55,0.6)] bg-gradient-to-b from-[#1c1424] to-[#0b0810] p-4 text-center space-y-3 animate-pulse">
            <div className="flex justify-between items-center px-1">
              <span className="w-7 h-7 rounded-full bg-red-900 border border-red-400 text-xs font-bold text-white flex items-center justify-center font-mono shadow-blood">
                {revealingCard.cost}
              </span>
              <span className="font-mono text-amber-400 text-sm font-bold bg-black/60 px-2 py-0.5 rounded border border-amber-500/40">
                P{revealingCard.power}
              </span>
            </div>

            <div className="w-full h-56 rounded-xl overflow-hidden border border-white/10 bg-black/40">
              <img src={revealingCard.imageUrl} alt={revealingCard.name} className="w-full h-full object-cover" />
            </div>

            <div>
              <h3 className="font-gothic font-extrabold text-xl text-amber-200">{revealingCard.name}</h3>
              <p className="text-[11px] font-mono text-purple-300">{revealingCard.clan} • {revealingCard.archetype}</p>
            </div>

            <p className="text-[11px] text-gray-300 font-gothic px-2 line-clamp-3">
              {revealingCard.ability}
            </p>
          </div>
        </div>
      )}

      {/* 3. Round Transition Banner ("MANCHE X SUR 7") */}
      {roundTransitionText && (
        <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none animate-fadeIn">
          <div className="w-full py-6 bg-gradient-to-r from-transparent via-red-950/95 to-transparent border-y-2 border-red-500/80 shadow-[0_0_50px_rgba(220,38,38,0.8)] text-center">
            <h2 className="font-gothic font-extrabold text-3xl sm:text-4xl text-amber-200 tracking-widest uppercase animate-scaleUp drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]">
              {roundTransitionText}
            </h2>
          </div>
        </div>
      )}

      {/* 4. Victory Screen */}
      {gamePhase === 'game_over' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-fadeIn">
          <div className="max-w-md w-full rounded-2xl glass-panel-blood border-2 border-amber-400 p-6 text-center space-y-5 shadow-[0_0_50px_rgba(212,175,55,0.4)]">
            <div className="space-y-1">
              <h2 className="font-gothic font-extrabold text-4xl text-amber-300 tracking-wider">
                {playerScore > aiScore ? 'VICTOIRE' : playerScore < aiScore ? 'DÉFAITE' : 'ÉGALITÉ'}
              </h2>
              <p className="font-mono text-xs tracking-widest text-red-400 uppercase">
                {playerScore > aiScore ? 'VICTORIA EST IMMORTALITAS' : 'LONDRES APPARTIENT AUX RIVAUX'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-black/60 border border-white/10">
              <div>
                <span className="text-[10px] font-mono uppercase text-gray-400">Votre Score</span>
                <div className="text-3xl font-extrabold font-gothic text-emerald-400">{playerScore} Pts</div>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-gray-400">{selectedAI.name}</span>
                <div className="text-3xl font-extrabold font-gothic text-purple-400">{aiScore} Pts</div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={initMatch}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-700 to-rose-900 text-white font-gothic font-bold text-xs shadow-blood hover:from-red-600 hover:to-rose-800"
              >
                Rejouer un Match
              </button>
              <button
                onClick={() => setGamePhase('setup')}
                className="flex-1 py-3 rounded-xl bg-[#141824] border border-white/10 text-gray-300 hover:text-white font-gothic font-bold text-xs"
              >
                Quitter l'Arène
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3-COLUMN RESPONSIVE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* LEFT COLUMN: Deck Tracker (15 Cards) */}
        <div className="lg:col-span-3 glass-panel rounded-2xl p-3.5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center space-x-2 text-amber-400 font-gothic font-bold text-xs">
              <Layers className="w-4 h-4" />
              <span>Votre Deck ({fullPlayerDeck.length})</span>
            </div>
            <span className="text-[10px] font-mono text-gray-400">
              Main : {playerHand.length}
            </span>
          </div>

          <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
            {fullPlayerDeck.map((card) => {
              const status = getDeckCardStatus(card);

              return (
                <div
                  key={card.id}
                  onClick={() => onInspectCard?.(card)}
                  className={`p-1.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                    status === 'hand'
                      ? 'bg-blue-950/40 border-cyan-400/80 text-cyan-200 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                      : status === 'board'
                        ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400/50'
                        : status === 'defeated'
                          ? 'bg-black/40 border-white/5 text-gray-600 grayscale opacity-35 line-through'
                          : 'bg-[#0d1017] border-white/10 text-gray-300 hover:border-white/25'
                  }`}
                  title={`${card.name} (${card.cost} Sang / ${card.power} Puiss)`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span className="w-4 h-4 rounded-full bg-red-900 border border-red-500 text-[9px] font-bold text-white flex items-center justify-center font-mono">
                      {card.cost}
                    </span>
                    <span className="font-gothic text-[11px] truncate">{card.name}</span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <span className="font-mono text-[10px] font-bold text-amber-400">P{card.power}</span>
                    {/* "M" badge when in Hand */}
                    {status === 'hand' && (
                      <span className="px-1.5 py-0.2 rounded-md bg-cyan-500 text-black font-bold font-mono text-[9px] shadow-[0_0_6px_rgba(6,182,212,0.8)]">
                        M
                      </span>
                    )}
                    {status === 'board' && (
                      <span className="text-[9px] text-emerald-400 font-mono">✓ Jeu</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CENTER COLUMN: Main Arena Board Canvas & Controls */}
        <div className="lg:col-span-6 space-y-2">
          {/* Top Header Bar */}
          <div className="flex items-center justify-between px-2 pt-1">
            {/* Left: Player Avatar & Score */}
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-900 to-indigo-700 border-2 border-cyan-400 flex items-center justify-center text-white font-bold shadow-[0_0_12px_rgba(6,182,212,0.5)] text-sm">
                  ☥
                </div>
                <span className="text-[9px] font-gothic font-bold text-gray-300 block text-center mt-0.5">MAYKI</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-b from-[#2a2416] to-[#120f09] border-2 border-amber-400/80 flex items-center justify-center font-gothic font-bold text-amber-300 text-sm shadow-gold">
                {playerScore}
              </div>
            </div>

            {/* Center: Location Badge & Turn Seal */}
            <div 
              onClick={() => setShowLocationModal(true)}
              className="flex flex-col items-center cursor-pointer group"
              title="Cliquez pour voir la règle du lieu"
            >
              <div className="w-9 h-9 rounded-full bg-red-950/90 border-2 border-red-500 flex items-center justify-center text-red-200 font-mono font-bold text-sm shadow-blood group-hover:scale-105 transition-transform">
                {turn}
              </div>
              <div className="flex items-center space-x-1 mt-0.5 text-amber-300/90 font-gothic font-bold text-[11px]">
                <span>👑 {selectedLocation.name}</span>
              </div>
            </div>

            {/* Right: Opponent AI Avatar & Score */}
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-b from-[#2a2416] to-[#120f09] border-2 border-amber-400/80 flex items-center justify-center font-gothic font-bold text-amber-300 text-sm shadow-gold">
                {aiScore}
              </div>
              <div className="relative text-right">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-950 to-rose-900 border-2 border-red-500 overflow-hidden flex items-center justify-center shadow-blood">
                  <img src={selectedAI.avatarUrl} alt={selectedAI.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-[9px] font-gothic font-bold text-gray-300 block text-center mt-0.5 uppercase">{selectedAI.name}</span>
              </div>
            </div>
          </div>

          {/* Main 15-Space Tactical Board */}
          <div className="relative rounded-2xl bg-gradient-to-b from-[#12080a] via-[#0d090d] to-[#070910] border border-red-900/40 p-2.5 shadow-2xl overflow-hidden">
            {/* Support Laser Beams (including diagonal links to Prince) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              {/* Player Support Lines */}
              {playerChain.map((chain, i) => {
                if (chain.hasPawn && (chain.hasRook || board.prince.playerCard || board[`knight_${i === 0 ? 'left' : 'right'}`]?.playerCard)) {
                  return (
                    <line
                      key={`p-beam-${i}`}
                      x1={`${18 + i * 32}%`}
                      y1="90%"
                      x2={i === 1 ? '50%' : `${18 + i * 32}%`}
                      y2="52%"
                      stroke="#10b981"
                      strokeWidth="3.5"
                      strokeDasharray="4 2"
                      className="animate-pulse"
                      opacity="0.85"
                    />
                  );
                }
                return null;
              })}

              {/* Diagonal Support lines to Prince from Left & Right Rooks */}
              {board.player_rook_0.card && board.prince.playerCard && (
                <line x1="18%" y1="72%" x2="50%" y2="52%" stroke="#10b981" strokeWidth="2.5" strokeDasharray="3 2" opacity="0.6" />
              )}
              {board.player_rook_2.card && board.prince.playerCard && (
                <line x1="82%" y1="72%" x2="50%" y2="52%" stroke="#10b981" strokeWidth="2.5" strokeDasharray="3 2" opacity="0.6" />
              )}

              {/* AI Support Lines */}
              {aiChain.map((chain, i) => {
                if (chain.hasPawn && (chain.hasRook || board.prince.aiCard || board[`knight_${i === 0 ? 'left' : 'right'}`]?.aiCard)) {
                  return (
                    <line
                      key={`ai-beam-${i}`}
                      x1={`${18 + i * 32}%`}
                      y1="10%"
                      x2={i === 1 ? '50%' : `${18 + i * 32}%`}
                      y2="48%"
                      stroke="#a855f7"
                      strokeWidth="3.5"
                      strokeDasharray="4 2"
                      className="animate-pulse"
                      opacity="0.85"
                    />
                  );
                }
                return null;
              })}
            </svg>

            {/* Undo Button */}
            {turnActionHistory.length > 0 && (
              <button
                onClick={handleUndo}
                className="absolute top-1/2 left-2 transform -translate-y-1/2 z-20 p-2 rounded-full bg-slate-900/90 border border-white/20 text-gray-300 hover:text-white shadow-xl hover:scale-110 transition-all"
                title="Annuler le dernier coup"
              >
                <Undo2 className="w-4 h-4 text-cyan-400" />
              </button>
            )}

            <div className="relative z-10 space-y-1.5">
              {/* Row 1: AI Pawns */}
              <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2].map(col => {
                  const sp = board[`ai_pawn_${col}`];
                  return (
                    <div key={sp.key} className="h-16 rounded-xl bg-black/40 border border-purple-500/20 overflow-hidden relative flex flex-col justify-between p-1 text-center">
                      {sp.card ? (
                        <>
                          <img src={sp.card.imageUrl} alt={sp.card.name} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                          <div className="relative z-10 flex justify-between items-center text-[10px] bg-black/70 px-1 py-0.5 rounded">
                            <span className="font-gothic text-purple-200 truncate">{sp.card.name}</span>
                            <span className="font-mono font-bold text-amber-400">P{sp.power}</span>
                          </div>
                        </>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-purple-500/40 mx-auto my-auto" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Row 2: AI Rooks */}
              <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2].map(col => {
                  const sp = board[`ai_rook_${col}`];
                  return (
                    <div key={sp.key} className="h-16 rounded-xl bg-black/40 border border-purple-500/20 overflow-hidden relative flex flex-col justify-between p-1 text-center">
                      {sp.card ? (
                        <>
                          <img src={sp.card.imageUrl} alt={sp.card.name} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                          <div className="relative z-10 flex justify-between items-center text-[10px] bg-black/70 px-1 py-0.5 rounded">
                            <span className="font-gothic text-purple-200 truncate">{sp.card.name}</span>
                            <span className="font-mono font-bold text-amber-400">P{sp.power}</span>
                          </div>
                        </>
                      ) : (
                        <span className="text-[9px] font-mono text-gray-600 my-auto">Tour AI</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Row 3: Contested Frontline (Knight Left, Prince Center, Knight Right) */}
              <div className="grid grid-cols-3 gap-2 py-1">
                {/* Knight Left */}
                <div
                  onClick={() => selectedHandCard && handleDeployToSpace('knight_left')}
                  className={`h-24 rounded-2xl border-2 transition-all p-1.5 flex flex-col justify-between relative overflow-hidden ${
                    board.knight_left.playerCard
                      ? 'bg-emerald-950/60 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                      : board.knight_left.aiCard
                        ? 'bg-purple-950/60 border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                        : selectedHandCard && isPlacementValid('knight_left', selectedHandCard)
                          ? 'bg-red-950/40 border-red-500/70 hover:scale-105 cursor-pointer animate-pulse'
                          : 'bg-[#180f12] border-amber-500/30'
                  }`}
                >
                  {board.knight_left.playerCard && (
                    <img src={board.knight_left.playerCard.imageUrl} alt={board.knight_left.playerCard.name} className="absolute inset-0 w-full h-full object-cover opacity-45" />
                  )}
                  {board.knight_left.aiCard && (
                    <img src={board.knight_left.aiCard.imageUrl} alt={board.knight_left.aiCard.name} className="absolute inset-0 w-full h-full object-cover opacity-45" />
                  )}

                  {scoringMedals.knight_left > 0 && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center bg-amber-500/30 rounded-2xl animate-ping">
                      <span className="w-8 h-8 rounded-full bg-amber-400 text-black font-extrabold flex items-center justify-center text-sm shadow-gold">
                        +{scoringMedals.knight_left}
                      </span>
                    </div>
                  )}
                  <div className="relative z-10 flex justify-between items-center text-[10px]">
                    <span className="font-gothic font-bold text-amber-300 bg-black/60 px-1 rounded">♞ Cavalier Ouest</span>
                    <span className="text-[9px] font-mono text-amber-400 bg-black/60 px-1 rounded">+2 Pts</span>
                  </div>
                  <div className="relative z-10 text-center my-auto">
                    {board.knight_left.playerCard ? (
                      <div onClick={(e) => { e.stopPropagation(); onInspectCard?.(board.knight_left.playerCard); }} className="cursor-pointer bg-black/60 p-1 rounded">
                        <div className="font-gothic font-bold text-xs text-emerald-300 truncate">{board.knight_left.playerCard.name}</div>
                        <div className="text-[10px] font-mono text-amber-400 font-bold">{board.knight_left.playerPower} (+{playerChain[0].totalSupportToFront})</div>
                      </div>
                    ) : board.knight_left.aiCard ? (
                      <div onClick={(e) => { e.stopPropagation(); onInspectCard?.(board.knight_left.aiCard); }} className="cursor-pointer bg-black/60 p-1 rounded">
                        <div className="font-gothic font-bold text-xs text-purple-300 truncate">{board.knight_left.aiCard.name}</div>
                        <div className="text-[10px] font-mono text-amber-400 font-bold">{board.knight_left.aiPower} (+{aiChain[0].totalSupportToFront})</div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">{selectedHandCard ? 'Déployer ici' : 'Contesté'}</span>
                    )}
                  </div>
                </div>

                {/* Prince Center (Crown 👑) */}
                <div
                  onClick={() => selectedHandCard && handleDeployToSpace('prince')}
                  className={`h-24 rounded-2xl border-2 transition-all p-1.5 flex flex-col justify-between relative overflow-hidden ${
                    board.prince.playerCard
                      ? 'bg-gradient-to-b from-amber-950/80 to-[#120e06] border-amber-400 shadow-[0_0_18px_rgba(212,175,55,0.5)]'
                      : board.prince.aiCard
                        ? 'bg-purple-950/80 border-purple-400 shadow-[0_0_18px_rgba(168,85,247,0.4)]'
                        : selectedHandCard && isPlacementValid('prince', selectedHandCard)
                          ? 'bg-red-950/60 border-red-500 hover:scale-105 cursor-pointer animate-pulse'
                          : 'bg-gradient-to-b from-[#22160d] to-[#0c0906] border-amber-500/50'
                  }`}
                >
                  {board.prince.playerCard && (
                    <img src={board.prince.playerCard.imageUrl} alt={board.prince.playerCard.name} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                  )}
                  {board.prince.aiCard && (
                    <img src={board.prince.aiCard.imageUrl} alt={board.prince.aiCard.name} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                  )}

                  {scoringMedals.prince > 0 && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center bg-amber-500/30 rounded-2xl animate-ping">
                      <span className="w-9 h-9 rounded-full bg-amber-400 text-black font-extrabold flex items-center justify-center text-sm shadow-gold">
                        +{scoringMedals.prince}
                      </span>
                    </div>
                  )}
                  <div className="relative z-10 flex justify-between items-center text-[10px]">
                    <span className="font-gothic font-bold text-amber-300 flex items-center space-x-1 bg-black/60 px-1 rounded">
                      <Crown className="w-3 h-3 text-amber-400" />
                      <span>Trône du Prince</span>
                    </span>
                    <span className="text-[9px] font-mono text-amber-300 bg-black/60 px-1 rounded">1 pt/allié</span>
                  </div>
                  <div className="relative z-10 text-center my-auto">
                    {board.prince.playerCard ? (
                      <div onClick={(e) => { e.stopPropagation(); onInspectCard?.(board.prince.playerCard); }} className="cursor-pointer bg-black/60 p-1 rounded">
                        <div className="font-gothic font-bold text-xs text-amber-200 truncate">{board.prince.playerCard.name}</div>
                        <div className="text-[10px] font-mono text-amber-400 font-bold">{board.prince.playerPower} (+{playerChain[1].totalSupportToFront})</div>
                      </div>
                    ) : board.prince.aiCard ? (
                      <div onClick={(e) => { e.stopPropagation(); onInspectCard?.(board.prince.aiCard); }} className="cursor-pointer bg-black/60 p-1 rounded">
                        <div className="font-gothic font-bold text-xs text-purple-200 truncate">{board.prince.aiCard.name}</div>
                        <div className="text-[10px] font-mono text-amber-400 font-bold">{board.prince.aiPower} (+{aiChain[1].totalSupportToFront})</div>
                      </div>
                    ) : (
                      <span className="text-xs text-amber-400/80 font-gothic font-bold bg-black/50 px-1 rounded">{selectedHandCard ? '👑 Régner' : 'Trône Vacant'}</span>
                    )}
                  </div>
                </div>

                {/* Knight Right */}
                <div
                  onClick={() => selectedHandCard && handleDeployToSpace('knight_right')}
                  className={`h-24 rounded-2xl border-2 transition-all p-1.5 flex flex-col justify-between relative overflow-hidden ${
                    board.knight_right.playerCard
                      ? 'bg-emerald-950/60 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                      : board.knight_right.aiCard
                        ? 'bg-purple-950/60 border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                        : selectedHandCard && isPlacementValid('knight_right', selectedHandCard)
                          ? 'bg-red-950/40 border-red-500/70 hover:scale-105 cursor-pointer animate-pulse'
                          : 'bg-[#180f12] border-amber-500/30'
                  }`}
                >
                  {board.knight_right.playerCard && (
                    <img src={board.knight_right.playerCard.imageUrl} alt={board.knight_right.playerCard.name} className="absolute inset-0 w-full h-full object-cover opacity-45" />
                  )}
                  {board.knight_right.aiCard && (
                    <img src={board.knight_right.aiCard.imageUrl} alt={board.knight_right.aiCard.name} className="absolute inset-0 w-full h-full object-cover opacity-45" />
                  )}

                  {scoringMedals.knight_right > 0 && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center bg-amber-500/30 rounded-2xl animate-ping">
                      <span className="w-8 h-8 rounded-full bg-amber-400 text-black font-extrabold flex items-center justify-center text-sm shadow-gold">
                        +{scoringMedals.knight_right}
                      </span>
                    </div>
                  )}
                  <div className="relative z-10 flex justify-between items-center text-[10px]">
                    <span className="font-gothic font-bold text-amber-300 bg-black/60 px-1 rounded">♞ Cavalier Est</span>
                    <span className="text-[9px] font-mono text-amber-400 bg-black/60 px-1 rounded">+2 Pts</span>
                  </div>
                  <div className="relative z-10 text-center my-auto">
                    {board.knight_right.playerCard ? (
                      <div onClick={(e) => { e.stopPropagation(); onInspectCard?.(board.knight_right.playerCard); }} className="cursor-pointer bg-black/60 p-1 rounded">
                        <div className="font-gothic font-bold text-xs text-emerald-300 truncate">{board.knight_right.playerCard.name}</div>
                        <div className="text-[10px] font-mono text-amber-400 font-bold">{board.knight_right.playerPower} (+{playerChain[2].totalSupportToFront})</div>
                      </div>
                    ) : board.knight_right.aiCard ? (
                      <div onClick={(e) => { e.stopPropagation(); onInspectCard?.(board.knight_right.aiCard); }} className="cursor-pointer bg-black/60 p-1 rounded">
                        <div className="font-gothic font-bold text-xs text-purple-300 truncate">{board.knight_right.aiCard.name}</div>
                        <div className="text-[10px] font-mono text-amber-400 font-bold">{board.knight_right.aiPower} (+{aiChain[2].totalSupportToFront})</div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">{selectedHandCard ? 'Déployer ici' : 'Contesté'}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 4: Player Rooks */}
              <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2].map(col => {
                  const sp = board[`player_rook_${col}`];
                  const isValidTarget = selectedHandCard && isPlacementValid(sp.key, selectedHandCard);

                  return (
                    <div
                      key={sp.key}
                      onClick={() => selectedHandCard && handleDeployToSpace(sp.key)}
                      className={`h-16 rounded-xl border transition-all flex flex-col justify-between p-1 relative overflow-hidden ${
                        sp.card
                          ? 'bg-emerald-950/50 border-emerald-500/70 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                          : isValidTarget
                            ? 'bg-red-950/30 border-red-500/60 hover:border-emerald-400 cursor-pointer animate-pulse'
                            : 'bg-black/40 border-white/10 opacity-60'
                      }`}
                    >
                      {sp.card ? (
                        <>
                          <img src={sp.card.imageUrl} alt={sp.card.name} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                          <div className="relative z-10 flex justify-between items-center text-[10px] bg-black/70 px-1 py-0.5 rounded">
                            <span className="font-gothic text-emerald-300 truncate">{sp.card.name}</span>
                            <span className="font-mono font-bold text-amber-400">P{sp.power}</span>
                          </div>
                          <span className="relative z-10 text-[8px] font-mono text-emerald-400/90 text-center bg-black/60 rounded">↑ Soutien Relais</span>
                        </>
                      ) : (
                        <span className="text-[9px] font-mono text-gray-500 my-auto text-center">Tour {col === 1 ? 'Centre' : col === 0 ? 'Ouest' : 'Est'}</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Row 5: Player Pawns */}
              <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2].map(col => {
                  const sp = board[`player_pawn_${col}`];
                  return (
                    <div
                      key={sp.key}
                      onClick={() => selectedHandCard && handleDeployToSpace(sp.key)}
                      className={`h-16 rounded-xl border transition-all flex flex-col justify-between p-1 relative overflow-hidden ${
                        sp.card
                          ? 'bg-emerald-950/50 border-emerald-500/70 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                          : selectedHandCard
                            ? 'bg-red-950/30 border-red-500/60 hover:border-emerald-400 cursor-pointer animate-pulse'
                            : 'bg-black/40 border-white/10'
                      }`}
                    >
                      {sp.card ? (
                        <>
                          <img src={sp.card.imageUrl} alt={sp.card.name} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                          <div className="relative z-10 flex justify-between items-center text-[10px] bg-black/70 px-1 py-0.5 rounded">
                            <span className="font-gothic text-emerald-300 truncate">{sp.card.name}</span>
                            <span className="font-mono font-bold text-amber-400">P{sp.power}</span>
                          </div>
                          <span className="relative z-10 text-[8px] font-mono text-emerald-400/90 text-center bg-black/60 rounded">♟️ Base Pion</span>
                        </>
                      ) : (
                        <span className="text-[9px] font-mono text-gray-500 my-auto text-center">♟️ Pion {col === 1 ? 'Centre' : col === 0 ? 'Ouest' : 'Est'}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Player Hand & Action Controls */}
          <div className="space-y-2 pt-1">
            {/* Hand Fan with Card Portraits */}
            <div className="flex items-center justify-center gap-1.5 overflow-x-auto py-1 px-1">
              {playerHand.map((card) => {
                const canAfford = card.cost <= bloodAvailable;
                const isSelected = selectedHandCard?.id === card.id;

                return (
                  <div
                    key={card.id}
                    onClick={() => {
                      if (isSelected) setSelectedHandCard(null);
                      else if (canAfford) setSelectedHandCard(card);
                    }}
                    className={`w-20 sm:w-24 h-28 rounded-xl border-2 transition-all p-1 flex flex-col justify-between cursor-pointer transform relative overflow-hidden ${
                      isSelected
                        ? 'bg-red-950 border-red-500 shadow-blood -translate-y-2 scale-105'
                        : canAfford
                          ? 'bg-[#10141f] border-white/20 hover:border-amber-400 hover:-translate-y-1'
                          : 'bg-[#080a0f] border-white/5 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    {/* Background Portrait Image */}
                    <img src={card.imageUrl} alt={card.name} className="absolute inset-0 w-full h-full object-cover opacity-60" />

                    <div className="relative z-10 flex items-center justify-between">
                      <span className="w-5 h-5 rounded-full bg-red-900 border border-red-500 text-[10px] font-bold text-white flex items-center justify-center font-mono shadow-blood">
                        {card.cost}
                      </span>
                      <span className="font-mono text-amber-300 text-xs font-bold bg-black/70 px-1 rounded">
                        P{card.power}
                      </span>
                    </div>

                    <div className="relative z-10 text-center bg-black/75 p-0.5 rounded">
                      <div className="font-gothic font-bold text-[10px] text-gray-100 truncate">{card.name}</div>
                      <div className="text-[8px] font-mono text-gray-400 truncate">{card.clan}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Bar (ABANDONNER | BLOOD DROP | FIN DU TOUR) */}
            <div className="flex items-center justify-between gap-3 px-1">
              <button
                onClick={() => setGamePhase('setup')}
                className="flex-1 py-2.5 rounded-full bg-[#12151f] hover:bg-[#1c2233] border border-white/15 text-gray-400 hover:text-white font-gothic font-bold text-xs transition-all text-center tracking-wider"
              >
                ABANDONNER
              </button>

              <div className="w-12 h-12 rounded-full bg-gradient-to-b from-red-700 to-rose-950 border-2 border-red-500 flex items-center justify-center text-white font-mono font-bold text-lg shadow-blood animate-pulse">
                {bloodAvailable}
              </div>

              <button
                onClick={handleEndTurn}
                disabled={gamePhase !== 'playing'}
                className={`flex-1 py-2.5 rounded-full text-white font-gothic font-bold text-xs shadow-blood transition-all transform active:scale-95 text-center tracking-wider ${
                  gamePhase === 'playing'
                    ? 'bg-gradient-to-r from-red-700 via-red-600 to-rose-900 hover:from-red-600 hover:to-rose-800'
                    : 'bg-gray-800 opacity-50 cursor-wait'
                }`}
              >
                {gamePhase === 'revealing' ? 'RÉSOLUTION...' : gamePhase === 'scoring' ? 'COMPTAGE DES POINTS...' : (
                  <>
                    FIN DU TOUR<br />
                    <span className="text-[9px] font-mono opacity-80">MANCHE {turn}/7</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Combat Chronicle (Journal de Combat) */}
        <div className="lg:col-span-3 glass-panel rounded-2xl p-3.5 border border-white/10 space-y-3">
          <div className="flex items-center space-x-2 text-red-400 font-gothic font-bold text-xs border-b border-white/10 pb-2">
            <ScrollText className="w-4 h-4" />
            <span>Journal de Combat</span>
          </div>

          <div className="space-y-1.5 max-h-[580px] overflow-y-auto text-[11px] font-mono pr-1">
            {historyLogs.map((log, index) => (
              <div key={index} className="p-1.5 rounded-lg bg-black/40 border border-white/5 text-gray-300 leading-relaxed">
                • {log}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
