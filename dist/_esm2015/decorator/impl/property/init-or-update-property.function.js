import { getMetadataType } from '../../util';
import { KEY_PROPERTY } from './key-property.const';
/**
 * @hidden
 */
export function initOrUpdateProperty(propertyMetadata = {}, target, propertyKey) {
    // the new or updated property
    let property;
    // Update the attribute array
    let properties = Reflect.getMetadata(KEY_PROPERTY, target.constructor) || [];
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
    Reflect.defineMetadata(KEY_PROPERTY, [...properties, property], target.constructor);
}
/**
 * @hidden
 */
function createNewProperty(propertyOptions = {}, target, propertyKey) {
    const propertyType = getMetadataType(target, propertyKey);
    if (propertyType === undefined) {
        throw new Error('make sure you have enabled the typescript compiler options which enable us to work with decorators (see doc)');
    }
    const typeInfo = { type: propertyType };
    propertyOptions = Object.assign({ name: propertyKey, nameDb: propertyKey, typeInfo }, propertyOptions);
    return propertyOptions;
}
//# sourceMappingURL=init-or-update-property.function.js.map