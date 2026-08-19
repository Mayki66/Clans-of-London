import { CARDS_DATA } from '../data/cardsData';

/**
 * Finds the best replacement cards from the user's owned collection
 * for a specific missing card in a given deck.
 *
 * @param {Object} missingCard - The card object that the player is missing
 * @param {Array<string>} ownedCardIds - Array of card IDs owned by the user
 * @param {Array<string>} currentDeckCardIds - Array of card IDs already selected in the deck
 * @param {number} maxSuggestions - Max number of top suggestions to return (default: 3)
 * @returns {Array<Object>} List of top substitute card objects with score and reason
 */
export function getSmartSubstitutes(missingCard, ownedCardIds, currentDeckCardIds = [], maxSuggestions = 3) {
  if (!missingCard || !ownedCardIds || ownedCardIds.length === 0) return [];

  // Filter owned cards that are NOT already in the deck
  const candidateCards = ownedCardIds
    .filter(id => id !== missingCard.id && !currentDeckCardIds.includes(id))
    .map(id => CARDS_DATA.find(c => c.id === id))
    .filter(Boolean);

  const scoredCandidates = candidateCards.map(candidate => {
    let score = 0;
    const reasons = [];

    // 1. Clan match (Highest priority)
    if (candidate.clan === missingCard.clan && candidate.clan !== 'Mortel') {
      score += 100;
      reasons.push(`Même Clan (${candidate.clan})`);
    } else if (candidate.clan === 'Mortel' || missingCard.clan === 'Mortel') {
      score += 20;
    }

    // 2. Archetype match
    if (candidate.archetype === missingCard.archetype && candidate.archetype !== 'Neutre') {
      score += 50;
      reasons.push(`Même Archétype (${candidate.archetype})`);
    }

    // 3. Blood cost proximity
    const costDiff = Math.abs(candidate.cost - missingCard.cost);
    if (costDiff === 0) {
      score += 40;
      reasons.push(`Même Coût (${candidate.cost} Sang)`);
    } else if (costDiff === 1) {
      score += 25;
      reasons.push(`Coût très proche (${candidate.cost} Sang)`);
    } else {
      score -= costDiff * 10;
    }

    // 4. Power proximity
    const powerDiff = Math.abs(candidate.power - missingCard.power);
    score -= powerDiff * 2;

    // 5. Rarity & capability bonus
    if (candidate.rarity === 'Légendaire' || candidate.rarity === 'Épique') {
      score += 10;
    }

    return {
      card: candidate,
      score,
      reason: reasons.join(' • ') || `Coût ${candidate.cost} Sang / Puissance ${candidate.power}`
    };
  });

  // Sort descending by score
  scoredCandidates.sort((a, b) => b.score - a.score);

  return scoredCandidates.slice(0, maxSuggestions);
}

/**
 * Automatically builds a complete 15-card playable deck from a meta deck
 * by filling in any missing cards with the best owned substitutes.
 *
 * @param {Object} metaDeck - Meta deck object with cardIds
 * @param {Array<string>} ownedCardIds - Array of card IDs owned by the user
 * @returns {Object} { completedCardIds: string[], substitutions: Array<{missing: Object, substitute: Object, reason: string}> }
 */
export function buildSubstitutedDeck(metaDeck, ownedCardIds) {
  const completedCardIds = [];
  const substitutions = [];
  const missingCardIds = [];

  // Identify owned vs missing
  metaDeck.cardIds.forEach(id => {
    if (ownedCardIds.includes(id)) {
      completedCardIds.push(id);
    } else {
      missingCardIds.push(id);
    }
  });

  // For each missing card, pick the best available substitute
  missingCardIds.forEach(missingId => {
    const missingCard = CARDS_DATA.find(c => c.id === missingId);
    if (!missingCard) return;

    const substitutes = getSmartSubstitutes(missingCard, ownedCardIds, completedCardIds, 1);
    if (substitutes.length > 0) {
      const best = substitutes[0];
      completedCardIds.push(best.card.id);
      substitutions.push({
        missing: missingCard,
        substitute: best.card,
        reason: best.reason
      });
    }
  });

  return {
    completedCardIds,
    substitutions
  };
}
