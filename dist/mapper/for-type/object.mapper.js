"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module mapper
 */
const property_metadata_model_1 = require("../../decorator/metadata/property-metadata.model");
const mapper_1 = require("../mapper");
function objectFromDb(val, propertyMetadata) {
    // todo: shouldn't we check for existence off 'M' here? (and throw if undefined)
    if (property_metadata_model_1.hasType(propertyMetadata)) {
        return mapper_1.fromDb(val.M, propertyMetadata.typeInfo.type);
    }
    else {
        return mapper_1.fromDb(val.M);
    }
}
function objectToDb(modelValue, propertyMetadata) {
    let value;
    if (property_metadata_model_1.hasType(propertyMetadata)) {
        value = mapper_1.toDb(modelValue, propertyMetadata.typeInfo.type);
    }
    else {
        value = mapper_1.toDb(modelValue);
    }
    return { M: value };
}
exports.ObjectMapper = {
    fromDb: objectFromDb,
    toDb: objectToDb,
};
//# sourceMappingURL=object.mapper.js.map