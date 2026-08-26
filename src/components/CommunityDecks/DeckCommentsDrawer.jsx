import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, User, Clock, Sparkles, AlertCircle } from 'lucide-react';
import { fetchDeckComments, postDeckComment, subscribeToDeckComments } from '../../data/deckComments';

export default function DeckCommentsDrawer({
  deckId,
  deckName,
  userProfile,
  lang = 'fr',
  isOpen = false
}) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState(userProfile?.playerName || 'Mayki');
  const [submitting, setSubmitting] = useState(false);
  const messagesEndRef = useRef(null);

  // Sync author if profile changes
  useEffect(() => {
    if (userProfile?.playerName) {
      setAuthor(userProfile.playerName);
    }
  }, [userProfile]);

  // Load comments & subscribe to Realtime
  useEffect(() => {
    if (!isOpen || !deckId) return;

    let isMounted = true;
    setLoading(true);

    fetchDeckComments(deckId).then((data) => {
      if (isMounted) {
        setComments(data);
        setLoading(false);
      }
    });

    const unsubscribe = subscribeToDeckComments(deckId, (event) => {
      if (event.type === 'INSERT' && event.comment) {
        setComments((prev) => {
          if (prev.some((c) => c.id === event.comment.id)) return prev;
          return [...prev, event.comment];
        });
      } else if (event.type === 'DELETE' && event.commentId) {
        setComments((prev) => prev.filter((c) => c.id !== event.commentId));
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [deckId, isOpen]);

  // Auto-scroll to bottom on new comments
  useEffect(() => {
    if (isOpen && comments.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comments, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;

    setSubmitting(true);
    try {
      const added = await postDeckComment({
        deckId,
        author: author.trim() || userProfile?.playerName || 'Mayki',
        content: content.trim()
      });

      if (added) {
        setComments((prev) => {
          if (prev.some((c) => c.id === added.id)) return prev;
          return [...prev, added];
        });
        setContent('');
      }
    } catch (err) {
      console.error("Error posting comment", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const formatDate = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return lang === 'fr' ? 'Récemment' : 'Recently';
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-indigo-500/20 space-y-4 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-4 h-4 text-indigo-400" />
          <span className="font-gothic font-bold text-xs text-gray-200 uppercase tracking-wider">
            {lang === 'fr' ? 'Discussions & Conseils Stratégiques' : 'Discussions & Strategy Advice'}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-950/80 border border-indigo-500/40 text-indigo-300">
            {comments.length}
          </span>
        </div>
        <span className="text-[10px] font-mono text-gray-500">
          {lang === 'fr' ? 'Diffusion en direct' : 'Live updates'}
        </span>
      </div>

      {/* Comments List */}
      <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
        {loading && (
          <div className="py-6 text-center text-xs font-mono text-gray-400">
            <span className="animate-pulse">
              {lang === 'fr' ? 'Chargement des messages...' : 'Loading comments...'}
            </span>
          </div>
        )}

        {!loading && comments.length === 0 && (
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-center space-y-1">
            <p className="text-xs text-gray-400 font-sans">
              {lang === 'fr' 
                ? 'Aucun commentaire pour le moment.' 
                : 'No comments yet on this deck.'}
            </p>
            <p className="text-[11px] text-indigo-300/80 font-mono">
              {lang === 'fr'
                ? 'Soyez le premier vampire à partager votre avis ou une variante !'
                : 'Be the first Kindred to share advice or a card variant!'}
            </p>
          </div>
        )}

        {!loading && comments.map((comment) => (
          <div
            key={comment.id}
            className="p-3 rounded-xl bg-[#090b10] border border-white/10 space-y-1.5 hover:border-indigo-500/30 transition-all text-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-700 to-purple-900 flex items-center justify-center text-[10px] font-bold text-white">
                  {comment.author ? comment.author.charAt(0).toUpperCase() : 'K'}
                </div>
                <span className="font-gothic font-bold text-gray-200">
                  {comment.author}
                </span>
              </div>
              <div className="flex items-center space-x-1 text-[10px] font-mono text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{formatDate(comment.createdAt)}</span>
              </div>
            </div>
            <p className="text-gray-300 font-sans leading-relaxed pl-6">
              {comment.content}
            </p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-2 pt-1">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder={lang === 'fr' ? 'Votre pseudo' : 'Your name'}
            maxLength={25}
            className="w-1/3 px-3 py-2 rounded-xl bg-[#141824] border border-white/10 text-xs font-gothic text-gray-200 focus:border-indigo-400 focus:outline-none placeholder-gray-500"
          />
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={lang === 'fr' ? 'Votre conseil, variante ou question...' : 'Your advice, variant or question...'}
            maxLength={300}
            className="flex-1 px-3 py-2 rounded-xl bg-[#141824] border border-white/10 text-xs font-sans text-gray-200 focus:border-indigo-400 focus:outline-none placeholder-gray-500"
          />
          <button
            type="submit"
            disabled={!content.trim() || submitting}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-800 to-purple-900 hover:from-indigo-700 hover:to-purple-800 text-white font-gothic font-bold text-xs border border-indigo-400/40 shadow-sm transition-all disabled:opacity-40 flex items-center space-x-1 flex-shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{lang === 'fr' ? 'Envoyer' : 'Send'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
