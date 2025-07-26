/**
 * Central export for all schema definitions
 */

import { generateImageUrlSchema, generateImageSchema, editImageSchema, generateImageFromReferenceSchema, listImageModelsSchema } from './services/imageSchema.js';
import { respondAudioSchema, listAudioVoicesSchema } from './services/audioSchema.js';
import { respondTextSchema, listTextModelsSchema } from './services/textSchema.js';


// Re-export all schemas
export {
  // Image schemas
  generateImageUrlSchema,
  generateImageSchema,
  editImageSchema,
  generateImageFromReferenceSchema,
  listImageModelsSchema,

  // Audio schemas
  respondAudioSchema,
  listAudioVoicesSchema,

  // Text schemas
  respondTextSchema,
  listTextModelsSchema
};

/**
 * Get all tool schemas as an array
 * @returns {Array} Array of all tool schemas
 */
export function getAllToolSchemas() {
  return [
    generateImageUrlSchema,
    generateImageSchema,
    editImageSchema,
    generateImageFromReferenceSchema,
    listImageModelsSchema,
    respondAudioSchema,
    listAudioVoicesSchema,
    respondTextSchema,
    listTextModelsSchema
  ];
}
