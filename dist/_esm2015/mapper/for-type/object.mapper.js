/**
 * @module mapper
 */
import { hasType } from '../../decorator/metadata/property-metadata.model';
import { fromDb, toDb } from '../mapper';
function objectFromDb(val, propertyMetadata) {
    // todo: shouldn't we check for existence off 'M' here? (and throw if undefined)
    if (hasType(propertyMetadata)) {
        return fromDb(val.M, propertyMetadata.typeInfo.type);
    }
    else {
        return fromDb(val.M);
    }
}
function objectToDb(modelValue, propertyMetadata) {
    let value;
    if (hasType(propertyMetadata)) {
        value = toDb(modelValue, propertyMetadata.typeInfo.type);
    }
    else {
        value = toDb(modelValue);
    }
    return { M: value };
}
export const ObjectMapper = {
    fromDb: objectFromDb,
    toDb: objectToDb,
};
//# sourceMappingURL=object.mapper.js.map