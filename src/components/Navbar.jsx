import React, { useState, useEffect, useRef } from 'react';
import { Layers, BookOpen, Trophy, Shield, User, Swords, Users, Globe, ChevronDown, Check } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../i18n/translations';

export default function Navbar({ 
  activeView, 
  setActiveView, 
  deckCardsCount = 0, 
  ownedCount = 0, 
  totalCount = 220,
  lang = 'fr',
  onChangeLang,
  t
}) {
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const langDropdownRef = useRef(null);

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === lang) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setShowLangDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 backdrop-blur-xl">
      <div className="w-full max-w-[1700px] mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveView('rules')}
            className="flex items-center space-x-2.5 cursor-pointer group select-none flex-shrink-0"
          >
            {/* Official Game Logo Image */}
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border-2 border-amber-500/70 shadow-blood group-hover:shadow-blood-lg transition-all flex-shrink-0 bg-black">
              <img 
                src="/logo.webp" 
                alt="Clans of London" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform" 
              />
            </div>

            <div className="hidden xl:block">
              <div className="flex items-center space-x-1.5">
                <span className="font-gothic font-extrabold text-base tracking-wider text-gray-100 group-hover:text-amber-400 transition-colors">
                  {t?.brand?.title || "CLANS OF LONDON"}
                </span>
              </div>
              <p className="text-[9px] font-mono tracking-widest text-red-400 uppercase -mt-0.5">
                {t?.brand?.subtitle || "Vampire: The Masquerade"}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto py-1 flex-1 justify-center max-w-full">
            
            {/* Deck Builder Tab */}
            <button
              onClick={() => setActiveView('deckbuilder')}
              className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-gothic font-bold transition-all whitespace-nowrap ${
                activeView === 'deckbuilder'
                  ? 'bg-gradient-to-r from-red-800 to-rose-900 text-white border border-red-500/60 shadow-blood'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{t?.nav?.deckbuilder || "Deck Builder"}</span>
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
              className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-gothic font-bold transition-all whitespace-nowrap ${
                activeView === 'database'
                  ? 'bg-gradient-to-r from-red-800 to-rose-900 text-white border border-red-500/60 shadow-blood'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t?.nav?.database || "Base de Cartes"}</span>
            </button>

            {/* COMMUNITY DECKS TAB */}
            <button
              onClick={() => setActiveView('community')}
              className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-gothic font-bold transition-all whitespace-nowrap ${
                activeView === 'community'
                  ? 'bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-950 text-white border border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                  : 'text-indigo-300/90 hover:text-white hover:bg-indigo-950/40 border border-indigo-500/20'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-bold">{t?.nav?.community || "Decks Communauté"}</span>
            </button>

            {/* Meta Decks Tab */}
            <button
              onClick={() => setActiveView('metadecks')}
              className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-gothic font-bold transition-all whitespace-nowrap ${
                activeView === 'metadecks'
                  ? 'bg-gradient-to-r from-red-800 to-rose-900 text-white border border-red-500/60 shadow-blood'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>{t?.nav?.metadecks || "Decks Méta"}</span>
            </button>

            {/* Arena Tab */}
            <button
              onClick={() => setActiveView('arena')}
              className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-gothic font-bold transition-all whitespace-nowrap ${
                activeView === 'arena'
                  ? 'bg-gradient-to-r from-red-800 to-rose-900 text-white border border-red-500/60 shadow-blood'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              <Swords className="w-3.5 h-3.5 text-red-400" />
              <span>{t?.nav?.arena || "Arène"}</span>
            </button>

            {/* Rules Tab */}
            <button
              onClick={() => setActiveView('rules')}
              className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-gothic font-bold transition-all whitespace-nowrap ${
                activeView === 'rules'
                  ? 'bg-gradient-to-r from-red-800 to-rose-900 text-white border border-red-500/60 shadow-blood'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{t?.nav?.rules || "Règles"}</span>
            </button>

            {/* Profile Tab */}
            <button
              onClick={() => setActiveView('profile')}
              className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-gothic font-bold transition-all whitespace-nowrap ${
                activeView === 'profile'
                  ? 'bg-gradient-to-r from-amber-600 via-red-700 to-amber-700 text-white border border-amber-400 shadow-gold'
                  : 'text-gray-400 hover:text-amber-300 hover:bg-white/5 border border-transparent'
              }`}
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>{t?.nav?.profile || "Mon Profil"}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-black/40 text-emerald-300">
                {ownedCount}/{totalCount}
              </span>
            </button>

          </nav>

          {/* Unofficial Fan Application Badge (Dark Pack) */}
          <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-red-950/40 border border-red-500/30 text-[10px] font-mono font-semibold text-red-300 shadow-sm flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>{t?.nav?.unofficialApp || "Application non-officielle"}</span>
          </div>

          {/* Globe Planet Language Switcher with Dropdown Menu */}
          <div className="relative flex-shrink-0" ref={langDropdownRef}>
            <button
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-[#121622] hover:bg-[#1c2236] border border-white/15 hover:border-amber-400/60 text-xs font-bold font-mono text-gray-200 hover:text-white transition-all shadow-sm"
              title={t?.nav?.langSwitch || "Changer de Langue"}
            >
              <Globe className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="text-[11px] font-mono font-bold uppercase text-amber-300">
                {currentLangObj?.code}
              </span>
              <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${showLangDropdown ? 'rotate-180 text-amber-400' : ''}`} />
            </button>

            {/* Dropdown Menu (6 Languages) */}
            {showLangDropdown && (
              <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-[#0b0e15] border-2 border-amber-500/40 shadow-[0_10px_30px_rgba(0,0,0,0.8)] py-1.5 z-50 animate-fadeIn">
                <div className="px-3 py-1 text-[10px] font-mono uppercase text-gray-400 border-b border-white/10 mb-1">
                  {t?.nav?.langSwitch || "Choisir la Langue"}
                </div>
                {SUPPORTED_LANGUAGES.map((l) => {
                  const isSelected = lang === l.code;
                  return (
                    <button
                      key={l.code}
                      onClick={() => {
                        onChangeLang(l.code);
                        setShowLangDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-gothic transition-colors text-left ${
                        isSelected
                          ? 'bg-red-950/80 text-amber-300 font-bold border-l-2 border-amber-400'
                          : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="px-1.5 py-0.5 rounded bg-black/60 border border-white/10 font-mono text-[10px] font-bold text-amber-400">
                          {l.code.toUpperCase()}
                        </span>
                        <span>{l.label}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
