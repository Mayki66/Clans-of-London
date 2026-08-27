import React from 'react';
import { Shield, Plus, Minus } from 'lucide-react';
import { CLANS } from '../../data/clansData';
import { getCardAbility } from '../../data/cardsData';

export default function TableView({ cards, onInspectCard, onAddCard, onRemoveCard, deckCards = [], lang = 'fr', t }) {
  const isFrench = lang === 'fr';

  const getRarityBadge = (rarity) => {
    switch (rarity) {
      case 'Légendaire':
      case 'Legendary':
        return 'text-amber-400 bg-amber-950/60 border-amber-500/40';
      case 'Épique':
      case 'Epic':
        return 'text-purple-300 bg-purple-950/60 border-purple-500/40';
      case 'Rare':
        return 'text-blue-300 bg-blue-950/60 border-blue-500/40';
      default:
        return 'text-gray-400 bg-gray-900 border-gray-700';
    }
  };

  const getHeader = (key, fallback) => {
    return t?.cardAttributes?.tableHeaders?.[key] || fallback;
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-200">
          <thead className="bg-[#0b0e15] border-b border-white/10 font-gothic text-gray-400 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="px-3.5 py-3 text-center w-14">{getHeader('blood', 'Sang')}</th>
              <th className="px-4 py-3">{getHeader('name', 'Nom')}</th>
              <th className="px-3 py-3">{getHeader('clan', 'Clan')}</th>
              <th className="px-3 py-3 text-center">{getHeader('power', 'Puiss.')}</th>
              <th className="px-3 py-3 text-center">{getHeader('series', 'Série')}</th>
              <th className="px-3 py-3">{getHeader('type', 'Type')}</th>
              <th className="px-3 py-3">{getHeader('archetype', 'Archétype')}</th>
              <th className="px-4 py-3 min-w-[280px]">{getHeader('ability', 'Capacité')}</th>
              <th className="px-4 py-3 text-center w-28">{getHeader('deck', 'Deck')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-sans">
            {cards.map((card) => {
              const clanInfo = CLANS[card.clan] || CLANS.Mortal;
              const count = deckCards.filter(c => c.id === card.id).length;
              const displayedAbility = getCardAbility(card, lang);
              const displayedType = t?.cardAttributes?.types?.[card.type] || card.type;
              const displayedArchetype = t?.cardAttributes?.archetypes?.[card.archetype] || t?.cardAttributes?.archetypes?.[card.archetype_en] || card.archetype;
              const displayedClan = (card.clan === 'Malkavien' && !isFrench) ? 'Malkavian' : card.clan;
              const displayedRarity = t?.cardAttributes?.rarities?.[card.rarity] || card.rarity;

              return (
                <tr 
                  key={card.id}
                  onClick={() => onInspectCard?.(card)}
                  className="hover:bg-[#151926] cursor-pointer transition-colors group"
                >
                  {/* Blood Cost */}
                  <td className="px-3.5 py-3 text-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-900/80 border border-red-500/50 font-bold font-mono text-white text-xs shadow-blood">
                      {card.costDisplay || card.cost}
                    </span>
                  </td>

                  {/* Name & Rarity */}
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-gothic font-semibold text-sm text-gray-100 group-hover:text-amber-400 transition-colors">
                        {card.name}
                      </span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${getRarityBadge(card.rarity)}`}>
                        {displayedRarity ? displayedRarity[0] : card.rarity[0]}
                      </span>
                    </div>
                  </td>

                  {/* Clan */}
                  <td className="px-3 py-3">
                    <span 
                      className="font-medium text-xs font-gothic"
                      style={{ color: clanInfo.themeColor }}
                    >
                      {displayedClan}
                    </span>
                  </td>

                  {/* Power */}
                  <td className="px-3 py-3 text-center font-bold font-mono text-amber-400">
                    <span className="inline-flex items-center space-x-0.5 justify-center">
                      <Shield className="w-3 h-3 text-amber-500" />
                      <span>{card.power}</span>
                    </span>
                  </td>

                  {/* Series */}
                  <td className="px-3 py-3 text-center font-mono text-gray-400 font-semibold">
                    S{card.series}
                  </td>

                  {/* Type */}
                  <td className="px-3 py-3 text-gray-400 capitalize">
                    {displayedType}
                  </td>

                  {/* Archetype */}
                  <td className="px-3 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 border border-white/10 text-gray-300">
                      {displayedArchetype}
                    </span>
                  </td>

                  {/* Ability */}
                  <td className="px-4 py-3 text-gray-300 text-xs leading-relaxed line-clamp-2">
                    {displayedAbility}
                  </td>

                  {/* Deck Actions */}
                  <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center space-x-1.5">
                      {count > 0 && (
                        <button
                          onClick={() => onRemoveCard?.(card.id)}
                          className="p-1 rounded bg-red-950/80 hover:bg-red-800 border border-red-500/40 text-red-300 hover:text-white"
                          title={isFrench ? "Retirer du deck" : "Remove from deck"}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                      )}
                      {count > 0 && (
                        <span className="w-4 font-mono font-bold text-amber-400 text-xs">
                          {count}
                        </span>
                      )}
                      <button
                        onClick={() => onAddCard?.(card)}
                        disabled={count >= 1}
                        className={`p-1 rounded border transition-colors ${
                          count >= 1
                            ? 'bg-gray-800/40 border-gray-700/40 text-gray-600 cursor-not-allowed'
                            : 'bg-emerald-950/80 hover:bg-emerald-800 border-emerald-500/40 text-emerald-300 hover:text-white'
                        }`}
                        title={count >= 1 ? (isFrench ? "Limite de 1 copie" : "1 copy limit") : (isFrench ? "Ajouter au deck" : "Add to deck")}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
