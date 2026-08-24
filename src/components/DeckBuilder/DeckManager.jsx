import React, { useState } from 'react';
import { Save, Download, Upload, Trash2, FolderOpen, Copy, Check, AlertCircle, Sparkles, Share2, Users } from 'lucide-react';
import { CARDS_DATA } from '../../data/cardsData';
import PublishCommunityDeckModal from './PublishCommunityDeckModal';
import confetti from 'canvas-confetti';

export default function DeckManager({
  deckName,
  setDeckName,
  deckCards,
  onClearDeck,
  onLoadDeck,
  savedDecks,
  onSaveDeck,
  onDeleteSavedDeck,
  userProfile
}) {
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [copied, setCopied] = useState(false);

  const cardCount = deckCards.length;
  const isComplete = cardCount === 15;

  const handleSave = () => {
    if (!deckName.trim()) {
      alert('Veuillez entrer un nom pour votre deck.');
      return;
    }
    onSaveDeck({
      id: `deck-${Date.now()}`,
      name: deckName,
      createdAt: new Date().toLocaleDateString('fr-FR'),
      cardIds: deckCards.map(c => c.id)
    });
    alert(`Deck "${deckName}" sauvegardé avec succès !`);
  };

  const handleExportText = () => {
    const lines = [
      `// Deck: ${deckName || 'Deck Sans Titre'}`,
      `// Jeu: Vampire: The Masquerade - Clans of London`,
      `// Total: ${cardCount}/15 cartes`,
      '',
      ...deckCards.map(c => `1x ${c.name} [${c.clan}] (S${c.series}) - Coût: ${c.cost}, Puiss: ${c.power}`)
    ];
    const text = lines.join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleImportText = () => {
    if (!importText.trim()) return;

    const matchedCardIds = [];
    const lines = importText.split('\n');

    lines.forEach(line => {
      const cleanLine = line.replace(/^\d+x?\s*/, '').trim().toLowerCase();
      if (!cleanLine || cleanLine.startsWith('//')) return;

      const found = CARDS_DATA.find(c => 
        cleanLine.includes(c.name.toLowerCase()) || 
        c.name.toLowerCase().includes(cleanLine) ||
        c.id.toLowerCase() === cleanLine
      );
      if (found && !matchedCardIds.includes(found.id) && matchedCardIds.length < 15) {
        matchedCardIds.push(found.id);
      }
    });

    if (matchedCardIds.length > 0) {
      onLoadDeck({
        name: 'Deck Importé',
        cardIds: matchedCardIds
      });
      setShowImportModal(false);
      setImportText('');
      alert(`${matchedCardIds.length} cartes importées avec succès !`);
    } else {
      alert("Aucune carte correspondante n'a été trouvée dans le texte fourni.");
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-4 md:p-5 border border-white/10 space-y-4 shadow-2xl">
      {/* Deck Title & Status Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Name input */}
        <div className="flex-1">
          <label className="block text-[11px] font-mono text-gray-400 mb-1">
            NOM DU DECK
          </label>
          <input
            type="text"
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
            placeholder="Ex: Hecata Murder Tempo, Brujah Aggro..."
            className="w-full px-3.5 py-2 rounded-xl bg-[#0a0d14] border border-white/15 focus:border-red-500 text-sm font-gothic font-semibold text-gray-100 placeholder-gray-500"
          />
        </div>

        {/* Counter Badge */}
        <div className="flex items-center space-x-2">
          <div className={`px-4 py-2 rounded-xl border flex items-center space-x-2 ${
            isComplete
              ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
              : cardCount > 15
                ? 'bg-red-950/80 border-red-500/60 text-red-300'
                : 'bg-amber-950/80 border-amber-500/60 text-amber-300'
          }`}>
            <span className="font-gothic font-bold text-sm">
              {cardCount} / 15
            </span>
            <span className="text-xs">
              {isComplete ? '• Prêt !' : cardCount > 15 ? '• Trop de cartes' : '• Incomplet'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
        <div className="flex flex-wrap items-center gap-2">
          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={cardCount === 0}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-800 to-rose-900 hover:from-red-700 hover:to-rose-800 text-white text-xs font-gothic font-bold border border-red-500/60 shadow-blood transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            <span>Sauvegarder</span>
          </button>

          {/* Open Saved Decks Modal */}
          <button
            onClick={() => setShowSavedModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#121520] hover:bg-[#1a1f2e] border border-white/15 text-gray-200 text-xs font-semibold transition-all"
          >
            <FolderOpen className="w-4 h-4 text-amber-400" />
            <span>Mes Decks ({savedDecks.length})</span>
          </button>

          {/* Export to Clipboard */}
          <button
            onClick={handleExportText}
            disabled={cardCount === 0}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#121520] hover:bg-[#1a1f2e] border border-white/15 text-gray-200 text-xs font-semibold transition-all disabled:opacity-50"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-blue-400" />}
            <span>{copied ? 'Copié !' : 'Exporter'}</span>
          </button>

          {/* Import Modal */}
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#121520] hover:bg-[#1a1f2e] border border-white/15 text-gray-200 text-xs font-semibold transition-all"
          >
            <Upload className="w-4 h-4 text-purple-400" />
            <span>Importer</span>
          </button>

          {/* Ajouter Commu Button */}
          <button
            onClick={() => setShowPublishModal(true)}
            disabled={cardCount === 0}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-900 to-purple-900 hover:from-indigo-800 hover:to-purple-800 border border-indigo-500/50 text-indigo-200 hover:text-white text-xs font-gothic font-bold transition-all shadow-[0_0_12px_rgba(99,102,241,0.3)] disabled:opacity-50"
            title="Publier ce deck dans l'espace communautaire"
          >
            <Share2 className="w-4 h-4 text-indigo-400" />
            <span>Ajouter Commu</span>
          </button>
        </div>

        {/* Clear Deck */}
        {cardCount > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Voulez-vous vraiment vider ce deck ?')) {
                onClearDeck();
              }
            }}
            className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-950 border border-red-500/30 text-red-300 hover:text-white text-xs font-semibold transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Vider</span>
          </button>
        )}
      </div>

      {/* Saved Decks Modal */}
      {showSavedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#0f121a] border border-amber-500/40 p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-gothic font-bold text-lg text-gray-100 flex items-center space-x-2">
                <FolderOpen className="w-5 h-5 text-amber-400" />
                <span>Mes Decks Sauvegardés</span>
              </h3>
              <button
                onClick={() => setShowSavedModal(false)}
                className="text-gray-400 hover:text-white text-xs"
              >
                Fermer
              </button>
            </div>

            {savedDecks.length === 0 ? (
              <p className="text-sm text-gray-400 italic text-center py-6">
                Aucun deck personnalisé sauvegardé pour le moment.
              </p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {savedDecks.map((deck) => (
                  <div
                    key={deck.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#141824] border border-white/10 hover:border-amber-400/50 transition-all"
                  >
                    <div>
                      <h4 className="font-gothic font-bold text-sm text-gray-200">{deck.name}</h4>
                      <p className="text-xs text-gray-400 font-mono">
                        {deck.cardIds.length} cartes • Sauvegardé le {deck.createdAt}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          onLoadDeck(deck);
                          setShowSavedModal(false);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-red-900 hover:bg-red-800 text-white text-xs font-bold font-gothic"
                      >
                        Charger
                      </button>
                      <button
                        onClick={() => onDeleteSavedDeck(deck.id)}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-red-950 text-gray-400 hover:text-red-300"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Import Deck Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#0f121a] border border-purple-500/40 p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-gothic font-bold text-lg text-gray-100 flex items-center space-x-2">
                <Upload className="w-5 h-5 text-purple-400" />
                <span>Importer une Liste de Cartes</span>
              </h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-gray-400 hover:text-white text-xs"
              >
                Fermer
              </button>
            </div>

            <p className="text-xs text-gray-400">
              Collez ci-dessous le texte exporté ou la liste des noms de cartes (ex: Morag Stewart, Carlo Galli...) :
            </p>

            <textarea
              rows={6}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Morag Stewart&#10;Carlo Galli&#10;Ophelia&#10;Sadako Asano..."
              className="w-full p-3 rounded-xl bg-[#08090d] border border-white/15 focus:border-purple-500 text-xs font-mono text-gray-200 placeholder-gray-600"
            />

            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-gray-400 hover:text-white text-xs font-semibold"
              >
                Annuler
              </button>
              <button
                onClick={handleImportText}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-800 to-indigo-900 hover:from-purple-700 hover:to-indigo-800 text-white text-xs font-bold font-gothic"
              >
                Importer dans le Deck
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publish to Community Modal */}
      <PublishCommunityDeckModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        deckName={deckName}
        deckCards={deckCards}
        userProfile={userProfile}
      />
    </div>
  );
}
