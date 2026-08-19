import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Shuffle, Droplets, Shield, Trophy, ChevronRight, Crown, Sparkles } from 'lucide-react';
import CardFrame from '../Card/CardFrame';
import confetti from 'canvas-confetti';

export default function TurnSimulator({ deckCards, onInspectCard }) {
  const [gameState, setGameState] = useState(null);

  // Initialize a new simulation
  const startSimulation = () => {
    if (deckCards.length === 0) return;

    // Shuffle deck
    const shuffled = [...deckCards].sort(() => Math.random() - 0.5);
    const startingHand = shuffled.slice(0, 4);
    const drawPile = shuffled.slice(4);

    setGameState({
      turn: 1,
      maxTurns: 7,
      bloodAvailable: 2,
      totalBloodThisTurn: 2,
      hand: startingHand,
      drawPile: drawPile,
      zones: {
        north: { name: 'Camden & Soho (Zone Nord)', cards: [], power: 0 },
        prince: { name: 'Le Prince de Londres (Zone Centrale)', cards: [], power: 0 },
        south: { name: 'Whitechapel & Docks (Zone Sud)', cards: [], power: 0 }
      },
      selectedCard: null,
      turnHistory: ['Partie lancée : Tour 1. 2 Sang disponibles.'],
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
        <h4 className="font-gothic font-bold text-base text-gray-200">Simulateur de Duel (7 Tours)</h4>
        <p className="text-xs text-gray-400 mt-1">Ajoutez au moins 5 cartes à votre deck pour tester la pioche et les 7 tours de jeu.</p>
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
          Lancer la Simulation de Duel
        </button>
      </div>
    );
  }

  // Play a card into a zone
  const playCardToZone = (zoneKey) => {
    if (!gameState.selectedCard) return;
    const card = gameState.selectedCard;

    if (card.cost > gameState.bloodAvailable) {
      alert(`Pas assez de Sang ! Coût : ${card.cost}, Disponible : ${gameState.bloodAvailable}`);
      return;
    }

    const newHand = gameState.hand.filter(c => c.id !== card.id);
    const updatedZone = {
      ...gameState.zones[zoneKey],
      cards: [...gameState.zones[zoneKey].cards, card],
      power: gameState.zones[zoneKey].power + card.power
    };

    setGameState(prev => ({
      ...prev,
      bloodAvailable: prev.bloodAvailable - card.cost,
      hand: newHand,
      selectedCard: null,
      zones: {
        ...prev.zones,
        [zoneKey]: updatedZone
      },
      turnHistory: [
        `Tour ${prev.turn} : "${card.name}" déployé sur ${prev.zones[zoneKey].name} (+${card.power} Puissance).`,
        ...prev.turnHistory
      ]
    }));
  };

  // Next Turn
  const nextTurn = () => {
    if (gameState.turn >= gameState.maxTurns) {
      // Climax turn 7
      setGameState(prev => ({ ...prev, isFinished: true }));
      confetti({
        particleCount: 80,
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

    setGameState(prev => ({
      ...prev,
      turn: nextTurnNum,
      bloodAvailable: bloodForTurn,
      totalBloodThisTurn: bloodForTurn,
      hand: newHand,
      drawPile: newDrawPile,
      selectedCard: null,
      turnHistory: [
        `Début du Tour ${nextTurnNum} : +${nextTurnNum} Sang disponible. ${drawnCard ? `Carte piochée : ${drawnCard.name}.` : 'Plus de cartes dans la pioche.'}`,
        ...prev.turnHistory
      ]
    }));
  };

  const totalBoardPower = Object.values(gameState.zones).reduce((acc, z) => acc + z.power, 0);

  return (
    <div className="glass-panel rounded-2xl p-5 space-y-5 border border-white/10 shadow-2xl">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-gothic font-extrabold text-lg text-gray-100 flex items-center space-x-2">
              <Crown className="w-5 h-5 text-amber-400" />
              <span>Simulateur de Match : Tour {gameState.turn} / {gameState.maxTurns}</span>
            </h3>
            {gameState.isFinished && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300">
                Match Terminé (Tour 7 Climax)
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400">
            Format King of the Hill de Londres • Pioche 1 carte par tour • Gestion de Sang
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={startSimulation}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-gray-300 hover:text-white text-xs font-semibold transition-all"
            title="Mulligan / Recommencer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Relancer</span>
          </button>

          {!gameState.isFinished && (
            <button
              onClick={nextTurn}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-red-700 to-rose-900 hover:from-red-600 hover:to-rose-800 text-white font-gothic font-bold text-xs shadow-blood transition-all"
            >
              <span>{gameState.turn === 7 ? 'Résoudre le Match' : 'Fin du Tour'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Resource & Total Power Bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-[#0b0e14] border border-red-500/30 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-red-900 border border-red-500 flex items-center justify-center font-bold text-white shadow-blood">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono text-gray-400">Sang Disponible</div>
              <div className="text-lg font-bold font-mono text-red-400">
                {gameState.bloodAvailable} / {gameState.totalBloodThisTurn}
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
              <div className="text-[10px] uppercase font-mono text-gray-400">Puissance Totale</div>
              <div className="text-lg font-bold font-mono text-amber-400">
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
              <div className="text-[10px] uppercase font-mono text-gray-400">Pioche Restante</div>
              <div className="text-lg font-bold font-mono text-purple-300">
                {gameState.drawPile.length} cartes
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Board Zones (King of the Hill 3 zones) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {Object.entries(gameState.zones).map(([key, zone]) => {
          const isPrince = key === 'prince';
          return (
            <div
              key={key}
              onClick={() => gameState.selectedCard && playCardToZone(key)}
              className={`p-3.5 rounded-xl border-2 transition-all flex flex-col justify-between min-h-[160px] ${
                isPrince
                  ? 'bg-gradient-to-b from-[#18131d] to-[#0c0a12] border-amber-500/50 shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                  : 'bg-[#0c0e15] border-white/10'
              } ${
                gameState.selectedCard
                  ? 'cursor-pointer hover:border-red-500 hover:bg-red-950/20'
                  : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-gothic font-bold text-xs ${isPrince ? 'text-amber-300' : 'text-gray-300'}`}>
                    {isPrince && '👑 '} {zone.name}
                  </span>
                  <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-slate-900 border border-amber-500/40 text-amber-400">
                    {zone.power} Pts
                  </span>
                </div>

                {/* Deployed Cards list */}
                <div className="space-y-1">
                  {zone.cards.length === 0 ? (
                    <p className="text-[11px] text-gray-500 italic text-center py-4">
                      {gameState.selectedCard ? 'Cliquez pour déployer ici' : 'Zone inoccupée'}
                    </p>
                  ) : (
                    zone.cards.map((c, i) => (
                      <div
                        key={i}
                        onClick={(e) => { e.stopPropagation(); onInspectCard?.(c); }}
                        className="flex items-center justify-between p-1.5 rounded bg-black/60 border border-white/10 text-xs hover:border-amber-400/50 cursor-pointer"
                      >
                        <div className="flex items-center space-x-1.5 truncate">
                          <span className="w-4 h-4 rounded-full bg-red-900 text-[10px] font-bold text-white flex items-center justify-center">
                            {c.cost}
                          </span>
                          <span className="font-gothic text-gray-200 truncate">{c.name}</span>
                        </div>
                        <span className="font-mono text-amber-400 text-[11px] font-bold">
                          +{c.power}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {gameState.selectedCard && (
                <div className="mt-2 pt-2 border-t border-white/10 text-center">
                  <span className="text-[10px] font-bold uppercase text-red-400 font-gothic animate-pulse">
                    → Déployer "{gameState.selectedCard.name}" ici
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Hand Cards */}
      <div className="space-y-2 pt-2 border-t border-white/10">
        <div className="flex items-center justify-between text-xs text-gray-300 font-gothic font-semibold uppercase tracking-wider">
          <span>Main Actuelle ({gameState.hand.length} cartes) :</span>
          <span className="text-[11px] font-mono text-gray-400">
            {gameState.selectedCard ? `Sélectionnée : ${gameState.selectedCard.name} (Cliquez sur une zone)` : 'Sélectionnez une carte à jouer'}
          </span>
        </div>

        {gameState.hand.length === 0 ? (
          <p className="text-xs text-gray-500 italic p-3 text-center bg-[#090b10] rounded-xl">
            Votre main est vide pour ce tour. Cliquez sur "Fin du Tour" pour piocher et recharger votre Sang.
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
      <div className="space-y-1 bg-[#090b10] p-3 rounded-xl border border-white/5 max-h-28 overflow-y-auto text-[11px] font-mono text-gray-400">
        <div className="text-gray-500 font-bold uppercase text-[10px] mb-1">Journal de Combat :</div>
        {gameState.turnHistory.map((log, index) => (
          <div key={index} className="text-gray-300">
            • {log}
          </div>
        ))}
      </div>
    </div>
  );
}
