import React from 'react';
import { Layers, BookOpen, Trophy, Shield, Droplets, User } from 'lucide-react';

export default function Navbar({ activeView, setActiveView, deckCardsCount = 0, ownedCount = 0, totalCount = 70 }) {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveView('deckbuilder')}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            {/* Blood Drop & Crest Icon */}
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 via-red-800 to-rose-950 border-2 border-amber-500/60 flex items-center justify-center shadow-blood group-hover:shadow-blood-lg transition-all">
              <Droplets className="w-5 h-5 text-white" />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 border border-black flex items-center justify-center">
                <span className="text-[8px] font-bold text-black">V</span>
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-gothic font-extrabold text-lg tracking-wider text-gray-100 group-hover:text-amber-400 transition-colors">
                  CLANS OF LONDON
                </span>
              </div>
              <p className="text-[10px] font-mono tracking-widest text-red-400 uppercase -mt-0.5">
                Vampire: The Masquerade
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            
            {/* Deck Builder Tab */}
            <button
              onClick={() => setActiveView('deckbuilder')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-gothic font-bold transition-all ${
                activeView === 'deckbuilder'
                  ? 'bg-gradient-to-r from-red-800 to-rose-900 text-white border border-red-500/60 shadow-blood'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">Deck Builder</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                deckCardsCount === 15 
                  ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50' 
                  : 'bg-black/40 text-amber-300'
              }`}>
                {deckCardsCount}/15
              </span>
            </button>

            {/* Card Database Tab */}
            <button
              onClick={() => setActiveView('database')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-gothic font-bold transition-all ${
                activeView === 'database'
                  ? 'bg-gradient-to-r from-red-800 to-rose-900 text-white border border-red-500/60 shadow-blood'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Base de Cartes</span>
            </button>

            {/* Meta Decks Tab */}
            <button
              onClick={() => setActiveView('metadecks')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-gothic font-bold transition-all ${
                activeView === 'metadecks'
                  ? 'bg-gradient-to-r from-red-800 to-rose-900 text-white border border-red-500/60 shadow-blood'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span className="hidden md:inline">Decks Méta</span>
            </button>

            {/* Rules Guide Tab */}
            <button
              onClick={() => setActiveView('rules')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-gothic font-bold transition-all ${
                activeView === 'rules'
                  ? 'bg-gradient-to-r from-red-800 to-rose-900 text-white border border-red-500/60 shadow-blood'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span className="hidden md:inline">Règles</span>
            </button>

            {/* Profile & Arena Bridge Tab */}
            <button
              onClick={() => setActiveView('profile')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-gothic font-bold transition-all ${
                activeView === 'profile'
                  ? 'bg-gradient-to-r from-amber-600 via-red-700 to-amber-700 text-white border border-amber-400 shadow-gold'
                  : 'text-gray-400 hover:text-amber-300 hover:bg-white/5'
              }`}
            >
              <User className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Mon Profil & Arène</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-black/40 text-emerald-300">
                {ownedCount}/217
              </span>
            </button>

          </nav>

        </div>
      </div>
    </header>
  );
}
