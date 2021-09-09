import * as tslib_1 from "tslib";
import { getMetadataType } from '../../util';
import { KEY_PROPERTY } from './key-property.const';
/**
 * @hidden
 */
export function initOrUpdateProperty(propertyMetadata, target, propertyKey) {
    if (propertyMetadata === void 0) { propertyMetadata = {}; }
    // the new or updated property
    var property;
    // Update the attribute array
    var properties = Reflect.getMetadata(KEY_PROPERTY, target.constructor) || [];
    var existingProperty = properties.find(function (p) { return p.name === propertyKey; });
    if (existingProperty) {
        // create new property with merged options
        property = tslib_1.__assign({}, existingProperty, propertyMetadata);
        // remove existing from array
        properties = properties.filter(function (p) { return p !== existingProperty; });
    }
    else {
        // add new options
        property = createNewProperty(propertyMetadata, target, propertyKey);
    }
    Reflect.defineMetadata(KEY_PROPERTY, tslib_1.__spread(properties, [property]), target.constructor);
}
/**
 * @hidden
 */
function createNewProperty(propertyOptions, target, propertyKey) {
    if (propertyOptions === void 0) { propertyOptions = {}; }
    var propertyType = getMetadataType(target, propertyKey);
    if (propertyType === undefined) {
        throw new Error('make sure you have enabled the typescript compiler options which enable us to work with decorators (see doc)');
    }
    var typeInfo = { type: propertyType };
    propertyOptions = tslib_1.__assign({ name: propertyKey, nameDb: propertyKey, typeInfo: typeInfo }, propertyOptions);
    return propertyOptions;
}
//# sourceMappingURL=init-or-update-property.function.js.map