import React, { useState, useRef } from 'react';
import { Droplets, Shield, Sparkles, Upload, User, ArrowRight, Check, Globe } from 'lucide-react';
import confetti from 'canvas-confetti';
import { trackUserRegistration } from '../../utils/adminTelemetry';
import { SUPPORTED_LANGUAGES } from '../../i18n/translations';

export default function OnboardingModal({
  onComplete,
  onImportProfile,
  lang = 'fr',
  onChangeLang,
  t
}) {
  const [pseudo, setPseudo] = useState('');
  const fileInputRef = useRef(null);

  const handleSubmitPseudo = (e) => {
    e.preventDefault();
    const finalName = pseudo.trim() || (t?.onboarding?.defaultPlayerName || (lang === 'fr' ? 'Kindred de Londres' : 'London Kindred'));
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    try {
      trackUserRegistration(finalName, 1, 'Néophyte');
    } catch (err) {
      console.error("Error tracking registration", err);
    }
    onComplete({ playerName: finalName });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed && (parsed.ownedCardIds || parsed.playerName)) {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
          onImportProfile(parsed);
          onComplete(parsed);
        } else {
          alert(t?.onboarding?.invalidJsonAlert || (lang === 'fr' ? 'Fichier JSON invalide : cartes non trouvées.' : 'Invalid JSON file: cards missing.'));
        }
      } catch (err) {
        console.error("Failed to parse JSON file", err);
        alert(t?.onboarding?.readErrorAlert || (lang === 'fr' ? 'Erreur de lecture du fichier JSON.' : 'Error reading JSON file.'));
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      {/* Background Ambient Glow */}
      <div className="absolute w-[500px] h-[500px] bg-red-600/15 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="relative w-full max-w-xl rounded-3xl bg-[#090b10] border-2 border-red-600/50 p-6 sm:p-8 space-y-6 shadow-[0_0_80px_rgba(220,38,38,0.4)] text-gray-200">
        
        {/* Header with Logo & Lang Selector */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-white/10 pb-4 gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 via-rose-900 to-black border-2 border-amber-500/80 flex items-center justify-center shadow-blood text-2xl">
              🩸
            </div>
            <div>
              <h2 className="font-gothic font-extrabold text-xl text-gray-100 tracking-wider">
                {t?.brand?.title || "CLANS OF LONDON"}
              </h2>
              <p className="text-[11px] font-mono tracking-widest text-red-400 uppercase">
                {t?.brand?.subtitle || "Vampire: The Masquerade"}
              </p>
            </div>
          </div>

          {/* Lang Selector Grid */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#141824] border border-white/10 text-xs font-bold font-mono flex-wrap justify-center">
            {SUPPORTED_LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => onChangeLang(l.code)}
                className={`px-2 py-1 rounded-lg transition-all text-xs flex items-center space-x-1 ${
                  lang === l.code ? 'bg-red-800 text-white shadow-blood font-bold' : 'text-gray-400 hover:text-white'
                }`}
                title={l.label}
              >
                <span>{l.flag}</span>
                <span className="uppercase text-[10px]">{l.code}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Welcome Text */}
        <div className="text-center space-y-1.5">
          <h3 className="font-gothic font-extrabold text-2xl text-amber-300">
            {t?.onboarding?.title || (lang === 'fr' ? "Bienvenue dans les Nuits de Londres" : "Welcome to the Nights of London")}
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed font-sans max-w-md mx-auto">
            {t?.onboarding?.subtitle || (lang === 'fr' ? "Vampire: The Masquerade – Deck Builder & Arène Stratégique" : "Vampire: The Masquerade – Deck Builder & Tactical Arena")}
          </p>
        </div>

        {/* Option 1: Enter Pseudo */}
        <form onSubmit={handleSubmitPseudo} className="space-y-4 bg-[#121520] p-5 rounded-2xl border border-white/10">
          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1.5 font-semibold">
              {t?.onboarding?.enterPseudo || (lang === 'fr' ? "Choisissez votre Pseudo de Sang :" : "Choose your Blood Nickname:")}
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
              <input
                type="text"
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                placeholder={t?.onboarding?.pseudoPlaceholder || "Entrez votre pseudo..."}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#090b10] border border-amber-500/40 text-sm text-gray-100 font-gothic font-bold placeholder-gray-600 focus:outline-none focus:border-amber-400"
                autoFocus
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-red-800 via-red-700 to-rose-900 hover:from-red-700 hover:to-rose-800 text-white font-gothic font-extrabold text-sm tracking-wider shadow-blood transition-all flex items-center justify-center space-x-2"
          >
            <span>{t?.onboarding?.startJourney || (lang === 'fr' ? "Pénétrer dans la Mascarade" : "Enter the Masquerade")}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Option 2: Upload JSON */}
        <div className="space-y-2 text-center">
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-white/10" />
            <span className="flex-shrink mx-4 text-[11px] font-mono text-gray-500 uppercase">
              {t?.onboarding?.orImport || (lang === 'fr' ? "OU Importez votre profil existant (.json)" : "OR Import your existing profile (.json)")}
            </span>
            <div className="flex-grow border-t border-white/10" />
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 rounded-2xl bg-[#141824] hover:bg-[#1f2538] border border-indigo-500/40 text-indigo-200 text-xs font-gothic font-bold flex items-center justify-center space-x-2 transition-all"
          >
            <Upload className="w-4 h-4 text-indigo-400" />
            <span>{t?.onboarding?.dropJson || (lang === 'fr' ? "Glissez ou cliquez pour importer votre fichier profil .json" : "Drag & drop or click to import your profile .json")}</span>
          </button>
        </div>

        {/* RGPD / Privacy Shield Notice */}
        <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono text-gray-500 flex items-start space-x-2">
          <span className="text-sm">🛡️</span>
          <p className="leading-snug">
            {t?.onboarding?.privacyNotice || (lang === 'fr' ? "Respect strict du RGPD : Toutes vos données restent stockées sur votre appareil (LocalStorage). Aucun pistage ni collecte de données." : "Strict GDPR Compliance: All your data is stored locally on your device (LocalStorage). Zero tracking or data collection.")}
          </p>
        </div>

      </div>
    </div>
  );
}
