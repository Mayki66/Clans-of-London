/**
 * Clans of London — Storage Service
 *
 * Abstraction securisee du localStorage.
 * Toutes les operations de lecture/ecriture localStorage passent par ce service.
 * Avantages :
 * - Gestion centralisee des erreurs (quota, securite, SSR)
 * - Facilite les tests unitaires (mockable)
 * - Logs d'erreur coherents
 */

/**
 * Lit une valeur du localStorage et la parse en JSON.
 * @returns {T|null} La valeur parsee, ou null si absente ou erreur.
 */
export function storageGet(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`[Storage] Erreur lecture "${key}":`, e.message);
    return defaultValue;
  }
}

/**
 * Ecrit une valeur dans le localStorage apres serialisation JSON.
 * @returns {boolean} true si l'ecriture a reussi, false sinon.
 */
export function storageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn(`[Storage] Erreur ecriture "${key}":`, e.message);
    return false;
  }
}

/**
 * Lit une valeur simple (string) sans deserialization JSON.
 */
export function storageGetRaw(key, defaultValue = null) {
  try {
    return localStorage.getItem(key) || defaultValue;
  } catch (e) {
    console.warn(`[Storage] Erreur lecture brute "${key}":`, e.message);
    return defaultValue;
  }
}

/**
 * Ecrit une valeur simple (string) sans serialisation JSON.
 */
export function storageSetRaw(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    console.warn(`[Storage] Erreur ecriture brute "${key}":`, e.message);
    return false;
  }
}

/**
 * Supprime une cle du localStorage.
 */
export function storageRemove(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.warn(`[Storage] Erreur suppression "${key}":`, e.message);
    return false;
  }
}
