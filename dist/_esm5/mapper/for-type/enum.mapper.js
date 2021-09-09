/**
 * @module mapper
 */
import { hasGenericType } from '../../decorator/metadata/property-metadata.model';
function enumToDb(value, propertyMetadata) {
    if (Number.isInteger(value)) {
        if (hasGenericType(propertyMetadata) && propertyMetadata.typeInfo.genericType[value] === undefined) {
            throw new Error(JSON.stringify(value) + " is not a valid value for enum " + propertyMetadata.typeInfo.genericType);
        }
        return { N: value.toString() };
    }
    else {
        throw new Error("only integer is a supported value for an enum, given value: " + JSON.stringify(value));
    }
}
function enumFromDb(attributeValue, propertyMetadata) {
    if (!isNaN(parseInt(attributeValue.N, 10))) {
        var enumValue = parseInt(attributeValue.N, 10);
        if (propertyMetadata && propertyMetadata.typeInfo && propertyMetadata.typeInfo.genericType) {
            if (propertyMetadata.typeInfo.genericType[enumValue] === undefined) {
                throw new Error(enumValue + " is not a valid value for enum " + JSON.stringify(propertyMetadata.typeInfo.genericType));
            }
        }
        return enumValue;
    }
    else {
        throw new Error("make sure the value is a N(umber), which is the only supported for EnumMapper right now, given attributeValue: " + JSON.stringify(attributeValue));
    }
}
/**
 * Enums are mapped to numbers by default.
 * ensures given value is from enum, if enum was specified as generic type
 */
export var EnumMapper = {
    fromDb: enumFromDb,
    toDb: enumToDb,
};
//# sourceMappingURL=enum.mapper.js.map