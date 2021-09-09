"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module mapper
 */
const property_metadata_model_1 = require("../../decorator/metadata/property-metadata.model");
function enumToDb(value, propertyMetadata) {
    if (Number.isInteger(value)) {
        if (property_metadata_model_1.hasGenericType(propertyMetadata) && propertyMetadata.typeInfo.genericType[value] === undefined) {
            throw new Error(`${JSON.stringify(value)} is not a valid value for enum ${propertyMetadata.typeInfo.genericType}`);
        }
        return { N: value.toString() };
    }
    else {
        throw new Error(`only integer is a supported value for an enum, given value: ${JSON.stringify(value)}`);
    }
}
function enumFromDb(attributeValue, propertyMetadata) {
    if (!isNaN(parseInt(attributeValue.N, 10))) {
        const enumValue = parseInt(attributeValue.N, 10);
        if (propertyMetadata && propertyMetadata.typeInfo && propertyMetadata.typeInfo.genericType) {
            if (propertyMetadata.typeInfo.genericType[enumValue] === undefined) {
                throw new Error(`${enumValue} is not a valid value for enum ${JSON.stringify(propertyMetadata.typeInfo.genericType)}`);
            }
        }
        return enumValue;
    }
    else {
        throw new Error(`make sure the value is a N(umber), which is the only supported for EnumMapper right now, given attributeValue: ${JSON.stringify(attributeValue)}`);
    }
}
/**
 * Enums are mapped to numbers by default.
 * ensures given value is from enum, if enum was specified as generic type
 */
exports.EnumMapper = {
    fromDb: enumFromDb,
    toDb: enumToDb,
};
//# sourceMappingURL=enum.mapper.js.map