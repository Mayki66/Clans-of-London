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
 * Executes the AI decision making for a given turn.
 * Evaluates board state, affordable cards, and places units strategically.
 */
export function playAITurn(aiState, playerState, locationModifier) {
  const { hand, bloodAvailable, board } = aiState;
  const logs = [];
  let currentBlood = bloodAvailable;
  let currentHand = [...hand];
  const updatedBoard = { ...board };
  const playedCards = [];

  // Filter playable cards
  let playable = currentHand.filter(c => c.cost <= currentBlood);

  // Strategy loop: play cards while blood allows
  while (playable.length > 0) {
    // Sort playable by priority: prefer matching curve or high impact
    playable.sort((a, b) => b.cost - a.cost || b.power - a.power);
    const cardToPlay = playable[0];

    // Find best target space on AI's board (ai_pawn, ai_rook, or contested prince/knights)
    const openSpaces = [];

    // 1. Contested frontline (Knight West, Prince Center, Knight East)
    if (!updatedBoard.knight_left?.aiCard) openSpaces.push({ key: 'knight_left', weight: 80 });
    if (!updatedBoard.prince?.aiCard) openSpaces.push({ key: 'prince', weight: 100 });
    if (!updatedBoard.knight_right?.aiCard) openSpaces.push({ key: 'knight_right', weight: 80 });

    // 2. Midline Rooks (support relays)
    if (!updatedBoard.ai_rook_left?.card) openSpaces.push({ key: 'ai_rook_left', weight: 60 });
    if (!updatedBoard.ai_rook_center?.card) openSpaces.push({ key: 'ai_rook_center', weight: 70 });
    if (!updatedBoard.ai_rook_right?.card) openSpaces.push({ key: 'ai_rook_right', weight: 60 });

    // 3. Backline Pawns (base anchors)
    if (!updatedBoard.ai_pawn_left?.card) openSpaces.push({ key: 'ai_pawn_left', weight: 40 });
    if (!updatedBoard.ai_pawn_center?.card) openSpaces.push({ key: 'ai_pawn_center', weight: 50 });
    if (!updatedBoard.ai_pawn_right?.card) openSpaces.push({ key: 'ai_pawn_right', weight: 40 });

    if (openSpaces.length === 0) break;

    // Pick highest weight available space
    openSpaces.sort((a, b) => b.weight - a.weight);
    const chosenSpace = openSpaces[0];

    // Deduct blood & update hand
    currentBlood -= cardToPlay.cost;
    currentHand = currentHand.filter(c => c.id !== cardToPlay.id);
    playedCards.push({ card: cardToPlay, spaceKey: chosenSpace.key });

    // Apply to board
    if (chosenSpace.key === 'prince' || chosenSpace.key === 'knight_left' || chosenSpace.key === 'knight_right') {
      updatedBoard[chosenSpace.key] = {
        ...updatedBoard[chosenSpace.key],
        aiCard: cardToPlay,
        aiPower: cardToPlay.power
      };
    } else {
      updatedBoard[chosenSpace.key] = {
        ...updatedBoard[chosenSpace.key],
        card: cardToPlay,
        power: cardToPlay.power
      };
    }

    logs.push(`L'IA a joué "${cardToPlay.name}" (Coût: ${cardToPlay.cost}, Puissance: ${cardToPlay.power}) sur ${chosenSpace.key}.`);

    // Re-check playable cards
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
