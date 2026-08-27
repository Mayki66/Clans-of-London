/**
 * Vampire: The Masquerade – Clans of London
 * Full Combat & Ability Execution Engine for Arena Duels
 */

export const normalizeArchetype = (arch) => {
  if (!arch) return '';
  const a = arch.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  if (a.includes('elit')) return 'elitist';
  if (a.includes('sorc') || a.includes('sang') || a.includes('blood')) return 'sorcerer';
  if (a.includes('acol')) return 'acolyte';
  if (a.includes('bet') || a.includes('beast')) return 'beast';
  if (a.includes('viol')) return 'violent';
  if (a.includes('sedu')) return 'seduced';
  if (a.includes('charm')) return 'charm';
  if (a.includes('dem') || a.includes('delus')) return 'delusion';
  if (a.includes('alch')) return 'alchemy';
  return a;
};

export const matchesCardName = (card, ...names) => {
  if (!card) return false;
  const cName = (card.name || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  const cOrig = (card.originalName || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  return names.some(n => {
    const nl = n.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    return cName === nl || cOrig === nl || cName.includes(nl) || cOrig.includes(nl);
  });
};

export const getConnectedSpaces = (spaceKey) => {
  switch (spaceKey) {
    // Player side
    case 'player_pawn_0': return ['player_pawn_1', 'player_rook_0'];
    case 'player_pawn_1': return ['player_pawn_0', 'player_pawn_2', 'player_rook_1'];
    case 'player_pawn_2': return ['player_pawn_1', 'player_rook_2'];
    case 'player_rook_0': return ['player_pawn_0', 'player_rook_1', 'knight_left', 'prince'];
    case 'player_rook_1': return ['player_pawn_1', 'player_rook_0', 'player_rook_2', 'prince'];
    case 'player_rook_2': return ['player_pawn_2', 'player_rook_1', 'knight_right', 'prince'];
    // Conflict row
    case 'knight_left': return ['player_rook_0', 'ai_rook_0', 'prince'];
    case 'prince': return ['player_rook_0', 'player_rook_1', 'player_rook_2', 'ai_rook_0', 'ai_rook_1', 'ai_rook_2', 'knight_left', 'knight_right'];
    case 'knight_right': return ['player_rook_2', 'ai_rook_2', 'prince'];
    // AI side
    case 'ai_rook_0': return ['ai_pawn_0', 'ai_rook_1', 'knight_left', 'prince'];
    case 'ai_rook_1': return ['ai_pawn_1', 'ai_rook_0', 'ai_rook_2', 'prince'];
    case 'ai_rook_2': return ['ai_pawn_2', 'ai_rook_1', 'knight_right', 'prince'];
    case 'ai_pawn_0': return ['ai_pawn_1', 'ai_rook_0'];
    case 'ai_pawn_1': return ['ai_pawn_0', 'ai_pawn_2', 'ai_rook_1'];
    case 'ai_pawn_2': return ['ai_pawn_1', 'ai_rook_2'];
    default: return [];
  }
};

/**
 * Computes all dynamic passive / "While in Play" powers across the 15-space board.
 */
export const computeBoardPowers = (currentBoard) => {
  let updated = { ...currentBoard };

  // 1. Reset base powers
  Object.keys(updated).forEach(k => {
    const space = updated[k];
    if (k === 'prince' || k.startsWith('knight')) {
      if (space.playerCard) {
        updated[k] = { ...space, playerPower: (space.playerCard.power || 0) + (space.playerExtraPower || 0) };
      }
      if (space.aiCard) {
        updated[k] = { ...space, aiPower: (space.aiCard.power || 0) + (space.aiExtraPower || 0) };
      }
    } else {
      if (space.card) {
        updated[k] = { ...space, power: (space.card.power || 0) + (space.extraPower || 0) };
      }
    }
  });

  // 2. Count Allies by Clan / Archetype
  const playerSpaces = ['player_pawn_0', 'player_pawn_1', 'player_pawn_2', 'player_rook_0', 'player_rook_1', 'player_rook_2'];
  const aiSpaces = ['ai_pawn_0', 'ai_pawn_1', 'ai_pawn_2', 'ai_rook_0', 'ai_rook_1', 'ai_rook_2'];

  let playerSorcerers = 0;
  let playerToreador = 0;
  let aiSorcerers = 0;
  let aiToreador = 0;

  playerSpaces.forEach(k => {
    const c = updated[k]?.card;
    if (!c) return;
    if (normalizeArchetype(c.archetype) === 'sorcerer') playerSorcerers++;
    if (c.clan === 'Toreador') playerToreador++;
  });
  if (updated.prince.playerCard) {
    if (normalizeArchetype(updated.prince.playerCard.archetype) === 'sorcerer') playerSorcerers++;
    if (updated.prince.playerCard.clan === 'Toreador') playerToreador++;
  }

  aiSpaces.forEach(k => {
    const c = updated[k]?.card;
    if (!c) return;
    if (normalizeArchetype(c.archetype) === 'sorcerer') aiSorcerers++;
    if (c.clan === 'Toreador') aiToreador++;
  });
  if (updated.prince.aiCard) {
    if (normalizeArchetype(updated.prince.aiCard.archetype) === 'sorcerer') aiSorcerers++;
    if (updated.prince.aiCard.clan === 'Toreador') aiToreador++;
  }

  let playerPrinceBonus = 0;
  let aiPrinceBonus = 0;

  // 3. Player Side Passive Powers
  playerSpaces.forEach(k => {
    const space = updated[k];
    const c = space?.card;
    if (!c) return;

    if (matchesCardName(c, 'Cynthia Hargreaves', 'Cynthia')) playerPrinceBonus += 1;
    if (matchesCardName(c, 'Mr Moore', 'Moore')) playerPrinceBonus += 2;
    if (matchesCardName(c, 'Ethan')) playerPrinceBonus += 2;
    if (matchesCardName(c, 'Jurgen Mayer', 'Jürgen Mayer') && normalizeArchetype(updated.prince.playerCard?.archetype) === 'elitist') {
      playerPrinceBonus += 2;
    }

    // Aster Banda / Carlo Galli: +2 to connected cards
    if (matchesCardName(c, 'Aster Banda', 'Carlo Galli')) {
      const conn = getConnectedSpaces(k);
      conn.forEach(ck => {
        if (playerSpaces.includes(ck) && updated[ck]?.card) {
          updated[ck] = { ...updated[ck], power: updated[ck].power + 2 };
        }
      });
    }

    // Lili Valentine: +1 to connected Mortal / Ghoul
    if (matchesCardName(c, 'Lili Valentine')) {
      const conn = getConnectedSpaces(k);
      conn.forEach(ck => {
        if (playerSpaces.includes(ck) && updated[ck]?.card && (updated[ck].card.type === 'Mortel' || updated[ck].card.type === 'Goule' || updated[ck].card.type === 'Mortal' || updated[ck].card.type === 'Ghoul')) {
          updated[ck] = { ...updated[ck], power: updated[ck].power + 1 };
        }
      });
    }

    // Benedict / Ivory Lux: Row bonuses
    if (matchesCardName(c, 'Benedict', 'Ivory Lux')) {
      const bonus = matchesCardName(c, 'Benedict') ? 2 : 1;
      const row = k.startsWith('player_pawn') ? ['player_pawn_0', 'player_pawn_1', 'player_pawn_2'] : ['player_rook_0', 'player_rook_1', 'player_rook_2'];
      row.forEach(rk => {
        if (rk !== k && updated[rk]?.card) {
          updated[rk] = { ...updated[rk], power: updated[rk].power + bonus };
        }
      });
    }

    // Zara's Troupe: +1 to units with cost <= 2
    if (matchesCardName(c, "Zara's Troupe", 'Zara')) {
      playerSpaces.forEach(pk => {
        if (pk !== k && updated[pk]?.card && (typeof updated[pk].card.cost === 'number' && updated[pk].card.cost <= 2)) {
          updated[pk] = { ...updated[pk], power: updated[pk].power + 1 };
        }
      });
    }

    // Lord Tremere: +3 Power if >= 2 Sorcerers
    if (matchesCardName(c, 'Lord Tremere') && playerSorcerers >= 2) {
      updated[k] = { ...updated[k], power: updated[k].power + 3 };
    }

    // Damon: +1 per Toreador
    if (matchesCardName(c, 'Damon')) {
      updated[k] = { ...updated[k], power: updated[k].power + playerToreador };
    }

    // The Baron: +2 Power if controlling a Knight space
    if (matchesCardName(c, 'The Baron', 'Le Baron') && (updated.knight_left.playerCard || updated.knight_right.playerCard)) {
      updated[k] = { ...updated[k], power: updated[k].power + 2 };
    }
  });

  // 4. Knight Space Passives
  ['knight_left', 'knight_right'].forEach(kk => {
    const pc = updated[kk]?.playerCard;
    if (pc) {
      if (matchesCardName(pc, 'Harry Tyler')) playerPrinceBonus += 2;
      if (matchesCardName(pc, 'Sheriff')) updated[kk] = { ...updated[kk], playerPower: updated[kk].playerPower + 2 };
    }
    const ac = updated[kk]?.aiCard;
    if (ac) {
      if (matchesCardName(ac, 'Harry Tyler')) aiPrinceBonus += 2;
      if (matchesCardName(ac, 'Sheriff')) updated[kk] = { ...updated[kk], aiPower: updated[kk].aiPower + 2 };
    }
  });

  // 5. Abigail Smith (Pawn -> Rook directly in front)
  [0, 1, 2].forEach(col => {
    const pawnCard = updated[`player_pawn_${col}`]?.card;
    const rookSpace = updated[`player_rook_${col}`];
    if (matchesCardName(pawnCard, 'Abigail Smith') && normalizeArchetype(rookSpace?.card?.archetype) === 'elitist') {
      updated[`player_rook_${col}`] = {
        ...rookSpace,
        power: rookSpace.power + 2
      };
    }
    const aiPawnCard = updated[`ai_pawn_${col}`]?.card;
    const aiRookSpace = updated[`ai_rook_${col}`];
    if (matchesCardName(aiPawnCard, 'Abigail Smith') && normalizeArchetype(aiRookSpace?.card?.archetype) === 'elitist') {
      updated[`ai_rook_${col}`] = {
        ...aiRookSpace,
        power: aiRookSpace.power + 2
      };
    }
  });

  // 6. AI Side Passive Powers (Mirroring)
  aiSpaces.forEach(k => {
    const space = updated[k];
    const c = space?.card;
    if (!c) return;

    if (matchesCardName(c, 'Cynthia Hargreaves', 'Cynthia')) aiPrinceBonus += 1;
    if (matchesCardName(c, 'Mr Moore', 'Moore')) aiPrinceBonus += 2;
    if (matchesCardName(c, 'Ethan')) aiPrinceBonus += 2;
    if (matchesCardName(c, 'Jurgen Mayer', 'Jürgen Mayer') && normalizeArchetype(updated.prince.aiCard?.archetype) === 'elitist') {
      aiPrinceBonus += 2;
    }
    if (matchesCardName(c, 'Aster Banda', 'Carlo Galli')) {
      const conn = getConnectedSpaces(k);
      conn.forEach(ck => {
        if (aiSpaces.includes(ck) && updated[ck]?.card) {
          updated[ck] = { ...updated[ck], power: updated[ck].power + 2 };
        }
      });
    }
    if (matchesCardName(c, 'Benedict', 'Ivory Lux')) {
      const bonus = matchesCardName(c, 'Benedict') ? 2 : 1;
      const row = k.startsWith('ai_pawn') ? ['ai_pawn_0', 'ai_pawn_1', 'ai_pawn_2'] : ['ai_rook_0', 'ai_rook_1', 'ai_rook_2'];
      row.forEach(rk => {
        if (rk !== k && updated[rk]?.card) {
          updated[rk] = { ...updated[rk], power: updated[rk].power + bonus };
        }
      });
    }
    if (matchesCardName(c, 'Lord Tremere') && aiSorcerers >= 2) {
      updated[k] = { ...updated[k], power: updated[k].power + 3 };
    }
    if (matchesCardName(c, 'Damon')) {
      updated[k] = { ...updated[k], power: updated[k].power + aiToreador };
    }
  });

  // 7. Apply Prince Final Power
  if (updated.prince.playerCard) {
    updated.prince = {
      ...updated.prince,
      playerPower: updated.prince.playerPower + playerPrinceBonus
    };
  }
  if (updated.prince.aiCard) {
    updated.prince = {
      ...updated.prince,
      aiPower: updated.prince.aiPower + aiPrinceBonus
    };
  }

  return updated;
};

/**
 * Triggers "On Reveal" abilities for cards played this turn.
 */
export const triggerOnRevealAbilities = (revealedCards, currentBoard) => {
  let updatedBoard = { ...currentBoard };
  const logs = [];

  const pawnsCount = ['player_pawn_0', 'player_pawn_1', 'player_pawn_2', 'ai_pawn_0', 'ai_pawn_1', 'ai_pawn_2']
    .filter(k => updatedBoard[k]?.card).length;

  revealedCards.forEach(({ card, spaceKey, owner }) => {
    if (!card) return;

    if (matchesCardName(card, 'Sapphire')) {
      const bonus = Math.max(1, pawnsCount);
      if (spaceKey === 'prince' || spaceKey.startsWith('knight')) {
        if (owner === 'player') updatedBoard[spaceKey].playerExtraPower = (updatedBoard[spaceKey].playerExtraPower || 0) + bonus;
        else updatedBoard[spaceKey].aiExtraPower = (updatedBoard[spaceKey].aiExtraPower || 0) + bonus;
      } else {
        updatedBoard[spaceKey].extraPower = (updatedBoard[spaceKey].extraPower || 0) + bonus;
      }
      logs.push(`✨ [${card.name}] Révélation : Gagne +${bonus} Puissance (${pawnsCount} Pions en jeu).`);
    }

    if (matchesCardName(card, 'Lavanya Sekh') && spaceKey.includes('rook')) {
      updatedBoard[spaceKey].extraPower = (updatedBoard[spaceKey].extraPower || 0) + 2;
      logs.push(`✨ [${card.name}] Révélation : Position Tour validée (+2 Puissance).`);
    }

    if (matchesCardName(card, 'Razor') && (spaceKey === 'prince' || spaceKey.startsWith('knight'))) {
      if (owner === 'player') updatedBoard[spaceKey].playerExtraPower = (updatedBoard[spaceKey].playerExtraPower || 0) + 4;
      else updatedBoard[spaceKey].aiExtraPower = (updatedBoard[spaceKey].aiExtraPower || 0) + 4;
      logs.push(`✨ [${card.name}] Révélation : Infiltration en ligne de front (+4 Puissance).`);
    }

    if (matchesCardName(card, 'Ember')) {
      const knightSpaces = ['knight_left', 'knight_right'];
      for (const ks of knightSpaces) {
        const hasUnit = owner === 'player' ? updatedBoard[ks].playerCard : updatedBoard[ks].aiCard;
        if (!hasUnit) {
          const ghoulCard = {
            id: `ghoul-${Date.now()}`,
            name: 'Goule Servante',
            clan: card.clan,
            power: 1,
            cost: 0,
            type: 'Goule',
            archetype: 'Acolyte',
            imageUrl: '/cards/col-090.jpg'
          };
          if (owner === 'player') {
            updatedBoard[ks].playerCard = ghoulCard;
            updatedBoard[ks].playerPower = 1;
          } else {
            updatedBoard[ks].aiCard = ghoulCard;
            updatedBoard[ks].aiPower = 1;
          }
          logs.push(`🧟 [${card.name}] Révélation : Invoque une Goule sur ${updatedBoard[ks].name} !`);
          break;
        }
      }
    }
  });

  const finalBoard = computeBoardPowers(updatedBoard);
  return { updatedBoard: finalBoard, logs };
};

/**
 * Calculates Conflict combat modifiers (On Attack / While Attacking)
 */
export const resolveConflictModifiers = (playerCard, aiCard, spaceKey) => {
  let playerBonus = 0;
  let aiBonus = 0;
  const combatNotes = [];

  if (playerCard) {
    if (matchesCardName(playerCard, 'Bakunawa')) {
      aiBonus -= 4;
      combatNotes.push(`💥 [${playerCard.name}] Attaque : Inflige -4 Puissance à l'ennemi.`);
    }
    if (matchesCardName(playerCard, 'Brittany Webb')) {
      aiBonus -= 5;
      playerBonus += 5;
      combatNotes.push(`🩸 [${playerCard.name}] Attaque : Vole 5 Puissance à l'ennemi !`);
    }
    if (matchesCardName(playerCard, 'Dante')) {
      playerBonus += 3;
      combatNotes.push(`⚔️ [${playerCard.name}] En Attaque : +3 Puissance offensive.`);
    }
    if (matchesCardName(playerCard, 'Nick Locke')) {
      playerBonus += 4;
      combatNotes.push(`🎯 [${playerCard.name}] Attaque surprise : +4 Puissance.`);
    }
    if (normalizeArchetype(playerCard.archetype) === 'violent') {
      playerBonus += 2;
    }
  }

  if (aiCard) {
    if (matchesCardName(aiCard, 'Bakunawa')) {
      playerBonus -= 4;
      combatNotes.push(`💥 [${aiCard.name} IA] Attaque : Inflige -4 Puissance à votre carte.`);
    }
    if (matchesCardName(aiCard, 'Brittany Webb')) {
      playerBonus -= 5;
      aiBonus += 5;
      combatNotes.push(`🩸 [${aiCard.name} IA] Attaque : Vole 5 Puissance à votre carte !`);
    }
    if (matchesCardName(aiCard, 'Dante')) {
      aiBonus += 3;
      combatNotes.push(`⚔️ [${aiCard.name} IA] En Attaque : +3 Puissance offensive.`);
    }
    if (matchesCardName(aiCard, 'Nick Locke')) {
      aiBonus += 4;
      combatNotes.push(`🎯 [${aiCard.name} IA] Attaque surprise : +4 Puissance.`);
    }
    if (normalizeArchetype(aiCard.archetype) === 'violent') {
      aiBonus += 2;
    }
  }

  return { playerBonus, aiBonus, combatNotes };
};
