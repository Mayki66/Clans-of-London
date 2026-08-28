import React, { useState, useEffect } from 'react';
import { Image, Download, Copy, Check, X, Sparkles, Share2 } from 'lucide-react';
import { generateDeckImageBlob } from '../../utils/deckImageExporter';

export default function ExportDeckImageModal({
  deckName = "Mon Deck",
  author = "Kindred",
  deckCards = [],
  lang = 'fr',
  t,
  onClose
}) {
  const [imageBlob, setImageBlob] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);

    generateDeckImageBlob({
      deckName,
      author,
      deckCards,
      lang
    }).then((blob) => {
      if (active && blob) {
        setImageBlob(blob);
        const url = URL.createObjectURL(blob);
        setImageSrc(url);
        setLoading(false);
      }
    });

    return () => {
      active = false;
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, [deckName, author, deckCards, lang]);

  const handleDownload = () => {
    if (!imageSrc) return;
    const a = document.createElement('a');
    a.href = imageSrc;
    const safeName = (deckName || 'Deck').replace(/[^a-zA-Z0-9_-]/g, '_');
    a.download = `ClansOfLondon_${safeName}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  const handleCopyClipboard = async () => {
    if (!imageBlob) return;
    try {
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': imageBlob })
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } else {
        alert(t?.exportImage?.copyNotSupported || (lang === 'fr' ? 'La copie directe d\'image n\'est pas supportée par votre navigateur. Utilisez le bouton Télécharger.' : 'Direct image copy is not supported in this browser. Please use Download.'));
      }
    } catch (e) {
      console.warn("Clipboard write failed", e);
      alert(t?.exportImage?.copyFailed || (lang === 'fr' ? 'Impossible de copier l\'image automatiquement. Téléchargez-la avec le bouton dédié.' : 'Failed to copy image to clipboard. Please use Download.'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative z-10 w-full max-w-4xl max-h-[92vh] rounded-3xl bg-[#0b0e15] border-2 border-indigo-500/40 shadow-[0_0_50px_rgba(0,0,0,0.9)] text-gray-200 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-indigo-950/50 via-purple-950/40 to-[#0b0e15]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-400/50 flex items-center justify-center text-indigo-300">
              <Image className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-gothic font-bold text-lg text-gray-100 flex items-center space-x-2">
                <span>{t?.exportImage?.title || (lang === 'fr' ? 'Fiche Visuelle de Deck HD' : 'HD Visual Deck Sheet')}</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  PNG 1200x850
                </span>
              </h3>
              <p className="text-xs text-gray-400 font-sans">
                {lang === 'fr' 
                  ? 'Fiche optimisée pour le partage sur Discord, Reddit et les réseaux sociaux.' 
                  : 'Infographic ready to share on Discord, Reddit and social media.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-red-950/60 border border-white/10 hover:border-red-500 text-gray-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex items-center justify-center bg-[#07090e]">
          {loading && (
            <div className="py-24 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-400/40 flex items-center justify-center mx-auto animate-pulse text-indigo-400">
                <Sparkles className="w-6 h-6 animate-spin" />
              </div>
              <p className="font-mono text-xs text-gray-400">
                {t?.exportImage?.generating || (lang === 'fr' ? 'Génération de la fiche HD en cours...' : 'Generating HD deck sheet...')}
              </p>
            </div>
          )}

          {!loading && imageSrc && (
            <div className="rounded-2xl overflow-hidden border-2 border-white/15 shadow-2xl max-w-full">
              <img
                src={imageSrc}
                alt={deckName}
                className="w-full h-auto object-contain max-h-[60vh] rounded-xl"
              />
            </div>
          )}
        </div>

        {/* Action Buttons Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#0a0c12] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs font-mono text-gray-400 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{t?.exportImage?.readyToPaste || (lang === 'fr' ? 'Prêt à être collé dans Discord (Ctrl+V) !' : 'Ready to paste in Discord (Ctrl+V)!')}</span>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {/* Copy to Clipboard */}
            <button
              onClick={handleCopyClipboard}
              disabled={loading || !imageBlob}
              className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl font-gothic font-bold text-xs border transition-all ${
                copied
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'bg-indigo-950 hover:bg-indigo-900 border-indigo-500/50 text-indigo-200 hover:text-white shadow-sm'
              }`}
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? (t?.exportImage?.copied || 'Image Copiée !') : (t?.exportImage?.copy || 'Copier l\'Image')}</span>
            </button>

            {/* Download PNG */}
            <button
              onClick={handleDownload}
              disabled={loading || !imageSrc}
              className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl font-gothic font-bold text-xs border transition-all ${
                downloaded
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                  : 'bg-gradient-to-r from-red-700 via-rose-700 to-red-900 hover:from-red-600 hover:to-rose-800 text-white border-red-500/60 shadow-blood'
              }`}
            >
              {downloaded ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
              <span>{downloaded ? (t?.exportImage?.downloaded || 'Téléchargé !') : (t?.exportImage?.download || 'Télécharger PNG')}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
