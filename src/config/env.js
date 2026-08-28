/**
 * Clans of London — Variables d'Environnement Securisees
 *
 * Ce fichier est le SEUL point d'acces aux variables d'environnement.
 * - En production (Vercel) : VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY
 *   sont injectees par Vercel au moment du build (Settings > Environment Variables).
 * - En local : lire depuis .env.local (non versionne, ignore par .gitignore).
 *
 * Aucune cle secrete ne doit jamais etre codee en dur dans le code source.
 */

export const ENV = {
  supabaseUrl:     import.meta.env?.VITE_SUPABASE_URL     || null,
  supabaseAnonKey: import.meta.env?.VITE_SUPABASE_ANON_KEY || null,
  isProduction:    import.meta.env?.PROD  ?? false,
  isDev:           import.meta.env?.DEV   ?? true,
  mode:            import.meta.env?.MODE  || 'development',
};

/**
 * Retourne true si la configuration Supabase est disponible.
 * Utiliser cette fonction avant toute operation cloud.
 */
export function isCloudAvailable() {
  return Boolean(ENV.supabaseUrl && ENV.supabaseAnonKey);
}
