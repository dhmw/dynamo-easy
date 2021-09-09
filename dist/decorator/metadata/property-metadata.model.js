"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @hidden
 */
function hasGenericType(propertyMetadata) {
    return !!(propertyMetadata && propertyMetadata.typeInfo && propertyMetadata.typeInfo.genericType);
}
exports.hasGenericType = hasGenericType;
/**
 * @hidden
 */
function hasType(propertyMetadata) {
    return !!(propertyMetadata && propertyMetadata.typeInfo && propertyMetadata.typeInfo.type);
}
exports.hasType = hasType;
/**
 * @hidden
 */
function alterCollectionPropertyMetadataForSingleItem(propertyMeta) {
    if (!propertyMeta) {
        return;
    }
    if (propertyMeta.mapper && propertyMeta.mapperForSingleItem) {
        return Object.assign({}, propertyMeta, { mapper: propertyMeta.mapperForSingleItem });
    }
    if (propertyMeta.typeInfo && (propertyMeta.typeInfo.type === Set || propertyMeta.typeInfo.type === Array)) {
        if (hasGenericType(propertyMeta)) {
            return Object.assign({}, propertyMeta, { typeInfo: { type: propertyMeta.typeInfo.genericType } });
        }
        else {
            return;
        }
    }
    return Object.assign({}, propertyMeta);
}
exports.alterCollectionPropertyMetadataForSingleItem = alterCollectionPropertyMetadataForSingleItem;
//# sourceMappingURL=property-metadata.model.js.map