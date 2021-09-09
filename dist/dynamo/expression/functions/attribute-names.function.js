"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const attribute_names_const_1 = require("./attribute-names.const");
// problem: we only get the metadata from the last property -> but we need it for all properties in the chain (prop1.prop2.prop3)
/**
 * @hidden
 */
function resolveAttributeNames(attributePath, metadata) {
    let placeholder;
    // tslint:disable-next-line:no-shadowed-variable
    const attributeNames = {};
    if (new RegExp(attribute_names_const_1.NESTED_ATTR_PATH_REGEX).test(attributePath)) {
        const regex = new RegExp(attribute_names_const_1.NESTED_ATTR_PATH_CAPTURED_REGEX);
        // nested attribute with document path (map or list)
        const currentPath = [];
        let regExpResult;
        const namePlaceholders = [];
        // tslint:disable-next-line:no-conditional-assignment
        while ((regExpResult = regex.exec(attributePath)) !== null) {
            // path part is pos 1 - full match would be 0
            const pathPart = regExpResult[1];
            currentPath.push(regExpResult[1]);
            const collectionIndex = regExpResult[2];
            const propertyMetadata = metadata && metadata.forProperty(currentPath.join('.'));
            attributeNames[`#${pathPart}`] = propertyMetadata ? propertyMetadata.nameDb : pathPart;
            if (collectionIndex !== undefined) {
                namePlaceholders.push(`#${pathPart}[${collectionIndex}]`);
            }
            else {
                namePlaceholders.push(`#${pathPart}`);
            }
        }
        placeholder = namePlaceholders.join('.');
    }
    else {
        // top level attribute
        const propertyMetadata = metadata && metadata.forProperty(attributePath);
        attributeNames[`#${attributePath}`] = propertyMetadata ? propertyMetadata.nameDb : attributePath;
        placeholder = `#${attributePath}`;
    }
    return {
        placeholder,
        attributeNames,
    };
}
exports.resolveAttributeNames = resolveAttributeNames;
//# sourceMappingURL=attribute-names.function.js.map