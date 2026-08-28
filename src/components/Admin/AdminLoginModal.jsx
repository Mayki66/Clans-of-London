import React, { useState } from 'react';
import { Lock, User, KeyRound, X, ArrowRight, ShieldAlert } from 'lucide-react';
import { verifyAdminCredentials } from '../../utils/adminTelemetry';

export default function AdminLoginModal({ onClose, onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      const isValid = await verifyAdminCredentials(username, password);
      if (isValid) {
        onSuccess();
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Error verifying admin credentials", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#0e111a] border-2 border-red-500/40 p-6 shadow-[0_0_50px_rgba(220,38,38,0.3)] text-gray-200 space-y-5">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white/5 hover:bg-red-950 text-gray-400 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Icon */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-800 to-black border border-red-500/50 flex items-center justify-center mx-auto shadow-blood text-xl">
            🔒
          </div>
          <h3 className="font-gothic font-extrabold text-xl text-gray-100">
            {t?.admin?.loginTitle || "Accès Administrateur"}
          </h3>
          <p className="text-xs text-gray-400 font-mono">
            {t?.admin?.loginSubtitle || "Espace de contrôle privé"}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-red-950/80 border border-red-500 text-red-200 text-xs font-mono flex items-center space-x-2 animate-shake">
            <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{t?.admin?.credentialsError || "Identifiants administrateur incorrects."}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1">
              Identifiant
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#090b10] border border-white/15 text-xs text-gray-100 font-mono focus:outline-none focus:border-red-500"
                placeholder={t?.admin?.usernamePlaceholder || "Identifiant..."}
                autoFocus
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1">
              Mot de Passe
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#090b10] border border-white/15 text-xs text-gray-100 font-mono focus:outline-none focus:border-red-500"
                placeholder="••••••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-800 to-rose-900 hover:from-red-700 hover:to-rose-800 text-white font-gothic font-bold text-xs tracking-wider shadow-blood transition-all flex items-center justify-center space-x-2"
          >
            <span>{loading ? (t?.admin?.checking || "Vérification...") : (t?.admin?.unlock || "Déverrouiller")}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
