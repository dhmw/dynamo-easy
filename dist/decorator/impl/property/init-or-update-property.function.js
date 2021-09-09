"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../util");
const key_property_const_1 = require("./key-property.const");
/**
 * @hidden
 */
function initOrUpdateProperty(propertyMetadata = {}, target, propertyKey) {
    // the new or updated property
    let property;
    // Update the attribute array
    let properties = Reflect.getMetadata(key_property_const_1.KEY_PROPERTY, target.constructor) || [];
    const existingProperty = properties.find((p) => p.name === propertyKey);
    if (existingProperty) {
        // create new property with merged options
        property = Object.assign({}, existingProperty, propertyMetadata);
        // remove existing from array
        properties = properties.filter((p) => p !== existingProperty);
    }
    else {
        // add new options
        property = createNewProperty(propertyMetadata, target, propertyKey);
    }
    Reflect.defineMetadata(key_property_const_1.KEY_PROPERTY, [...properties, property], target.constructor);
}
exports.initOrUpdateProperty = initOrUpdateProperty;
/**
 * @hidden
 */
function createNewProperty(propertyOptions = {}, target, propertyKey) {
    const propertyType = util_1.getMetadataType(target, propertyKey);
    if (propertyType === undefined) {
        throw new Error('make sure you have enabled the typescript compiler options which enable us to work with decorators (see doc)');
    }
    const typeInfo = { type: propertyType };
    propertyOptions = Object.assign({ name: propertyKey, nameDb: propertyKey, typeInfo }, propertyOptions);
    return propertyOptions;
}
//# sourceMappingURL=init-or-update-property.function.js.map