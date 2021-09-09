"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const init_or_update_property_function_1 = require("../property/init-or-update-property.function");
const key_property_const_1 = require("../property/key-property.const");
const index_type_enum_1 = require("./index-type.enum");
/**
 * @hidden
 */
function initOrUpdateIndex(indexType, indexData, target, propertyKey) {
    const properties = Reflect.getMetadata(key_property_const_1.KEY_PROPERTY, target.constructor) || [];
    const existingProperty = properties.find((property) => property.name === propertyKey);
    let propertyMetadata;
    switch (indexType) {
        case index_type_enum_1.IndexType.GSI:
            propertyMetadata = initOrUpdateGSI(existingProperty && existingProperty.keyForGSI ? existingProperty.keyForGSI : {}, indexData);
            break;
        case index_type_enum_1.IndexType.LSI:
            propertyMetadata = initOrUpdateLSI(existingProperty && existingProperty.sortKeyForLSI ? existingProperty.sortKeyForLSI : [], indexData);
            break;
        // `default` is actually unnecessary - but could only be removed by cast or nonNullAssertion of `propertyMetadata`
        default:
            throw new Error(`unsupported index type ${indexType}`);
    }
    init_or_update_property_function_1.initOrUpdateProperty(propertyMetadata, target, propertyKey);
}
exports.initOrUpdateIndex = initOrUpdateIndex;
/**
 * @hidden
 */
function initOrUpdateGSI(indexes, indexData) {
    if (indexes[indexData.name]) {
        // TODO INVESTIGATE when we throw an error we have a problem where multiple different classes extend one base class, this will be executed multiple times
        // throw new Error(
        //   'the property with name is already registered as key for index - one property can only define one key per index'
        // )
    }
    else {
        indexes[indexData.name] = indexData.keyType;
    }
    return { keyForGSI: indexes };
}
/**
 * @hidden
 */
function initOrUpdateLSI(indexes, indexData) {
    indexes.push(indexData.name);
    return { sortKeyForLSI: indexes };
}
//# sourceMappingURL=util.js.map