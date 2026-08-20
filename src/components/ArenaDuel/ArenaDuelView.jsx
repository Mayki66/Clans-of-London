import React, { useState, useEffect } from 'react';
import { 
  Crown, Shield, Droplets, Trophy, RotateCcw, Play, ChevronRight, 
  Sparkles, Swords, ArrowUp, Undo2, HelpCircle, Eye, RefreshCw, Zap, X, Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CARDS_DATA } from '../../data/cardsData';
import { META_DECKS } from '../../data/metaDecks';
import { ARENA_LOCATIONS } from '../../data/arenaLocations';
import { AI_OPPONENTS, playAITurn } from '../../utils/aiOpponent';

export default function ArenaDuelView({ customDeckCardIds = [], onInspectCard }) {
  // Game Setup State
  const [selectedLocation, setSelectedLocation] = useState(ARENA_LOCATIONS[0]); // Default: St Paul's Cathedral
  const [selectedAI, setSelectedAI] = useState(AI_OPPONENTS[0]); // Default: Dukaul (Brujah)
  const [playerDeckId, setPlayerDeckId] = useState('custom');
  const [gameStarted, setGameStarted] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Active Match State
  const [turn, setTurn] = useState(1);
  const [maxTurns] = useState(7);
  const [bloodAvailable, setBloodAvailable] = useState(2);
  const [totalBloodTurn, setTotalBloodTurn] = useState(2);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAIScore] = useState(0);
  
  const [playerHand, setPlayerHand] = useState([]);
  const [playerDrawPile, setPlayerDrawPile] = useState([]);
  const [playerDiscard, setPlayerDiscard] = useState([]);

  const [aiHand, setAIHand] = useState([]);
  const [aiDrawPile, setAIDrawPile] = useState([]);
  const [aiDiscard, setAIDiscard] = useState([]);

  const [selectedHandCard, setSelectedHandCard] = useState(null);
  const [historyLogs, setHistoryLogs] = useState([]);
  const [turnActionHistory, setTurnActionHistory] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isResolvingRound, setIsResolvingRound] = useState(false);

  // Board Spaces (15-space layout)
  // Opponent: 3 Pawns, 3 Rooks
  // Middle Contested: Knight West, Prince Center, Knight East
  // Player: 3 Rooks, 3 Pawns
  const [board, setBoard] = useState({
    // AI side
    ai_pawn_0: { key: 'ai_pawn_0', name: 'Pion Nord Ouest', row: 'ai_pawn', col: 0, card: null, power: 0 },
    ai_pawn_1: { key: 'ai_pawn_1', name: 'Pion Nord Centre', row: 'ai_pawn', col: 1, card: null, power: 0 },
    ai_pawn_2: { key: 'ai_pawn_2', name: 'Pion Nord Est', row: 'ai_pawn', col: 2, card: null, power: 0 },

    ai_rook_0: { key: 'ai_rook_0', name: 'Tour Nord Ouest', row: 'ai_rook', col: 0, card: null, power: 0 },
    ai_rook_1: { key: 'ai_rook_1', name: 'Tour Nord Centre', row: 'ai_rook', col: 1, card: null, power: 0 },
    ai_rook_2: { key: 'ai_rook_2', name: 'Tour Nord Est', row: 'ai_rook', col: 2, card: null, power: 0 },

    // Contested Frontline
    knight_left: { key: 'knight_left', name: 'Cavalier Ouest', type: 'Knight', points: 2, playerCard: null, aiCard: null, playerPower: 0, aiPower: 0, col: 0 },
    prince: { key: 'prince', name: 'Trône du Prince', type: 'Prince', points: '1 pt/allié', playerCard: null, aiCard: null, playerPower: 0, aiPower: 0, col: 1 },
    knight_right: { key: 'knight_right', name: 'Cavalier Est', type: 'Knight', points: 2, playerCard: null, aiCard: null, playerPower: 0, aiPower: 0, col: 2 },

    // Player side
    player_rook_0: { key: 'player_rook_0', name: 'Tour Sud Ouest', row: 'player_rook', col: 0, card: null, power: 0 },
    player_rook_1: { key: 'player_rook_1', name: 'Tour Sud Centre', row: 'player_rook', col: 1, card: null, power: 0 },
    player_rook_2: { key: 'player_rook_2', name: 'Tour Sud Est', row: 'player_rook', col: 2, card: null, power: 0 },

    player_pawn_0: { key: 'player_pawn_0', name: 'Pion Sud Ouest', row: 'player_pawn', col: 0, card: null, power: 0 },
    player_pawn_1: { key: 'player_pawn_1', name: 'Pion Sud Centre', row: 'player_pawn', col: 1, card: null, power: 0 },
    player_pawn_2: { key: 'player_pawn_2', name: 'Pion Sud Est', row: 'player_pawn', col: 2, card: null, power: 0 },
  });

  // Calculate Support Chains (transmits power from Pawn ➔ Rook ➔ Knight/Prince)
  const calculateEffectivePower = () => {
    // Player columns
    const playerChain = [0, 1, 2].map(col => {
      const pawn = board[`player_pawn_${col}`]?.card;
      const rook = board[`player_rook_${col}`]?.card;
      
      let pawnPower = pawn?.power || 0;
      let rookPower = rook?.power || 0;

      // Check "Cannot give support"
      if (pawn && (pawn.ability_en?.includes('Cannot give support') || pawn.ability?.includes('Ne peut pas donner de soutien'))) {
        pawnPower = 0;
      }
      if (rook && (rook.ability_en?.includes('Cannot give support') || rook.ability?.includes('Ne peut pas donner de soutien'))) {
        rookPower = 0;
      }

      return {
        col,
        hasPawn: !!pawn,
        hasRook: !!rook,
        pawnPower,
        rookPower,
        totalSupportToFront: (pawn ? pawnPower : 0) + (rook ? rookPower : 0)
      };
    });

    // AI columns
    const aiChain = [0, 1, 2].map(col => {
      const pawn = board[`ai_pawn_${col}`]?.card;
      const rook = board[`ai_rook_${col}`]?.card;

      let pawnPower = pawn?.power || 0;
      let rookPower = rook?.power || 0;

      if (pawn && (pawn.ability_en?.includes('Cannot give support') || pawn.ability?.includes('Ne peut pas donner de soutien'))) pawnPower = 0;
      if (rook && (rook.ability_en?.includes('Cannot give support') || rook.ability?.includes('Ne peut pas donner de soutien'))) rookPower = 0;

      return {
        col,
        hasPawn: !!pawn,
        hasRook: !!rook,
        pawnPower,
        rookPower,
        totalSupportToFront: (pawn ? pawnPower : 0) + (rook ? rookPower : 0)
      };
    });

    return { playerChain, aiChain };
  };

  const { playerChain, aiChain } = calculateEffectivePower();

  // Start / Reset Game Match
  const initMatch = () => {
    // 1. Resolve Player Deck
    let pCards = [];
    if (playerDeckId === 'custom' && customDeckCardIds.length >= 10) {
      pCards = customDeckCardIds.map(id => CARDS_DATA.find(c => c.id === id)).filter(Boolean);
    } else {
      const selectedMeta = META_DECKS.find(d => d.id === playerDeckId) || META_DECKS[0];
      pCards = selectedMeta.cardIds.map(id => CARDS_DATA.find(c => c.id === id)).filter(Boolean);
    }

    // Katie Dixon guaranteed opening hand check
    const pGuaranteed = pCards.filter(c => c.ability_en?.toLowerCase().includes('starts in your opening hand') || c.name === 'Katie Dixon');
    const pRest = pCards.filter(c => !pGuaranteed.some(g => g.id === c.id)).sort(() => Math.random() - 0.5);
    const pHand = [...pGuaranteed, ...pRest.slice(0, 4 - pGuaranteed.length)];
    const pDraw = pRest.slice(4 - pGuaranteed.length);

    // 2. Resolve AI Deck
    const aiMeta = META_DECKS.find(d => d.id === selectedAI.metaDeckId) || META_DECKS[1];
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
    setIsGameOver(false);
    setIsResolvingRound(false);

    // Reset Board
    setBoard({
      ai_pawn_0: { key: 'ai_pawn_0', name: 'Pion Nord Ouest', row: 'ai_pawn', col: 0, card: null, power: 0 },
      ai_pawn_1: { key: 'ai_pawn_1', name: 'Pion Nord Centre', row: 'ai_pawn', col: 1, card: null, power: 0 },
      ai_pawn_2: { key: 'ai_pawn_2', name: 'Pion Nord Est', row: 'ai_pawn', col: 2, card: null, power: 0 },

      ai_rook_0: { key: 'ai_rook_0', name: 'Tour Nord Ouest', row: 'ai_rook', col: 0, card: null, power: 0 },
      ai_rook_1: { key: 'ai_rook_1', name: 'Tour Nord Centre', row: 'ai_rook', col: 1, card: null, power: 0 },
      ai_rook_2: { key: 'ai_rook_2', name: 'Tour Nord Est', row: 'ai_rook', col: 2, card: null, power: 0 },

      knight_left: { key: 'knight_left', name: 'Cavalier Ouest', type: 'Knight', points: 2, playerCard: null, aiCard: null, playerPower: 0, aiPower: 0, col: 0 },
      prince: { key: 'prince', name: 'Trône du Prince', type: 'Prince', points: '1 pt/allié', playerCard: null, aiCard: null, playerPower: 0, aiPower: 0, col: 1 },
      knight_right: { key: 'knight_right', name: 'Cavalier Est', type: 'Knight', points: 2, playerCard: null, aiCard: null, playerPower: 0, aiPower: 0, col: 2 },

      player_rook_0: { key: 'player_rook_0', name: 'Tour Sud Ouest', row: 'player_rook', col: 0, card: null, power: 0 },
      player_rook_1: { key: 'player_rook_1', name: 'Tour Sud Centre', row: 'player_rook', col: 1, card: null, power: 0 },
      player_rook_2: { key: 'player_rook_2', name: 'Tour Sud Est', row: 'player_rook', col: 2, card: null, power: 0 },

      player_pawn_0: { key: 'player_pawn_0', name: 'Pion Sud Ouest', row: 'player_pawn', col: 0, card: null, power: 0 },
      player_pawn_1: { key: 'player_pawn_1', name: 'Pion Sud Centre', row: 'player_pawn', col: 1, card: null, power: 0 },
      player_pawn_2: { key: 'player_pawn_2', name: 'Pion Sud Est', row: 'player_pawn', col: 2, card: null, power: 0 },
    });

    setHistoryLogs([
      `Arène : ${selectedLocation.name} (${selectedLocation.modifierName} active).`,
      `Duel lancé contre ${selectedAI.name} (${selectedAI.clan}). Tour 1 : 2 Sang disponibles.`
    ]);

    setGameStarted(true);
    setShowLocationModal(true);
  };

  // Play a player card to a target board space
  const handleDeployToSpace = (spaceKey) => {
    if (!selectedHandCard) return;
    if (selectedHandCard.cost > bloodAvailable) {
      alert(`Pas assez de Sang ! Coût : ${selectedHandCard.cost} Sang (Disponible : ${bloodAvailable} Sang)`);
      return;
    }

    const targetSpace = board[spaceKey];
    if (targetSpace.card || (targetSpace.playerCard && (spaceKey === 'prince' || spaceKey.startsWith('knight')))) {
      alert('Cet emplacement est déjà occupé par une de vos unités !');
      return;
    }

    // Save snapshot for undo
    setTurnActionHistory(prev => [...prev, {
      boardState: { ...board },
      handState: [...playerHand],
      bloodState: bloodAvailable,
      cardPlayed: selectedHandCard,
      spaceKey
    }]);

    // Apply On Reveal bonuses (e.g. Stephen Fane on Knight/Prince +3 Power, Amy West, etc.)
    let effectivePower = selectedHandCard.power;
    let revealMessage = '';

    if (selectedHandCard.name === 'Stephen Fane' && (spaceKey === 'prince' || spaceKey.startsWith('knight'))) {
      effectivePower += 3;
      revealMessage = ' (Bonus Révélation Stephen Fane sur Front: +3 Puissance -> 11)';
    }

    // Location modifier checks (e.g. Camden Catacombs)
    if (selectedLocation.id === 'camden-catacombs' && selectedHandCard.cost <= 2 && (spaceKey.startsWith('player_pawn') || spaceKey.startsWith('player_rook'))) {
      effectivePower += 1;
      revealMessage += ' (Embuscade Furtive Camden: +1 Puissance)';
    }

    // Deduct blood and remove from hand
    setBloodAvailable(prev => prev - selectedHandCard.cost);
    setPlayerHand(prev => prev.filter(c => c.id !== selectedHandCard.id));

    // Update space on board
    if (spaceKey === 'prince' || spaceKey.startsWith('knight')) {
      setBoard(prev => ({
        ...prev,
        [spaceKey]: {
          ...prev[spaceKey],
          playerCard: selectedHandCard,
          playerPower: effectivePower
        }
      }));
    } else {
      setBoard(prev => ({
        ...prev,
        [spaceKey]: {
          ...prev[spaceKey],
          card: selectedHandCard,
          power: effectivePower
        }
      }));
    }

    setHistoryLogs(prev => [
      `Vous avez déployé "${selectedHandCard.name}" (Puissance ${effectivePower}) sur ${targetSpace.name}${revealMessage}.`,
      ...prev
    ]);

    setSelectedHandCard(null);
  };

  // Undo last action in current turn
  const handleUndo = () => {
    if (turnActionHistory.length === 0) return;
    const lastAction = turnActionHistory[turnActionHistory.length - 1];
    setBoard(lastAction.boardState);
    setPlayerHand(lastAction.handState);
    setBloodAvailable(lastAction.bloodState);
    setSelectedHandCard(null);
    setTurnActionHistory(prev => prev.slice(0, -1));
  };

  // Resolve End of Round
  const handleEndTurn = () => {
    setIsResolvingRound(true);

    // 1. AI plays its turn
    const aiResult = playAITurn(
      { hand: aiHand, bloodAvailable: totalBloodTurn, board },
      { hand: playerHand, bloodAvailable, board },
      selectedLocation
    );

    let updatedBoard = { ...aiResult.updatedBoard };
    let newAIHand = aiResult.remainingHand;

    // 2. Compute Combat Resolution on Contested Frontline
    let roundPlayerPts = 0;
    let roundAIPts = 0;
    const roundCombatLogs = [...aiResult.logs];

    // Compute Support Chains
    const { playerChain: pCh, aiChain: aCh } = calculateEffectivePower();

    // Knight West
    const kw = updatedBoard.knight_left;
    const pKWPower = (kw.playerCard ? kw.playerPower : 0) + pCh[0].totalSupportToFront;
    const aKWPower = (kw.aiCard ? kw.aiPower : 0) + aCh[0].totalSupportToFront;

    if (pKWPower > aKWPower && pKWPower > 0) {
      roundPlayerPts += (selectedLocation.id === 'tower-of-london' ? 3 : 2);
      roundCombatLogs.push(`⚔️ Cavalier Ouest : Vous l'emportez (${pKWPower} vs ${aKWPower}) -> +2 Pts.`);
    } else if (aKWPower > pKWPower && aKWPower > 0) {
      roundAIPts += (selectedLocation.id === 'tower-of-london' ? 3 : 2);
      roundCombatLogs.push(`⚔️ Cavalier Ouest : ${selectedAI.name} l'emporte (${aKWPower} vs ${pKWPower}) -> +2 Pts IA.`);
    }

    // Knight East
    const ke = updatedBoard.knight_right;
    const pKEPower = (ke.playerCard ? ke.playerPower : 0) + pCh[2].totalSupportToFront;
    const aKEPower = (ke.aiCard ? ke.aiPower : 0) + aCh[2].totalSupportToFront;

    if (pKEPower > aKEPower && pKEPower > 0) {
      roundPlayerPts += (selectedLocation.id === 'tower-of-london' ? 3 : 2);
      roundCombatLogs.push(`⚔️ Cavalier Est : Vous l'emportez (${pKEPower} vs ${aKEPower}) -> +2 Pts.`);
    } else if (aKEPower > pKEPower && aKEPower > 0) {
      roundAIPts += (selectedLocation.id === 'tower-of-london' ? 3 : 2);
      roundCombatLogs.push(`⚔️ Cavalier Est : ${selectedAI.name} l'emporte (${aKEPower} vs ${pKEPower}) -> +2 Pts IA.`);
    }

    // Prince of London (1 pt per ally on entire board)
    const pr = updatedBoard.prince;
    const pPrPower = (pr.playerCard ? pr.playerPower : 0) + pCh[1].totalSupportToFront;
    const aPrPower = (pr.aiCard ? pr.aiPower : 0) + aCh[1].totalSupportToFront;

    const totalPlayerAllies = ['player_pawn_0', 'player_pawn_1', 'player_pawn_2', 'player_rook_0', 'player_rook_1', 'player_rook_2']
      .filter(k => updatedBoard[k]?.card).length + (kw.playerCard ? 1 : 0) + (ke.playerCard ? 1 : 0) + (pr.playerCard ? 1 : 0);

    const totalAIAllies = ['ai_pawn_0', 'ai_pawn_1', 'ai_pawn_2', 'ai_rook_0', 'ai_rook_1', 'ai_rook_2']
      .filter(k => updatedBoard[k]?.card).length + (kw.aiCard ? 1 : 0) + (ke.aiCard ? 1 : 0) + (pr.aiCard ? 1 : 0);

    if (pPrPower > aPrPower && pPrPower > 0) {
      roundPlayerPts += totalPlayerAllies;
      roundCombatLogs.push(`👑 Trône du Prince : Vous régnez ! (${pPrPower} vs ${aPrPower}) -> +${totalPlayerAllies} Pts (${totalPlayerAllies} unités alliées).`);
    } else if (aPrPower > pPrPower && aPrPower > 0) {
      roundAIPts += totalAIAllies;
      roundCombatLogs.push(`👑 Trône du Prince : ${selectedAI.name} règne ! (${aPrPower} vs ${pPrPower}) -> +${totalAIAllies} Pts IA.`);
    }

    // 3. Location Modifier: St Paul's Cathedral - Résilience Impie
    // (Returns 1 card from discard to hand at end of each round)
    let newPlayerDiscard = [...playerDiscard];
    let newPlayerHand = [...playerHand];
    if (selectedLocation.id === 'st-pauls-cathedral' && newPlayerDiscard.length > 0) {
      const recovered = newPlayerDiscard.pop();
      newPlayerHand.push(recovered);
      roundCombatLogs.push(`⛪ Résilience Impie : "${recovered.name}" retourne de votre défausse dans votre main !`);
    }

    // 4. Update Game Scores
    const updatedPlayerScore = playerScore + roundPlayerPts;
    const updatedAIScore = aiScore + roundAIPts;
    setPlayerScore(updatedPlayerScore);
    setAIScore(updatedAIScore);
    setBoard(updatedBoard);
    setTurnActionHistory([]);

    // Check Climax Round 7
    if (turn >= maxTurns) {
      setIsGameOver(true);
      setIsResolvingRound(false);
      setHistoryLogs(prev => [
        `🏆 FIN DU DUEL (Round 7) : Score Final -> Vous : ${updatedPlayerScore} Pts | ${selectedAI.name} : ${updatedAIScore} Pts`,
        ...roundCombatLogs,
        ...prev
      ]);
      if (updatedPlayerScore > updatedAIScore) {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
      }
      return;
    }

    // Advance to next round
    const nextTurnNum = turn + 1;
    const nextBlood = nextTurnNum + 1; // T1=2, T2=3, T3=4, T4=5, T5=6, T6=7, T7=8

    // Draw card for Player
    let pDraw = [...playerDrawPile];
    let pDrawn = pDraw.shift();
    if (pDrawn) newPlayerHand.push(pDrawn);

    // Draw card for AI
    let aiDraw = [...aiDrawPile];
    let aiDrawn = aiDraw.shift();
    if (aiDrawn) newAIHand.push(aiDrawn);

    setTurn(nextTurnNum);
    setBloodAvailable(nextBlood);
    setTotalBloodTurn(nextBlood);
    setPlayerHand(newPlayerHand);
    setPlayerDrawPile(pDraw);
    setPlayerDiscard(newPlayerDiscard);
    setAIHand(newAIHand);
    setAIDrawPile(aiDraw);
    setIsResolvingRound(false);

    setHistoryLogs(prev => [
      `--- MANCHE ${nextTurnNum} / 7 (+${nextBlood} Sang disponibles) ---`,
      ...roundCombatLogs,
      ...prev
    ]);
  };

  // Render Setup Screen before match starts
  if (!gameStarted) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Setup Hero */}
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

        {/* Match Configuration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Choice 1: Arena Location & Global Rule */}
          <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-amber-400 font-gothic font-bold text-sm">
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

          {/* Choice 2: AI Opponent */}
          <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-purple-400 font-gothic font-bold text-sm">
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

          {/* Choice 3: Player Deck Selection */}
          <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-gothic font-bold text-sm">
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

        {/* Start Game Action */}
        <div className="text-center pt-2">
          <button
            onClick={initMatch}
            className="px-10 py-4 rounded-2xl bg-gradient-to-r from-red-800 via-red-700 to-rose-900 hover:from-red-700 hover:to-rose-800 text-white font-gothic font-extrabold text-base shadow-blood transition-all transform hover:scale-105"
          >
            ⚔️ Lancer le Duel d'Arène contre {selectedAI.name}
          </button>
        </div>
      </div>
    );
  }

  // Active Game Screen matching the screenshots
  return (
    <div className="max-w-2xl mx-auto space-y-3 pb-8 select-none">
      {/* Location Modal Popup (Matches Screenshot 1) */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel-blood max-w-sm w-full rounded-2xl overflow-hidden border border-red-500/40 shadow-2xl p-6 text-center space-y-4 relative">
            <button
              onClick={() => setShowLocationModal(false)}
              className="absolute top-3 right-3 p-1 rounded-full bg-white/10 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-16 h-16 mx-auto rounded-full bg-red-950 border-2 border-red-500 flex items-center justify-center shadow-blood text-2xl">
              ⛪
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

      {/* Top Header Bar (Matches Screenshots 2 & 3) */}
      <div className="flex items-center justify-between px-2 pt-1">
        {/* Left: Player Avatar & Score */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-900 to-indigo-700 border-2 border-cyan-400 flex items-center justify-center text-white font-bold shadow-[0_0_12px_rgba(6,182,212,0.5)]">
              ☥
            </div>
            <span className="text-[10px] font-gothic font-bold text-gray-300 block text-center mt-0.5">MAYKI</span>
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
          <div className="w-9 h-9 rounded-full bg-red-950/80 border-2 border-red-500 flex items-center justify-center text-red-300 font-mono font-bold text-sm shadow-blood group-hover:scale-105 transition-transform">
            {turn}
          </div>
          <div className="flex items-center space-x-1 mt-0.5 text-amber-300/90 font-gothic font-bold text-[11px]">
            <span>⛪ {selectedLocation.name}</span>
          </div>
        </div>

        {/* Right: Opponent AI Avatar & Score */}
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-b from-[#2a2416] to-[#120f09] border-2 border-amber-400/80 flex items-center justify-center font-gothic font-bold text-amber-300 text-sm shadow-gold">
            {aiScore}
          </div>
          <div className="relative text-right">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-red-950 to-rose-900 border-2 border-red-500 overflow-hidden flex items-center justify-center shadow-blood">
              <img src={selectedAI.avatarUrl} alt={selectedAI.name} className="w-full h-full object-cover" />
            </div>
            <span className="text-[10px] font-gothic font-bold text-gray-300 block text-center mt-0.5 uppercase">{selectedAI.name}</span>
          </div>
        </div>
      </div>

      {/* Main 15-Space Tactical Board Canvas */}
      <div className="relative rounded-2xl bg-gradient-to-b from-[#140b0e] via-[#0d090d] to-[#080b12] border border-red-900/40 p-3 shadow-2xl overflow-hidden">
        {/* Visual Support Chain Laser Beams (SVG Behind Tiles) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {/* Player Support Lines (Green Laser beams Col 0, 1, 2) */}
          {playerChain.map((chain, i) => {
            if (chain.hasPawn && (chain.hasRook || board.prince.playerCard || board[`knight_${i === 0 ? 'left' : 'right'}`]?.playerCard)) {
              return (
                <line
                  key={`p-beam-${i}`}
                  x1={`${18 + i * 32}%`}
                  y1="90%"
                  x2={`${18 + i * 32}%`}
                  y2="52%"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeDasharray="4 2"
                  className="animate-pulse"
                  opacity="0.8"
                />
              );
            }
            return null;
          })}

          {/* AI Support Lines (Purple Laser beams) */}
          {aiChain.map((chain, i) => {
            if (chain.hasPawn && (chain.hasRook || board.prince.aiCard || board[`knight_${i === 0 ? 'left' : 'right'}`]?.aiCard)) {
              return (
                <line
                  key={`ai-beam-${i}`}
                  x1={`${18 + i * 32}%`}
                  y1="10%"
                  x2={`${18 + i * 32}%`}
                  y2="48%"
                  stroke="#a855f7"
                  strokeWidth="3"
                  strokeDasharray="4 2"
                  className="animate-pulse"
                  opacity="0.8"
                />
              );
            }
            return null;
          })}
        </svg>

        {/* Undo Button on the Left */}
        {turnActionHistory.length > 0 && (
          <button
            onClick={handleUndo}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 z-20 p-2 rounded-full bg-slate-900/90 border border-white/20 text-gray-300 hover:text-white shadow-xl hover:scale-110 transition-all"
            title="Annuler le dernier coup"
          >
            <Undo2 className="w-4 h-4 text-cyan-400" />
          </button>
        )}

        <div className="relative z-10 space-y-2">
          {/* Row 1: AI Pawns (Top) */}
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map(col => {
              const sp = board[`ai_pawn_${col}`];
              return (
                <div key={sp.key} className="h-16 rounded-xl bg-black/40 border border-purple-500/20 flex flex-col items-center justify-center p-1 text-center">
                  {sp.card ? (
                    <div onClick={() => onInspectCard?.(sp.card)} className="w-full h-full rounded-lg bg-purple-950/80 border border-purple-400/50 p-1 flex flex-col justify-between cursor-pointer">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-gothic text-purple-200 truncate">{sp.card.name}</span>
                        <span className="font-mono font-bold text-amber-400">P{sp.card.power}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-purple-500/40" />
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
                <div key={sp.key} className="h-16 rounded-xl bg-black/40 border border-purple-500/20 flex flex-col items-center justify-center p-1 text-center">
                  {sp.card ? (
                    <div onClick={() => onInspectCard?.(sp.card)} className="w-full h-full rounded-lg bg-purple-950/80 border border-purple-400/50 p-1 flex flex-col justify-between cursor-pointer">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-gothic text-purple-200 truncate">{sp.card.name}</span>
                        <span className="font-mono font-bold text-amber-400">P{sp.card.power}</span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-[9px] font-mono text-gray-600">Tour AI</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Row 3: Contested Frontline (Knight Left ♞, Prince Center 👑, Knight Right ♞) */}
          <div className="grid grid-cols-3 gap-2 py-1">
            {/* Knight Left */}
            <div
              onClick={() => selectedHandCard && handleDeployToSpace('knight_left')}
              className={`h-24 rounded-2xl border-2 transition-all p-1.5 flex flex-col justify-between ${
                board.knight_left.playerCard
                  ? 'bg-emerald-950/60 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : board.knight_left.aiCard
                    ? 'bg-purple-950/60 border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                    : selectedHandCard
                      ? 'bg-red-950/40 border-red-500/70 hover:scale-105 cursor-pointer animate-pulse'
                      : 'bg-[#180f12] border-amber-500/30'
              }`}
            >
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-gothic font-bold text-amber-300">♞ Cavalier Ouest</span>
                <span className="text-[9px] font-mono text-amber-400 bg-black/60 px-1 rounded">+2 Pts</span>
              </div>
              <div className="text-center my-auto">
                {board.knight_left.playerCard ? (
                  <div onClick={(e) => { e.stopPropagation(); onInspectCard?.(board.knight_left.playerCard); }} className="cursor-pointer">
                    <div className="font-gothic font-bold text-xs text-emerald-300 truncate">{board.knight_left.playerCard.name}</div>
                    <div className="text-[10px] font-mono text-amber-400 font-bold">Puiss: {board.knight_left.playerPower} (+{playerChain[0].totalSupportToFront} Soutien)</div>
                  </div>
                ) : board.knight_left.aiCard ? (
                  <div onClick={(e) => { e.stopPropagation(); onInspectCard?.(board.knight_left.aiCard); }} className="cursor-pointer">
                    <div className="font-gothic font-bold text-xs text-purple-300 truncate">{board.knight_left.aiCard.name}</div>
                    <div className="text-[10px] font-mono text-amber-400 font-bold">Puiss: {board.knight_left.aiPower} (+{aiChain[0].totalSupportToFront} Soutien)</div>
                  </div>
                ) : (
                  <span className="text-xs text-gray-500">{selectedHandCard ? 'Déployer ici' : 'Contesté'}</span>
                )}
              </div>
            </div>

            {/* Prince Center (Crown 👑) */}
            <div
              onClick={() => selectedHandCard && handleDeployToSpace('prince')}
              className={`h-24 rounded-2xl border-2 transition-all p-1.5 flex flex-col justify-between ${
                board.prince.playerCard
                  ? 'bg-gradient-to-b from-amber-950/80 to-[#120e06] border-amber-400 shadow-[0_0_18px_rgba(212,175,55,0.5)]'
                  : board.prince.aiCard
                    ? 'bg-purple-950/80 border-purple-400 shadow-[0_0_18px_rgba(168,85,247,0.4)]'
                    : selectedHandCard
                      ? 'bg-red-950/60 border-red-500 hover:scale-105 cursor-pointer animate-pulse'
                      : 'bg-gradient-to-b from-[#22160d] to-[#0c0906] border-amber-500/50'
              }`}
            >
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-gothic font-bold text-amber-300 flex items-center space-x-1">
                  <Crown className="w-3 h-3 text-amber-400" />
                  <span>Trône du Prince</span>
                </span>
                <span className="text-[9px] font-mono text-amber-300 bg-black/60 px-1 rounded">1 pt/allié</span>
              </div>
              <div className="text-center my-auto">
                {board.prince.playerCard ? (
                  <div onClick={(e) => { e.stopPropagation(); onInspectCard?.(board.prince.playerCard); }} className="cursor-pointer">
                    <div className="font-gothic font-bold text-xs text-amber-200 truncate">{board.prince.playerCard.name}</div>
                    <div className="text-[10px] font-mono text-amber-400 font-bold">Puiss: {board.prince.playerPower} (+{playerChain[1].totalSupportToFront} Soutien)</div>
                  </div>
                ) : board.prince.aiCard ? (
                  <div onClick={(e) => { e.stopPropagation(); onInspectCard?.(board.prince.aiCard); }} className="cursor-pointer">
                    <div className="font-gothic font-bold text-xs text-purple-200 truncate">{board.prince.aiCard.name}</div>
                    <div className="text-[10px] font-mono text-amber-400 font-bold">Puiss: {board.prince.aiPower} (+{aiChain[1].totalSupportToFront} Soutien)</div>
                  </div>
                ) : (
                  <span className="text-xs text-amber-400/80 font-gothic font-bold">{selectedHandCard ? '👑 Régner ici' : 'Trône Vacant'}</span>
                )}
              </div>
            </div>

            {/* Knight Right */}
            <div
              onClick={() => selectedHandCard && handleDeployToSpace('knight_right')}
              className={`h-24 rounded-2xl border-2 transition-all p-1.5 flex flex-col justify-between ${
                board.knight_right.playerCard
                  ? 'bg-emerald-950/60 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : board.knight_right.aiCard
                    ? 'bg-purple-950/60 border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                    : selectedHandCard
                      ? 'bg-red-950/40 border-red-500/70 hover:scale-105 cursor-pointer animate-pulse'
                      : 'bg-[#180f12] border-amber-500/30'
              }`}
            >
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-gothic font-bold text-amber-300">♞ Cavalier Est</span>
                <span className="text-[9px] font-mono text-amber-400 bg-black/60 px-1 rounded">+2 Pts</span>
              </div>
              <div className="text-center my-auto">
                {board.knight_right.playerCard ? (
                  <div onClick={(e) => { e.stopPropagation(); onInspectCard?.(board.knight_right.playerCard); }} className="cursor-pointer">
                    <div className="font-gothic font-bold text-xs text-emerald-300 truncate">{board.knight_right.playerCard.name}</div>
                    <div className="text-[10px] font-mono text-amber-400 font-bold">Puiss: {board.knight_right.playerPower} (+{playerChain[2].totalSupportToFront} Soutien)</div>
                  </div>
                ) : board.knight_right.aiCard ? (
                  <div onClick={(e) => { e.stopPropagation(); onInspectCard?.(board.knight_right.aiCard); }} className="cursor-pointer">
                    <div className="font-gothic font-bold text-xs text-purple-300 truncate">{board.knight_right.aiCard.name}</div>
                    <div className="text-[10px] font-mono text-amber-400 font-bold">Puiss: {board.knight_right.aiPower} (+{aiChain[2].totalSupportToFront} Soutien)</div>
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
              return (
                <div
                  key={sp.key}
                  onClick={() => selectedHandCard && handleDeployToSpace(sp.key)}
                  className={`h-16 rounded-xl border transition-all flex flex-col items-center justify-between p-1.5 ${
                    sp.card
                      ? 'bg-emerald-950/50 border-emerald-500/70 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                      : selectedHandCard
                        ? 'bg-red-950/30 border-red-500/50 hover:border-emerald-400 cursor-pointer animate-pulse'
                        : 'bg-black/40 border-white/10'
                  }`}
                >
                  {sp.card ? (
                    <div onClick={(e) => { e.stopPropagation(); onInspectCard?.(sp.card); }} className="w-full h-full flex flex-col justify-between cursor-pointer">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-gothic text-emerald-300 truncate">{sp.card.name}</span>
                        <span className="font-mono font-bold text-amber-400">P{sp.power}</span>
                      </div>
                      <span className="text-[8px] font-mono text-emerald-400/80 text-center">↑ Transmet Soutien</span>
                    </div>
                  ) : (
                    <span className="text-[9px] font-mono text-gray-500 my-auto">Tour (Relais)</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Row 5: Player Pawns (Bottom) */}
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map(col => {
              const sp = board[`player_pawn_${col}`];
              return (
                <div
                  key={sp.key}
                  onClick={() => selectedHandCard && handleDeployToSpace(sp.key)}
                  className={`h-16 rounded-xl border transition-all flex flex-col items-center justify-between p-1.5 ${
                    sp.card
                      ? 'bg-emerald-950/50 border-emerald-500/70 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                      : selectedHandCard
                        ? 'bg-red-950/30 border-red-500/50 hover:border-emerald-400 cursor-pointer animate-pulse'
                        : 'bg-black/40 border-white/10'
                  }`}
                >
                  {sp.card ? (
                    <div onClick={(e) => { e.stopPropagation(); onInspectCard?.(sp.card); }} className="w-full h-full flex flex-col justify-between cursor-pointer">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-gothic text-emerald-300 truncate">{sp.card.name}</span>
                        <span className="font-mono font-bold text-amber-400">P{sp.power}</span>
                      </div>
                      <span className="text-[8px] font-mono text-emerald-400/80 text-center">♟️ Base Pion</span>
                    </div>
                  ) : (
                    <span className="text-[9px] font-mono text-gray-500 my-auto">♟️ Pion (Base)</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Player Hand & Action Bar (Matches Screenshots 2 & 3) */}
      <div className="space-y-3 pt-1">
        {/* Hand Cards */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto py-1 px-2">
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
                className={`w-20 sm:w-24 h-28 rounded-xl border-2 transition-all p-1 flex flex-col justify-between cursor-pointer transform ${
                  isSelected
                    ? 'bg-red-950 border-red-500 shadow-blood -translate-y-2 scale-105'
                    : canAfford
                      ? 'bg-[#10141f] border-white/20 hover:border-amber-400 hover:-translate-y-1'
                      : 'bg-[#080a0f] border-white/5 opacity-40 cursor-not-allowed'
                }`}
              >
                {/* Top: Blood Drop (Left) & Power (Right) */}
                <div className="flex items-center justify-between">
                  <span className="w-5 h-5 rounded-full bg-red-900 border border-red-500 text-[10px] font-bold text-white flex items-center justify-center font-mono shadow-blood">
                    {card.cost}
                  </span>
                  <span className="font-mono text-amber-400 text-xs font-bold">
                    {card.power}
                  </span>
                </div>

                {/* Character Name */}
                <div className="text-center">
                  <div className="font-gothic font-bold text-[10px] text-gray-100 truncate">{card.name}</div>
                  <div className="text-[8px] font-mono text-gray-400 truncate">{card.clan}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Bar (ABANDONNER | BLOOD DROP | FIN DU TOUR) */}
        <div className="flex items-center justify-between gap-3 px-2">
          {/* Left Pill: ABANDONNER */}
          <button
            onClick={() => setGameStarted(false)}
            className="flex-1 py-2.5 rounded-full bg-[#12151f] hover:bg-[#1c2233] border border-white/15 text-gray-400 hover:text-white font-gothic font-bold text-xs transition-all text-center tracking-wider"
          >
            ABANDONNER
          </button>

          {/* Center: Glowing Blood Drop */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-b from-red-700 to-rose-950 border-2 border-red-500 flex items-center justify-center text-white font-mono font-bold text-lg shadow-blood animate-pulse">
            {bloodAvailable}
          </div>

          {/* Right Pill: FIN DU TOUR - MANCHE X/7 */}
          <button
            onClick={handleEndTurn}
            disabled={isResolvingRound || isGameOver}
            className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-red-700 via-red-600 to-rose-900 hover:from-red-600 hover:to-rose-800 text-white font-gothic font-bold text-xs shadow-blood transition-all transform active:scale-95 text-center tracking-wider"
          >
            FIN DU TOUR<br />
            <span className="text-[9px] font-mono opacity-80">MANCHE {turn}/7</span>
          </button>
        </div>

        {/* Chronicle History Log */}
        <div className="glass-panel p-3 rounded-xl border border-white/10 max-h-24 overflow-y-auto text-[11px] font-mono space-y-0.5">
          <div className="text-gray-500 font-bold uppercase text-[10px]">Journal de Combat :</div>
          {historyLogs.map((log, index) => (
            <div key={index} className="text-gray-300">
              • {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
