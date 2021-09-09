"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module mapper
 */
const property_metadata_model_1 = require("../../decorator/metadata/property-metadata.model");
const not_null_function_1 = require("../../helper/not-null.function");
const mapper_1 = require("../mapper");
const util_1 = require("../util");
function collectionFromDb(attributeValue, propertyMetadata) {
    const explicitType = propertyMetadata && propertyMetadata.typeInfo ? propertyMetadata.typeInfo.type : null;
    let arr;
    // if [L]ist
    if ('L' in attributeValue) {
        if (property_metadata_model_1.hasGenericType(propertyMetadata)) {
            arr = attributeValue.L.map((item) => mapper_1.fromDb(item.M, propertyMetadata.typeInfo.genericType));
        }
        else {
            // tslint:disable-next-line:no-unnecessary-callback-wrapper
            arr = attributeValue.L.map((v) => mapper_1.fromDbOne(v));
        }
        return explicitType && explicitType === Set ? new Set(arr) : arr;
    }
    // if [(N|S|B)S]et
    else if ('SS' in attributeValue) {
        arr = attributeValue.SS;
    }
    else if ('NS' in attributeValue) {
        arr = attributeValue.NS.map(parseFloat);
    }
    else if ('BS' in attributeValue) {
        arr = attributeValue.BS;
    }
    else {
        throw new Error(`No Collection Data (SS | NS | BS | L) was found in attribute data, given attributeValue: ${JSON.stringify(attributeValue)}`);
    }
    return explicitType && explicitType === Array ? arr : new Set(arr);
}
function collectionToDb(propertyValue, propertyMetadata) {
    if (!(Array.isArray(propertyValue) || util_1.isSet(propertyValue))) {
        throw new Error(`Given value must be either Array or Set ${JSON.stringify(propertyValue)}`);
    }
    let collectionType;
    // detect collection type
    if (propertyMetadata) {
        // based on metadata
        collectionType = detectCollectionTypeFromMetadata(propertyMetadata, propertyValue);
    }
    else {
        // based on value
        // or throw if not a collectionType
        collectionType = util_1.detectCollectionTypeFromValue(propertyValue);
    }
    // convert to array if we deal with a set for same behaviour
    propertyValue = util_1.isSet(propertyValue) ? Array.from(propertyValue) : propertyValue;
    // empty values are not allowed for S(et) types only for L(ist)
    if (collectionType !== 'L' && propertyValue.length === 0) {
        return null;
    }
    // do the mapping depending on type
    switch (collectionType) {
        case 'SS':
            return { SS: propertyValue };
        case 'NS':
            return { NS: propertyValue.map((num) => num.toString()) };
        case 'BS':
            return { BS: propertyValue };
        case 'L':
            if (property_metadata_model_1.hasGenericType(propertyMetadata)) {
                return {
                    L: propertyValue.map((value) => ({
                        M: mapper_1.toDb(value, propertyMetadata.typeInfo.genericType),
                    })),
                };
            }
            else {
                return {
                    L: propertyValue
                        // tslint:disable-next-line:no-unnecessary-callback-wrapper
                        .map((v) => mapper_1.toDbOne(v))
                        .filter(not_null_function_1.notNull),
                };
            }
        // no 'default' necessary, all possible cases caught
    }
}
exports.CollectionMapper = {
    fromDb: collectionFromDb,
    toDb: collectionToDb,
};
function detectCollectionTypeFromMetadata(propertyMetadata, propertyValue) {
    const explicitType = propertyMetadata && propertyMetadata.typeInfo ? propertyMetadata.typeInfo.type : null;
    if (!(explicitType === Array || explicitType === Set)) {
        throw new Error(`only 'Array' and 'Set' are valid values for explicit type, found ${explicitType} on value ${JSON.stringify(propertyValue)}`);
    }
    if (propertyMetadata.isSortedCollection) {
        // only the [L]ist type preserves the order
        return 'L';
    }
    if (property_metadata_model_1.hasGenericType(propertyMetadata) /* aka ItemType */) {
        // generic type of Set is defined, so decide based on the generic type which db set type should be used
        if (util_1.isBufferType(propertyMetadata.typeInfo.genericType)) {
            return 'BS';
        }
        switch (propertyMetadata.typeInfo.genericType) {
            case String:
                return 'SS';
            case Number:
                return 'NS';
            default:
                // fallback to list if the type is not one of String or Number
                return 'L';
        }
    }
    // by value (But we know, how to parse it (array or set) which differs from 'detectCollectionTypeFromValue')
    if (explicitType === Array) {
        return 'L';
    }
    if ([...propertyValue].length === 0) {
        /*
         * an empty Set will not be persisted so we just return an arbitrary Set type, it is only important that it is one of
         * S(et)
         */
        return 'SS';
    }
    else {
        const { homogeneous, type } = util_1.isHomogeneous(propertyValue);
        if (homogeneous) {
            switch (type) {
                case 'S':
                    return 'SS';
                case 'N':
                    return 'NS';
                case 'B':
                    return 'BS';
            }
        }
        return 'L';
    }
}
//# sourceMappingURL=collection.mapper.js.map