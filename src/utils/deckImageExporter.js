/**
 * Deck Visual Image Generator (HTML5 Canvas 2D)
 * Vampire: The Masquerade – Clans of London
 * Generates an HD (1200x820) deck sheet ready for Discord, Reddit, or Twitter.
 */
import { CLANS } from '../data/clansData';

export async function generateDeckImageBlob({
  deckName = "Mon Deck Londonien",
  author = "Kindred",
  deckCards = [],
  lang = 'fr'
}) {
  const width = 1200;
  const height = 850;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error("Unable to create 2D Canvas context");
  }

  // 1. Background Gradient (Dark London Gothic)
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#0a0c12');
  bgGrad.addColorStop(0.5, '#121622');
  bgGrad.addColorStop(1, '#07080c');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Decorative border
  ctx.strokeStyle = '#dc262640'; // Blood red subtle
  ctx.lineWidth = 4;
  ctx.strokeRect(12, 12, width - 24, height - 24);

  ctx.strokeStyle = '#f59e0b50'; // Gold thin accent
  ctx.lineWidth = 1.5;
  ctx.strokeRect(18, 18, width - 36, height - 36);

  // 2. Determine Primary Clan
  const clanCounts = {};
  deckCards.forEach(c => {
    if (c.clan) clanCounts[c.clan] = (clanCounts[c.clan] || 0) + 1;
  });
  const mainClan = Object.keys(clanCounts).sort((a, b) => clanCounts[b] - clanCounts[a])[0] || 'Brujah';
  const clanInfo = CLANS[mainClan] || CLANS.Brujah;

  // 3. Header Section
  // App Title / Brand
  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 12px "Courier New", monospace';
  ctx.fillText('VAMPIRE: THE MASQUERADE — CLANS OF LONDON', 36, 48);

  // Deck Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px Georgia, serif';
  ctx.fillText(deckName.slice(0, 32), 36, 84);

  // Deck Author & Clan Badge
  ctx.fillStyle = clanInfo.themeColor || '#f59e0b';
  ctx.font = 'bold 14px Georgia, serif';
  ctx.fillText(`CLAN ${mainClan.toUpperCase()} • CRÉÉ PAR ${author.toUpperCase()}`, 36, 108);

  // Stats Metrics on Top Right
  const totalPower = deckCards.reduce((sum, c) => sum + (c.power || 0), 0);
  const avgCost = deckCards.length > 0 
    ? (deckCards.reduce((sum, c) => sum + (typeof c.cost === 'number' ? c.cost : 2), 0) / deckCards.length).toFixed(1) 
    : '0.0';

  const metricsX = width - 420;
  // Box for metrics
  ctx.fillStyle = '#0e111a';
  ctx.strokeStyle = '#ffffff20';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(metricsX, 36, 384, 76, 12);
  ctx.fill();
  ctx.stroke();

  // Draw 3 Metric Columns
  // 1: Total Cards
  ctx.fillStyle = '#9ca3af';
  ctx.font = '10px "Courier New", monospace';
  ctx.fillText('COMPOSITION', metricsX + 16, 58);
  ctx.fillStyle = deckCards.length === 15 ? '#34d399' : '#fbbf24';
  ctx.font = 'bold 18px "Courier New", monospace';
  ctx.fillText(`${deckCards.length} / 15`, metricsX + 16, 84);
  ctx.font = '10px sans-serif';
  ctx.fillStyle = '#6b7280';
  ctx.fillText(deckCards.length === 15 ? 'Deck Complet' : 'Incomplet', metricsX + 16, 100);

  // 2: Total Power
  ctx.fillStyle = '#9ca3af';
  ctx.font = '10px "Courier New", monospace';
  ctx.fillText('PUISSANCE', metricsX + 140, 58);
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 18px "Courier New", monospace';
  ctx.fillText(`${totalPower} Pts`, metricsX + 140, 84);
  ctx.font = '10px sans-serif';
  ctx.fillStyle = '#6b7280';
  ctx.fillText('Force Totale', metricsX + 140, 100);

  // 3: Avg Cost
  ctx.fillStyle = '#9ca3af';
  ctx.font = '10px "Courier New", monospace';
  ctx.fillText('COÛT MOYEN', metricsX + 264, 58);
  ctx.fillStyle = '#f87171';
  ctx.font = 'bold 18px "Courier New", monospace';
  ctx.fillText(`${avgCost} Sang`, metricsX + 264, 84);
  ctx.font = '10px sans-serif';
  ctx.fillStyle = '#6b7280';
  ctx.fillText('Par Tour', metricsX + 264, 100);

  // 4. Grid of 15 Cards (3 rows of 5 columns)
  const gridStartX = 36;
  const gridStartY = 135;
  const colWidth = 216;
  const rowHeight = 210;
  const gapX = 12;
  const gapY = 12;

  for (let i = 0; i < 15; i++) {
    const card = deckCards[i];
    const col = i % 5;
    const row = Math.floor(i / 5);
    const x = gridStartX + col * (colWidth + gapX);
    const y = gridStartY + row * (rowHeight + gapY);

    // Card Cell Background
    ctx.fillStyle = card ? '#10131d' : '#080a0f';
    ctx.strokeStyle = card ? '#ffffff18' : '#ffffff08';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x, y, colWidth, rowHeight, 10);
    ctx.fill();
    ctx.stroke();

    if (!card) {
      // Empty slot
      ctx.fillStyle = '#4b5563';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Emplacement ${i + 1}`, x + colWidth / 2, y + rowHeight / 2);
      ctx.textAlign = 'left';
      continue;
    }

    const cClanInfo = CLANS[card.clan] || CLANS.Brujah;

    // Card Clan Header Stripe
    ctx.fillStyle = cClanInfo.themeColor ? `${cClanInfo.themeColor}33` : '#ef444433';
    ctx.beginPath();
    ctx.roundRect(x, y, colWidth, 26, [10, 10, 0, 0]);
    ctx.fill();

    // Cost Badge (Red Circle)
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(x + 16, y + 13, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f87171';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${card.costDisplay || card.cost}`, x + 16, y + 17);

    // Clan Name
    ctx.textAlign = 'left';
    ctx.fillStyle = cClanInfo.themeColor || '#f59e0b';
    ctx.font = 'bold 10px Georgia, serif';
    ctx.fillText(`${card.clan}`, x + 32, y + 17);

    // Power Badge (Gold Rounded Box)
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.roundRect(x + colWidth - 36, y + 4, 30, 18, 5);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`P${card.power}`, x + colWidth - 21, y + 17);
    ctx.textAlign = 'left';

    // Card Name
    ctx.fillStyle = '#f3f4f6';
    ctx.font = 'bold 13px Georgia, serif';
    const cleanName = card.name.length > 22 ? card.name.slice(0, 20) + '...' : card.name;
    ctx.fillText(cleanName, x + 10, y + 48);

    // Archetype & Series
    ctx.fillStyle = '#9ca3af';
    ctx.font = '10px "Courier New", monospace';
    ctx.fillText(`${card.archetype || 'Général'} • S${card.series || 0}`, x + 10, y + 66);

    // Ability Divider Line
    ctx.strokeStyle = '#ffffff10';
    ctx.beginPath();
    ctx.moveTo(x + 10, y + 74);
    ctx.lineTo(x + colWidth - 10, y + 74);
    ctx.stroke();

    // Ability Text (Wrapped)
    ctx.fillStyle = '#d1d5db';
    ctx.font = '10px sans-serif';
    const ability = (lang === 'en' && card.ability_en) ? card.ability_en : (card.ability || '');
    wrapText(ctx, ability, x + 10, y + 90, colWidth - 20, 14, 6);

    // Keywords Tags at bottom
    if (card.keywords && card.keywords.length > 0) {
      ctx.fillStyle = '#fbbf24';
      ctx.font = '9px "Courier New", monospace';
      const kw = card.keywords.map(k => `#${k}`).join(' ');
      ctx.fillText(kw.slice(0, 30), x + 10, y + rowHeight - 10);
    }
  }

  // 5. Footer Branding
  ctx.fillStyle = '#6b7280';
  ctx.font = '11px "Courier New", monospace';
  ctx.fillText('🔗 clans-of-london.vercel.app • Vampire: The Masquerade (Clans of London)', 36, height - 24);

  ctx.fillStyle = '#ef4444';
  ctx.textAlign = 'right';
  ctx.fillText('Deck Builder & Combat Simulator', width - 36, height - 24);
  ctx.textAlign = 'left';

  // Return as Blob
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/png');
  });
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 6) {
  const words = text.split(' ');
  let line = '';
  let linesDrawn = 0;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
      linesDrawn++;
      if (linesDrawn >= maxLines - 1 && n < words.length - 1) {
        ctx.fillText(line.trim() + '...', x, y);
        return;
      }
    } else {
      line = testLine;
    }
  }
  if (linesDrawn < maxLines) {
    ctx.fillText(line, x, y);
  }
}
