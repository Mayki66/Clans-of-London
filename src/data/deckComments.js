/**
 * Deck Comments Data Service with Supabase Cloud Sync & Realtime
 * Vampire: The Masquerade – Clans of London
 */
import { getSupabaseClient } from '../utils/cloudDatabase';

const LOCAL_STORAGE_COMMENTS_PREFIX = 'col_comments_deck_';

/**
 * Récupère les commentaires d'un deck depuis le cache local
 */
export function getLocalDeckComments(deckId) {
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_COMMENTS_PREFIX}${deckId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (e) {
    console.error("Error reading local deck comments", e);
  }
  return [];
}

/**
 * Sauvegarde les commentaires d'un deck dans le cache local
 */
export function saveLocalDeckComments(deckId, comments) {
  try {
    localStorage.setItem(`${LOCAL_STORAGE_COMMENTS_PREFIX}${deckId}`, JSON.stringify(comments));
  } catch (e) {
    console.error("Error saving local deck comments", e);
  }
}

/**
 * Récupère tous les commentaires d'un deck depuis Supabase
 */
export async function fetchDeckComments(deckId) {
  const localComments = getLocalDeckComments(deckId);
  const supabase = getSupabaseClient();

  if (!supabase || !deckId) {
    return localComments;
  }

  try {
    const { data, error } = await supabase
      .from('col_deck_comments')
      .select('*')
      .eq('deck_id', deckId)
      .order('created_at', { ascending: true });

    if (error) {
      console.warn("Error fetching deck comments from Supabase", error.message);
      return localComments;
    }

    if (data && Array.isArray(data)) {
      const mapped = data.map(c => ({
        id: c.id,
        deckId: c.deck_id,
        author: c.author || "Kindred",
        content: c.content,
        createdAt: c.created_at ? new Date(c.created_at).toISOString() : new Date().toISOString()
      }));

      saveLocalDeckComments(deckId, mapped);
      return mapped;
    }
  } catch (err) {
    console.error("fetchDeckComments error", err);
  }

  return localComments;
}

/**
 * Publie un nouveau commentaire sur un deck dans Supabase
 */
export async function postDeckComment({ deckId, author, content }) {
  if (!deckId || !content || !content.trim()) return null;

  const cleanAuthor = (author || 'Kindred').trim();
  const cleanContent = content.trim();
  const supabase = getSupabaseClient();

  let newComment = null;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('col_deck_comments')
        .insert([{
          deck_id: deckId,
          author: cleanAuthor,
          content: cleanContent
        }])
        .select()
        .single();

      if (!error && data) {
        newComment = {
          id: data.id,
          deckId: data.deck_id,
          author: data.author,
          content: data.content,
          createdAt: data.created_at
        };
      }
    } catch (e) {
      console.warn("Error inserting comment in Supabase", e);
    }
  }

  // Fallback local
  if (!newComment) {
    newComment = {
      id: `comm-local-${Date.now()}`,
      deckId,
      author: cleanAuthor,
      content: cleanContent,
      createdAt: new Date().toISOString()
    };
  }

  // Mettre à jour le cache local
  const current = getLocalDeckComments(deckId);
  const updated = [...current, newComment];
  saveLocalDeckComments(deckId, updated);

  return newComment;
}

/**
 * Écoute en temps réel les nouveaux commentaires sur un deck donné
 */
export function subscribeToDeckComments(deckId, onEvent) {
  const supabase = getSupabaseClient();
  if (!supabase || !deckId) return () => {};

  const channelName = `col-comments-${deckId}-${Date.now()}`;
  const channel = supabase
    .channel(channelName)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'col_deck_comments',
        filter: `deck_id=eq.${deckId}`
      },
      (payload) => {
        const { eventType, new: newRow, old: oldRow } = payload;
        if (eventType === 'INSERT' && newRow) {
          onEvent({
            type: 'INSERT',
            comment: {
              id: newRow.id,
              deckId: newRow.deck_id,
              author: newRow.author || "Kindred",
              content: newRow.content,
              createdAt: newRow.created_at
            }
          });
        } else if (eventType === 'DELETE' && oldRow) {
          onEvent({ type: 'DELETE', commentId: oldRow.id });
        }
      }
    )
    .subscribe();

  return () => {
    try {
      supabase.removeChannel(channel);
    } catch (e) {
      console.warn("Error unsubscribing deck comments channel", e);
    }
  };
}
