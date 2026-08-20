import { META_DECKS } from '../data/metaDecks';
import { CARDS_DATA } from '../data/cardsData';

export const AI_OPPONENTS = [
  {
    id: 'klinklecut',
    name: 'Klinklecut',
    title: 'Amant des Projecteurs',
    clan: 'Toreador',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    metaDeckId: 'meta-toreador-seduction',
    personality: 'Séducteur & Charme : Déploie Abir, Roland Heffé, Eliza Iyer et Damon pour capturer vos cartes et dominer le Trône.'
  },
  {
    id: 'dukaul',
    name: 'Dukaul',
    title: 'Champion des Arènes de Whitechapel',
    clan: 'Brujah',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    metaDeckId: 'meta-brujah-violent',
    personality: 'Ultra-offensif : fonce sur le Prince et agresse les lignes de front sans hésiter.'
  },
  {
    id: 'lady-elizabeth',
    name: 'Lady Elizabeth',
    title: 'Sénéchale de la City',
    clan: 'Ventrue',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    metaDeckId: 'meta-ventrue-elitiste',
    personality: 'Contrôle & Chaînes : établit des lignes de soutien parfaites et verrouille le Trône du Prince au Tour 7.'
  },
  {
    id: 'julian-lys',
    name: 'Julian Lys',
    title: 'Maître de Cérémonie de l\'Elysium',
    clan: 'Toreador',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    metaDeckId: 'meta-toreador-seduction',
    personality: 'Séducteur : capture vos cartes et préserve sa main de départ.'
  },
  {
    id: 'the-huntress',
    name: 'The Huntress',
    title: 'Alpha des Bois de Hampstead',
    clan: 'Gangrel',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
    metaDeckId: 'meta-gangrel-meute',
    personality: 'Horde : inonde le plateau de bêtes pour déchaîner des alphas monstrueux.'
  }
];

/**
 * Strict placement rule checker for the AI:
 * - Pawns: Always valid
 * - Rooks: Requires Pawn behind in same column
 * - Knight Left: Requires Rook Left
 * - Knight Right: Requires Rook Right
 * - Prince: Requires Rook Left OR Rook Center OR Rook Right
 * - Special card bypasses: Shifa (anywhere), Brixton (Knight without support)
 */
export function isAIPlacementValid(spaceKey, card, board) {
  if (!card) return false;

  // 1. Shifa bypass
  if (card.name === 'Shifa' || card.ability_en?.toLowerCase().includes('can be played anywhere')) {
    return true;
  }

  // 2. Brixton bypass
  if (card.name === 'Brixton' || card.originalName === 'Brixton') {
    return spaceKey === 'knight_left' || spaceKey === 'knight_right';
  }

  // 3. AI Pawns (Base row): Always valid
  if (spaceKey === 'ai_pawn_0' || spaceKey === 'ai_pawn_1' || spaceKey === 'ai_pawn_2') {
    return true;
  }

  // 4. AI Rooks: Requires AI Pawn behind in same column
  if (spaceKey === 'ai_rook_0') return !!board.ai_pawn_0?.card;
  if (spaceKey === 'ai_rook_1') return !!board.ai_pawn_1?.card;
  if (spaceKey === 'ai_rook_2') return !!board.ai_pawn_2?.card;

  // 5. Knight Left: Requires AI Rook 0
  if (spaceKey === 'knight_left') return !!board.ai_rook_0?.card;

  // 6. Knight Right: Requires AI Rook 2
  if (spaceKey === 'knight_right') return !!board.ai_rook_2?.card;

  // 7. Prince (Center Throne): Connected from AI Rook 0, AI Rook 1, OR AI Rook 2
  if (spaceKey === 'prince') {
    return !!board.ai_rook_0?.card || !!board.ai_rook_1?.card || !!board.ai_rook_2?.card;
  }

  return false;
}

/**
 * Executes the AI decision making for a given turn.
 * Strictly adheres to all game rules: placement chains, support links, blood costs.
 */
export function playAITurn(aiState, playerState, locationModifier) {
  const { hand, bloodAvailable, board } = aiState;
  const logs = [];
  let currentBlood = bloodAvailable;
  let currentHand = [...hand];
  const updatedBoard = { ...board };
  const playedCards = [];

  // All possible AI target spaces with base strategic weights
  const allSpaces = [
    { key: 'prince', weight: 100 },
    { key: 'knight_left', weight: 85 },
    { key: 'knight_right', weight: 85 },
    { key: 'ai_rook_1', weight: 70 },
    { key: 'ai_rook_0', weight: 60 },
    { key: 'ai_rook_2', weight: 60 },
    { key: 'ai_pawn_1', weight: 55 },
    { key: 'ai_pawn_0', weight: 45 },
    { key: 'ai_pawn_2', weight: 45 }
  ];

  let playable = currentHand.filter(c => c.cost <= currentBlood);

  while (playable.length > 0) {
    // Sort cards by cost descending / power
    playable.sort((a, b) => b.cost - a.cost || b.power - a.power);
    
    let moveMade = false;

    // Try finding a valid placement for the best affordable card
    for (const cardToPlay of playable) {
      // Find all empty spaces that are strictly legally valid for this card
      const validSpaces = allSpaces.filter(sp => {
        // Space must be empty of AI units
        if (sp.key === 'prince' || sp.key === 'knight_left' || sp.key === 'knight_right') {
          if (updatedBoard[sp.key]?.aiCard) return false;
        } else {
          if (updatedBoard[sp.key]?.card) return false;
        }

        // Must strictly satisfy connection placement rules
        return isAIPlacementValid(sp.key, cardToPlay, updatedBoard);
      });

      if (validSpaces.length > 0) {
        // Pick best valid space
        validSpaces.sort((a, b) => b.weight - a.weight);
        const chosenSpace = validSpaces[0];

        // Deduct blood & update hand
        currentBlood -= cardToPlay.cost;
        currentHand = currentHand.filter(c => c.id !== cardToPlay.id);
        playedCards.push({ card: cardToPlay, spaceKey: chosenSpace.key });

        // Place on board
        if (chosenSpace.key === 'prince' || chosenSpace.key === 'knight_left' || chosenSpace.key === 'knight_right') {
          updatedBoard[chosenSpace.key] = {
            ...updatedBoard[chosenSpace.key],
            aiCard: cardToPlay,
            aiPower: cardToPlay.power,
            faceDownAI: true
          };
        } else {
          updatedBoard[chosenSpace.key] = {
            ...updatedBoard[chosenSpace.key],
            card: cardToPlay,
            power: cardToPlay.power,
            faceDown: true
          };
        }

        logs.push(`L'IA a joué "${cardToPlay.name}" (Coût: ${cardToPlay.cost} Sang, Puissance: ${cardToPlay.power}) sur ${chosenSpace.key}.`);
        moveMade = true;
        break; // Re-evaluate with updated board state
      }
    }

    if (!moveMade) {
      // No legal placement possible with remaining blood & hand
      break;
    }

    playable = currentHand.filter(c => c.cost <= currentBlood);
  }

  return {
    remainingBlood: currentBlood,
    remainingHand: currentHand,
    updatedBoard,
    playedCards,
    logs
  };
}
