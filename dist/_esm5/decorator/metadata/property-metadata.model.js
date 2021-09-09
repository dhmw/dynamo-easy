import * as tslib_1 from "tslib";
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
        return tslib_1.__assign({}, propertyMeta, { mapper: propertyMeta.mapperForSingleItem });
    }
    if (propertyMeta.typeInfo && (propertyMeta.typeInfo.type === Set || propertyMeta.typeInfo.type === Array)) {
        if (hasGenericType(propertyMeta)) {
            return tslib_1.__assign({}, propertyMeta, { typeInfo: { type: propertyMeta.typeInfo.genericType } });
        }
        else {
            return;
        }
    }
    return tslib_1.__assign({}, propertyMeta);
}
//# sourceMappingURL=property-metadata.model.js.map