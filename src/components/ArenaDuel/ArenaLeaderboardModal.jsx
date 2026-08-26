import React, { useState, useEffect } from 'react';
import { Trophy, Crown, Medal, X, RefreshCw, Sparkles, Swords, Shield, User } from 'lucide-react';
import { fetchCloudLeaderboard } from '../../utils/cloudDatabase';

export default function ArenaLeaderboardModal({ onClose, currentUserPseudo, lang = 'fr' }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const data = await fetchCloudLeaderboard();
      setLeaderboard(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const getRankBadge = (rank) => {
    if (rank === 1) {
      return (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 border border-amber-300 flex items-center justify-center shadow-gold">
          <Crown className="w-4 h-4 text-black" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-300 to-slate-500 border border-slate-200 flex items-center justify-center shadow-md">
          <Medal className="w-4 h-4 text-black" />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-700 to-amber-900 border border-amber-500/60 flex items-center justify-center shadow-md">
          <Medal className="w-4 h-4 text-amber-200" />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-xl bg-[#141824] border border-white/10 flex items-center justify-center font-mono font-bold text-xs text-gray-400">
        #{rank}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative z-10 w-full max-w-3xl max-h-[90vh] rounded-3xl bg-[#0b0e15] border-2 border-amber-500/40 shadow-[0_0_50px_rgba(0,0,0,0.9)] text-gray-200 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-amber-950/40 via-red-950/30 to-[#0b0e15]">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-700 border border-amber-300 flex items-center justify-center shadow-gold">
              <Trophy className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="font-gothic font-extrabold text-xl sm:text-2xl text-gray-100 flex items-center space-x-2">
                <span>{lang === 'fr' ? 'Classement des Kindreds' : 'Kindreds Leaderboard'}</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Londres
                </span>
              </h2>
              <p className="text-xs text-gray-400 font-sans mt-0.5">
                {lang === 'fr' 
                  ? 'Les meilleurs vampires de la cité classés par Points d\'Arène et prestige.' 
                  : 'Top London vampires ranked by Arena Points and prestige.'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={loadLeaderboard}
              disabled={loading}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition-colors disabled:opacity-50"
              title="Rafraîchir le classement"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-red-950/60 border border-white/10 hover:border-red-500 text-gray-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Podium Top 3 (if available) */}
        {leaderboard.length >= 3 && (
          <div className="grid grid-cols-3 gap-3 p-4 sm:p-6 bg-[#080a0f] border-b border-white/5">
            {/* 2nd place */}
            <div className="flex flex-col items-center p-3 rounded-2xl bg-gradient-to-b from-slate-900/60 to-black border border-slate-700/60 text-center">
              <span className="text-xl mb-1">🥈</span>
              <span className="font-gothic font-bold text-xs text-slate-200 truncate max-w-full">{leaderboard[1]?.pseudo}</span>
              <span className="text-[10px] font-mono text-amber-400 font-bold">{leaderboard[1]?.arenaPoints} Pts</span>
              <span className="text-[9px] font-mono text-gray-500 mt-1">{leaderboard[1]?.vampireRank}</span>
            </div>

            {/* 1st place */}
            <div className="flex flex-col items-center p-3 rounded-2xl bg-gradient-to-b from-amber-950/60 via-yellow-950/30 to-black border-2 border-amber-500/60 text-center shadow-gold -mt-2">
              <span className="text-2xl mb-1">👑</span>
              <span className="font-gothic font-extrabold text-sm text-amber-200 truncate max-w-full">{leaderboard[0]?.pseudo}</span>
              <span className="text-xs font-mono text-amber-300 font-bold">{leaderboard[0]?.arenaPoints} Pts</span>
              <span className="text-[10px] font-mono text-amber-400/90 mt-1">{leaderboard[0]?.vampireRank}</span>
            </div>

            {/* 3rd place */}
            <div className="flex flex-col items-center p-3 rounded-2xl bg-gradient-to-b from-amber-950/40 to-black border border-amber-800/40 text-center">
              <span className="text-xl mb-1">🥉</span>
              <span className="font-gothic font-bold text-xs text-amber-300 truncate max-w-full">{leaderboard[2]?.pseudo}</span>
              <span className="text-[10px] font-mono text-amber-400 font-bold">{leaderboard[2]?.arenaPoints} Pts</span>
              <span className="text-[9px] font-mono text-gray-500 mt-1">{leaderboard[2]?.vampireRank}</span>
            </div>
          </div>
        )}

        {/* Full List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2">
          {loading && (
            <div className="py-12 text-center text-xs font-mono text-gray-400">
              <span className="animate-pulse">
                {lang === 'fr' ? 'Chargement du classement de Londres...' : 'Loading London Leaderboard...'}
              </span>
            </div>
          )}

          {!loading && leaderboard.map((player) => {
            const isCurrentUser = currentUserPseudo && player.pseudo.toLowerCase() === currentUserPseudo.toLowerCase();

            return (
              <div
                key={player.id || player.rank}
                className={`p-3 sm:p-4 rounded-2xl flex items-center justify-between transition-all ${
                  isCurrentUser
                    ? 'bg-amber-950/40 border-2 border-amber-400 ring-2 ring-amber-400/30 shadow-gold'
                    : 'bg-[#121520] hover:bg-[#181c2b] border border-white/5'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  {getRankBadge(player.rank)}

                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-gothic font-bold text-sm text-gray-100 truncate">
                        {player.pseudo}
                      </span>
                      {isCurrentUser && (
                        <span className="px-2 py-0.2 rounded-full text-[9px] font-mono font-bold bg-amber-500 text-black">
                          {lang === 'fr' ? 'VOUS' : 'YOU'}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 font-mono block">
                      {player.vampireRank} • {lang === 'fr' ? `Niveau Collection ${player.level}` : `Collection Lvl ${player.level}`}
                    </span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 pl-2">
                  <div className="font-mono font-extrabold text-sm sm:text-base text-amber-400">
                    {player.arenaPoints} <span className="text-xs text-gray-400 font-normal">Pts</span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-500 block">
                    {player.lastActive}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#080a0f] flex items-center justify-between text-xs font-mono text-gray-400">
          <div className="flex items-center space-x-2">
            <Swords className="w-4 h-4 text-red-400" />
            <span>{lang === 'fr' ? 'Victoire : +35 Pts • Défaite : -15 Pts' : 'Win: +35 Pts • Loss: -15 Pts'}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-gothic font-bold text-xs transition-colors"
          >
            {lang === 'fr' ? 'Fermer' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
}
