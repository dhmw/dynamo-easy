/**
 * @hidden
 */
export function hasGenericType(propertyMetadata) {
    return !!(propertyMetadata && propertyMetadata.typeInfo && propertyMetadata.typeInfo.genericType);
}
/**
 * @hidden
 */
export function hasType(propertyMetadata) {
    return !!(propertyMetadata && propertyMetadata.typeInfo && propertyMetadata.typeInfo.type);
}
/**
 * @hidden
 */
export function alterCollectionPropertyMetadataForSingleItem(propertyMeta) {
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
//# sourceMappingURL=property-metadata.model.js.map