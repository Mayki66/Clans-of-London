/**
 * SHIM DE COMPATIBILITE - NE PAS MODIFIER DIRECTEMENT
 *
 * Ce fichier est conserve uniquement pour la compatibilite avec les imports existants.
 * Toute la logique a ete migree vers src/services/wikiService.js
 *
 * Pour les nouveaux developpements, importer directement depuis :
 *   import { ... } from '../../services/wikiService';
 */
export {
  getLastSyncMetadata,
  saveSyncMetadata,
  syncCardsWithParadoxWiki
} from '../services/wikiService';
