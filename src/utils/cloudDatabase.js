/**
 * SHIM DE COMPATIBILITE - NE PAS MODIFIER DIRECTEMENT
 *
 * Ce fichier est conserve uniquement pour la compatibilite avec les imports existants.
 * Toute la logique a ete migree vers src/services/cloudService.js
 *
 * Pour les nouveaux developpements, importer directement depuis :
 *   import { ... } from '../../services/cloudService';
 */
export {
  cleanSupabaseUrl,
  getSupabaseConfig,
  saveSupabaseConfig,
  getSupabaseClient,
  syncCloudVisit,
  syncCloudUser,
  syncCloudExport,
  fetchAllCloudTelemetry,
  syncCloudArenaMatch,
  fetchCloudLeaderboard
} from '../services/cloudService';
