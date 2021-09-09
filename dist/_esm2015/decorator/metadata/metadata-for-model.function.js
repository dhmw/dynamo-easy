import { Metadata } from './metadata';
/**
 * create the metadata wrapper instance for a @Model() decorated class.
 */
export function metadataForModel(modelConstructor) {
    return new Metadata(modelConstructor);
}
//# sourceMappingURL=metadata-for-model.function.js.map