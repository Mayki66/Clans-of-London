import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Shuffle, Droplets, Shield, Trophy, ChevronRight, Crown, Sparkles, Swords, ArrowUp } from 'lucide-react';
import CardFrame from '../Card/CardFrame';
import confetti from 'canvas-confetti';

export default function TurnSimulator({ deckCards, onInspectCard, lang = 'fr', t }) {
  const isFrench = lang === 'fr';
  const [gameState, setGameState] = useState(null);

  const getSpaceName = (key) => {
    return t?.simulator?.spaces?.[key] || {
      knight_left: 'Cavalier Ouest',
      prince: 'Trône du Prince',
      knight_right: 'Cavalier Est',
      rook_left: 'Tour Ouest',
      rook_center: 'Tour Centrale',
      rook_right: 'Tour Est',
      pawn_left: 'Pion Ouest',
      pawn_center: 'Pion Central',
      pawn_right: 'Pion Est'
    }[key] || key;
  };

  // Initialize a new simulation with exact 15-space topology
  const startSimulation = () => {
    if (deckCards.length === 0) return;

    // Check if any card starts in opening hand (e.g. Katie Dixon)
    const guaranteedInHand = deckCards.filter(c => 
      c.ability_en?.toLowerCase().includes('starts in your opening hand') || 
      c.ability?.toLowerCase().includes('main de départ')
    );
    const restOfDeck = deckCards.filter(c => !guaranteedInHand.some(g => g.id === c.id));
    const shuffled = [...restOfDeck].sort(() => Math.random() - 0.5);
    
    const needed = 4 - guaranteedInHand.length;
    const startingHand = [...guaranteedInHand, ...shuffled.slice(0, Math.max(0, needed))];
    const drawPile = shuffled.slice(Math.max(0, needed));

    setGameState({
      turn: 1,
      maxTurns: 7,
      bloodAvailable: 2,
      totalBloodThisTurn: 2,
      victoryPoints: 0,
      roundScoreHistory: [],
      hand: startingHand,
      drawPile: drawPile,
      // Exact 15-space topology layout (3 lines of 3 columns)
      board: {
        // Frontline
        knight_left: { id: 'knight_left', name: getSpaceName('knight_left'), type: 'Knight', points: 2, cards: [], power: 0, col: 0, row: 'front' },
        prince: { id: 'prince', name: getSpaceName('prince'), type: 'Prince', points: t?.simulator?.princeScoreRule || (isFrench ? '1 pt / carte alliée' : '1 pt / allied unit'), cards: [], power: 0, col: 1, row: 'front' },
        knight_right: { id: 'knight_right', name: getSpaceName('knight_right'), type: 'Knight', points: 2, cards: [], power: 0, col: 2, row: 'front' },
        // Midline
        rook_left: { id: 'rook_left', name: getSpaceName('rook_left'), type: 'Rook', cards: [], power: 0, col: 0, row: 'mid' },
        rook_center: { id: 'rook_center', name: getSpaceName('rook_center'), type: 'Rook', cards: [], power: 0, col: 1, row: 'mid' },
        rook_right: { id: 'rook_right', name: getSpaceName('rook_right'), type: 'Rook', cards: [], power: 0, col: 2, row: 'mid' },
        // Backline
        pawn_left: { id: 'pawn_left', name: getSpaceName('pawn_left'), type: 'Pawn', cards: [], power: 0, col: 0, row: 'back' },
        pawn_center: { id: 'pawn_center', name: getSpaceName('pawn_center'), type: 'Pawn', cards: [], power: 0, col: 1, row: 'back' },
        pawn_right: { id: 'pawn_right', name: getSpaceName('pawn_right'), type: 'Pawn', cards: [], power: 0, col: 2, row: 'back' }
      },
      selectedCard: null,
      turnHistory: [
        isFrench 
          ? 'Partie officielle lancée : Tour 1 (2 Sang disponibles). Main de départ générée.' 
          : 'Match launched: Round 1 (2 Blood available). Starting hand drawn.'
      ],
      isFinished: false
    });
  };

  useEffect(() => {
    if (deckCards.length >= 5 && !gameState) {
      startSimulation();
    }
  }, [deckCards]);

  if (deckCards.length < 5) {
    return (
      <div className="glass-panel rounded-2xl p-6 text-center border border-white/10 text-gray-400">
        <Play className="w-10 h-10 mx-auto text-red-500 mb-2 opacity-60 animate-pulse" />
        <h4 className="font-gothic font-bold text-base text-gray-200">{t?.simulator?.title || "Simulateur Officiel de Duel (7 Rounds)"}</h4>
        <p className="text-xs text-gray-400 mt-1">{t?.simulator?.subtitle || "Ajoutez au moins 5 cartes à votre deck pour tester la pioche, la chaîne de soutien et le score officiel."}</p>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="glass-panel rounded-2xl p-6 text-center border border-white/10">
        <button
          onClick={startSimulation}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-rose-900 hover:from-red-600 hover:to-rose-800 text-white font-gothic font-bold text-sm shadow-blood transition-all"
        >
          {t?.simulator?.startSimulationBtn || "Lancer la Simulation Tactique"}
        </button>
      </div>
    );
  }

  // Play a card into an exact space
  const playCardToSpace = (spaceKey) => {
    if (!gameState.selectedCard) return;
    const card = gameState.selectedCard;

    if (card.cost > gameState.bloodAvailable) {
      alert(isFrench 
        ? `Pas assez de Sang ! Coût : ${card.cost} Sang, Disponible : ${gameState.bloodAvailable} Sang`
        : `Not enough Blood! Cost: ${card.cost} Blood, Available: ${gameState.bloodAvailable} Blood`
      );
      return;
    }

    const newHand = gameState.hand.filter(c => c.id !== card.id);
    const targetSpace = gameState.board[spaceKey];
    const updatedSpace = {
      ...targetSpace,
      cards: [...targetSpace.cards, card],
      power: targetSpace.power + card.power
    };

    const cardName = card.name;
    const logMsg = isFrench
      ? `Tour ${gameState.turn} : "${cardName}" déployé sur ${getSpaceName(spaceKey)} (+${card.power} Puissance).`
      : `Round ${gameState.turn}: "${cardName}" deployed to ${getSpaceName(spaceKey)} (+${card.power} Power).`;

    setGameState(prev => ({
      ...prev,
      bloodAvailable: prev.bloodAvailable - card.cost,
      hand: newHand,
      selectedCard: null,
      board: {
        ...prev.board,
        [spaceKey]: updatedSpace
      },
      turnHistory: [
        logMsg,
        ...prev.turnHistory
      ]
    }));
  };

  // Next Turn & Exact Official Scoring
  const nextTurn = () => {
    // 1. Calculate round score according to official rules:
    // - 2 pts per controlled Knight
    // - 1 pt per ally card on the entire board if Prince is controlled
    const totalAlliesOnBoard = Object.values(gameState.board).reduce((acc, s) => acc + s.cards.length, 0);
    let roundPoints = 0;
    const scoreDetails = [];

    if (gameState.board.knight_left.cards.length > 0) {
      roundPoints += 2;
      scoreDetails.push((t?.simulator?.spaceKnightWest || 'Cavalier Ouest') + ' (+2 pts)');
    }
    if (gameState.board.knight_right.cards.length > 0) {
      roundPoints += 2;
      scoreDetails.push((t?.simulator?.spaceKnightEast || 'Cavalier Est') + ' (+2 pts)');
    }
    if (gameState.board.prince.cards.length > 0) {
      const princePts = totalAlliesOnBoard;
      roundPoints += princePts;
      scoreDetails.push(`${t?.simulator?.spacePrince || 'Trône du Prince'} (+${princePts} pts)`);
    }

    const newVictoryPoints = gameState.victoryPoints + roundPoints;
    const roundSummary = scoreDetails.length > 0
      ? ((t?.simulator?.roundEndLog || 'Fin Round {turn} : +{points} Points ({details})').replace('{turn}', gameState.turn).replace('{points}', roundPoints).replace('{details}', scoreDetails.join(' • ')))
      : ((t?.simulator?.roundEndZeroLog || 'Fin Round {turn} : 0 point marqué.').replace('{turn}', gameState.turn));

    if (gameState.turn >= gameState.maxTurns) {
      // Climax turn 7
      setGameState(prev => ({
        ...prev,
        victoryPoints: newVictoryPoints,
        isFinished: true,
        turnHistory: [
          (t?.simulator?.finalVictoryLog || '🏆 VICTOIRE FINALE : Score total de {points} Points de Victoire !').replace('{points}', newVictoryPoints),
          roundSummary,
          ...prev.turnHistory
        ]
      }));
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      return;
    }

    const nextTurnNum = gameState.turn + 1;
    const bloodForTurn = nextTurnNum + 1; // T1=2, T2=3, T3=4, T4=5, T5=6, T6=7, T7=8
    const newDrawPile = [...gameState.drawPile];
    const drawnCard = newDrawPile.shift();
    const newHand = drawnCard ? [...gameState.hand, drawnCard] : [...gameState.hand];

    const turnStartMsg = isFrench
      ? `Début du Tour ${nextTurnNum} : +${bloodForTurn} Sang disponible. ${drawnCard ? `Carte piochée : "${drawnCard.name}".` : 'Pioche vide.'}`
      : `Start of Round ${nextTurnNum}: +${bloodForTurn} Blood available. ${drawnCard ? `Card drawn: "${drawnCard.name}".` : 'Empty deck.'}`;

    setGameState(prev => ({
      ...prev,
      turn: nextTurnNum,
      bloodAvailable: bloodForTurn,
      totalBloodThisTurn: bloodForTurn,
      victoryPoints: newVictoryPoints,
      hand: newHand,
      drawPile: newDrawPile,
      selectedCard: null,
      turnHistory: [
        turnStartMsg,
        roundSummary,
        ...prev.turnHistory
      ]
    }));
  };

  const totalBoardPower = Object.values(gameState.board).reduce((acc, z) => acc + z.power, 0);

  return (
    <div className="glass-panel rounded-2xl p-5 space-y-5 border border-white/10 shadow-2xl">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-gothic font-extrabold text-lg text-gray-100 flex items-center space-x-2">
              <Crown className="w-5 h-5 text-amber-400" />
              <span>{t?.simulator?.boardTopologyTitle || "Plateau Tactique"} : {t?.simulator?.turn || "Tour"} {gameState.turn} / {gameState.maxTurns}</span>
            </h3>
            {gameState.isFinished && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300 animate-pulse">
                {t?.simulator?.matchComplete || (isFrench ? "Match Terminé (7 Rounds Climax)" : "Match Complete (7 Rounds Climax)")}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400">
            {t?.simulator?.headerSubtitle || (isFrench ? "Topologie officielle 15 cases • Chaîne de Soutien • Score officiel" : "Official 15-space topology • Support Chain • Official scoring")}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={startSimulation}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-gray-300 hover:text-white text-xs font-semibold transition-all"
            title={t?.simulator?.mulliganTooltip || 'Mulligan'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t?.simulator?.resetBtn || "Relancer"}</span>
          </button>

          {!gameState.isFinished && (
            <button
              onClick={nextTurn}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-red-700 to-rose-900 hover:from-red-600 hover:to-rose-800 text-white font-gothic font-bold text-xs shadow-blood transition-all"
            >
              <span>{gameState.turn === 7 ? (t?.simulator?.calculateFinalScore || (isFrench ? 'Calculer le Score Final' : 'Calculate Final Score')) : (t?.simulator?.endTurnBtn || 'Fin du Round & Décompte')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Resource, Victory Points & Total Power Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-[#0b0e14] border border-red-500/30 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-red-900 border border-red-500 flex items-center justify-center font-bold text-white shadow-blood">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono text-gray-400">{t?.simulator?.bloodAvailable || "Sang Actuel"}</div>
              <div className="text-base font-bold font-mono text-red-400">
                {gameState.bloodAvailable} / {gameState.totalBloodThisTurn}
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#0b0e14] border border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-900 border border-emerald-500 flex items-center justify-center font-bold text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]">
              <Trophy className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono text-gray-400">{t?.simulator?.victoryPoints || "Points de Victoire"}</div>
              <div className="text-base font-bold font-mono text-emerald-400">
                {gameState.victoryPoints} Pts
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#0b0e14] border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-amber-900 border border-amber-500 flex items-center justify-center font-bold text-white shadow-gold">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono text-gray-400">{t?.simulator?.totalPower || (isFrench ? "Puissance Totale" : "Total Power")}</div>
              <div className="text-base font-bold font-mono text-amber-400">
                {totalBoardPower}
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#0b0e14] border border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-white">
              <Shuffle className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono text-gray-400">{t?.simulator?.drawPile || "Pioche"}</div>
              <div className="text-base font-bold font-mono text-purple-300">
                {gameState.drawPile.length} {t?.stats?.cardCount || "cartes"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Official 15-Space Tactical Board */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-[11px] uppercase font-mono text-gray-400 font-bold px-1">
          <span>{t?.simulator?.boardTopologyTitle || "Topologie Officielle du Plateau :"}</span>
          <span className="text-amber-400">{t?.simulator?.supportChainHint || (isFrench ? "Soutien ascendant : Pions ➔ Tours ➔ Cavaliers/Prince" : "Ascending support: Pawns ➔ Rooks ➔ Knights/Prince")}</span>
        </div>

        {/* Row 1: Frontline (Knight Left, Prince Center, Knight Right) */}
        <div className="space-y-1">
          <div className="text-[10px] uppercase font-mono text-red-400 font-bold px-1 flex items-center space-x-1">
            <Swords className="w-3 h-3" />
            <span>{t?.simulator?.frontlineTitle || (isFrench ? "Ligne de Front Disputée (Score actif en fin de round)" : "Contested Frontline (Scored at end of round)")}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {['knight_left', 'prince', 'knight_right'].map(key => {
              const space = gameState.board[key];
              const isPrince = key === 'prince';
              return (
                <div
                  key={key}
                  onClick={() => gameState.selectedCard && playCardToSpace(key)}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col justify-between min-h-[120px] ${
                    isPrince
                      ? 'bg-gradient-to-b from-[#201509] to-[#0d0905] border-amber-500/70 shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                      : 'bg-[#180d0d] border-red-500/40'
                  } ${
                    gameState.selectedCard
                      ? 'cursor-pointer hover:border-red-400 hover:scale-[1.02]'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-gothic font-bold text-xs ${isPrince ? 'text-amber-300 flex items-center space-x-1' : 'text-red-300'}`}>
                      {isPrince && <Crown className="w-3.5 h-3.5 text-amber-400 inline" />}
                      <span>{getSpaceName(key)}</span>
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-black/60 border border-white/10 text-amber-300">
                      {space.points}
                    </span>
                  </div>

                  <div className="space-y-1 my-1">
                    {space.cards.length === 0 ? (
                      <p className="text-[10px] text-gray-500 italic text-center py-2">
                        {gameState.selectedCard ? (t?.simulator?.clickSpaceToDeploy || 'Cliquer pour déployer') : (t?.simulator?.openSlot || (isFrench ? 'Emplacement libre' : 'Open slot'))}
                      </p>
                    ) : (
                      space.cards.map((c, i) => (
                        <div
                          key={i}
                          onClick={(e) => { e.stopPropagation(); onInspectCard?.(c); }}
                          className="flex items-center justify-between p-1 rounded bg-black/70 border border-white/10 text-[11px] hover:border-amber-400/50 cursor-pointer"
                        >
                          <span className="font-gothic text-gray-200 truncate">{c.name}</span>
                          <span className="font-mono text-amber-400 font-bold">P{c.power}</span>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="text-[10px] font-mono text-gray-400 flex items-center justify-between pt-1 border-t border-white/5">
                    <span>{t?.simulator?.slotTotalPower || (isFrench ? "Puissance totale :" : "Total Power:")}</span>
                    <span className="font-bold text-amber-300">{space.power} Pts</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Row 2: Midline (Rooks) */}
        <div className="space-y-1">
          <div className="text-[10px] uppercase font-mono text-purple-400 font-bold px-1 flex items-center space-x-1">
            <ArrowUp className="w-3 h-3" />
            <span>{t?.simulator?.midlineTitle || (isFrench ? "Rangée Médiane : 3 Tours (Rooks - Relais de Soutien)" : "Middle Row: 3 Rooks (Support Relays)")}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {['rook_left', 'rook_center', 'rook_right'].map(key => {
              const space = gameState.board[key];
              return (
                <div
                  key={key}
                  onClick={() => gameState.selectedCard && playCardToSpace(key)}
                  className={`p-2.5 rounded-xl border transition-all flex flex-col justify-between min-h-[100px] bg-[#100c17] border-purple-500/30 ${
                    gameState.selectedCard
                      ? 'cursor-pointer hover:border-purple-400 hover:scale-[1.02]'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-gothic font-bold text-xs text-purple-300">{getSpaceName(key)}</span>
                    <span className="text-[10px] font-mono text-purple-400">P{space.power}</span>
                  </div>

                  <div className="space-y-1 my-1">
                    {space.cards.length === 0 ? (
                      <p className="text-[10px] text-gray-600 italic text-center py-1">{t?.simulator?.emptySlot || (isFrench ? "Libre" : "Empty")}</p>
                    ) : (
                      space.cards.map((c, i) => (
                        <div
                          key={i}
                          onClick={(e) => { e.stopPropagation(); onInspectCard?.(c); }}
                          className="flex items-center justify-between p-1 rounded bg-black/60 border border-white/10 text-[11px] cursor-pointer"
                        >
                          <span className="font-gothic text-gray-200 truncate">{c.name}</span>
                          <span className="font-mono text-amber-400 font-bold">P{c.power}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Row 3: Backline (Pawns) */}
        <div className="space-y-1">
          <div className="text-[10px] uppercase font-mono text-blue-400 font-bold px-1 flex items-center space-x-1">
            <span>{t?.simulator?.backlineTitle || (isFrench ? "Rangée Arrière : 3 Pions (Pawns - Base & Ancrage)" : "Back Row: 3 Pawns (Base & Anchors)")}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {['pawn_left', 'pawn_center', 'pawn_right'].map(key => {
              const space = gameState.board[key];
              return (
                <div
                  key={key}
                  onClick={() => gameState.selectedCard && playCardToSpace(key)}
                  className={`p-2.5 rounded-xl border transition-all flex flex-col justify-between min-h-[90px] bg-[#0c1018] border-blue-500/30 ${
                    gameState.selectedCard
                      ? 'cursor-pointer hover:border-blue-400 hover:scale-[1.02]'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-gothic font-bold text-xs text-blue-300">{getSpaceName(key)}</span>
                    <span className="text-[10px] font-mono text-blue-400">P{space.power}</span>
                  </div>

                  <div className="space-y-1 my-1">
                    {space.cards.length === 0 ? (
                      <p className="text-[10px] text-gray-600 italic text-center py-1">{t?.simulator?.emptySlot || (isFrench ? "Libre" : "Empty")}</p>
                    ) : (
                      space.cards.map((c, i) => (
                        <div
                          key={i}
                          onClick={(e) => { e.stopPropagation(); onInspectCard?.(c); }}
                          className="flex items-center justify-between p-1 rounded bg-black/60 border border-white/10 text-[11px] cursor-pointer"
                        >
                          <span className="font-gothic text-gray-200 truncate">{c.name}</span>
                          <span className="font-mono text-amber-400 font-bold">P{c.power}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hand Cards */}
      <div className="space-y-2 pt-2 border-t border-white/10">
        <div className="flex items-center justify-between text-xs text-gray-300 font-gothic font-semibold uppercase tracking-wider">
          <span>{t?.simulator?.handTitle || "Main Actuelle"} ({gameState.hand.length} {t?.stats?.cardCount || "cartes"}) :</span>
          <span className="text-[11px] font-mono text-amber-400">
            {gameState.selectedCard ? (isFrench ? `Sélectionnée : "${gameState.selectedCard.name}" (Cliquez sur une case du plateau pour la jouer)` : `Selected: "${gameState.selectedCard.name}" (Click a board space to deploy)`) : (t?.simulator?.clickCardToSelect || (isFrench ? 'Cliquez sur une carte abordable pour la sélectionner' : 'Click an affordable card to select'))}
          </span>
        </div>

        {gameState.hand.length === 0 ? (
          <p className="text-xs text-gray-500 italic p-3 text-center bg-[#090b10] rounded-xl">
            {t?.simulator?.emptyHandHint || (isFrench ? 'Votre main est vide pour ce tour. Cliquez sur "Fin du Round" pour piocher et recharger votre réserve de Sang.' : 'Your hand is empty for this round. Click "End Turn" to draw and restore Blood.')}
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {gameState.hand.map((card) => {
              const canAfford = card.cost <= gameState.bloodAvailable;
              const isSelected = gameState.selectedCard?.id === card.id;

              return (
                <div
                  key={card.id}
                  onClick={() => {
                    if (isSelected) {
                      setGameState(prev => ({ ...prev, selectedCard: null }));
                    } else if (canAfford) {
                      setGameState(prev => ({ ...prev, selectedCard: card }));
                    }
                  }}
                  className={`p-2.5 rounded-xl border-2 transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-red-950 border-red-500 shadow-blood scale-105'
                      : canAfford
                        ? 'bg-[#121520] hover:bg-[#181d2c] border-white/20 hover:border-amber-400'
                        : 'bg-[#090a0f] border-white/5 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="w-5 h-5 rounded-full bg-red-800 text-[10px] font-bold text-white flex items-center justify-center font-mono">
                      {card.cost}
                    </span>
                    <span className="font-mono text-amber-400 text-xs font-bold">
                      P{card.power}
                    </span>
                  </div>
                  <div className="font-gothic font-bold text-xs text-gray-100 truncate">
                    {card.name}
                  </div>
                  <div className="text-[10px] text-gray-400 truncate mt-0.5">
                    {card.clan} • {card.archetype}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Turn Activity Log */}
      <div className="space-y-1 bg-[#090b10] p-3 rounded-xl border border-white/5 max-h-32 overflow-y-auto text-[11px] font-mono text-gray-400">
        <div className="text-gray-500 font-bold uppercase text-[10px] mb-1">{t?.simulator?.turnHistoryTitle || "Journal des Actions"} :</div>
        {gameState.turnHistory.map((log, index) => (
          <div key={index} className="text-gray-300">
            • {log}
          </div>
        ))}
      </div>
    </div>
  );
}
