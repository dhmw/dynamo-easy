import { NESTED_ATTR_PATH_CAPTURED_REGEX, NESTED_ATTR_PATH_REGEX } from './attribute-names.const';
// problem: we only get the metadata from the last property -> but we need it for all properties in the chain (prop1.prop2.prop3)
/**
 * @hidden
 */
export function resolveAttributeNames(attributePath, metadata) {
    var placeholder;
    // tslint:disable-next-line:no-shadowed-variable
    var attributeNames = {};
    if (new RegExp(NESTED_ATTR_PATH_REGEX).test(attributePath)) {
        var regex = new RegExp(NESTED_ATTR_PATH_CAPTURED_REGEX);
        // nested attribute with document path (map or list)
        var currentPath = [];
        var regExpResult = void 0;
        var namePlaceholders = [];
        // tslint:disable-next-line:no-conditional-assignment
        while ((regExpResult = regex.exec(attributePath)) !== null) {
            // path part is pos 1 - full match would be 0
            var pathPart = regExpResult[1];
            currentPath.push(regExpResult[1]);
            var collectionIndex = regExpResult[2];
            var propertyMetadata = metadata && metadata.forProperty(currentPath.join('.'));
            attributeNames["#" + pathPart] = propertyMetadata ? propertyMetadata.nameDb : pathPart;
            if (collectionIndex !== undefined) {
                namePlaceholders.push("#" + pathPart + "[" + collectionIndex + "]");
            }
            else {
                namePlaceholders.push("#" + pathPart);
            }
        }
        placeholder = namePlaceholders.join('.');
    }
    else {
        // top level attribute
        var propertyMetadata = metadata && metadata.forProperty(attributePath);
        attributeNames["#" + attributePath] = propertyMetadata ? propertyMetadata.nameDb : attributePath;
        placeholder = "#" + attributePath;
    }
    return {
        placeholder: placeholder,
        attributeNames: attributeNames,
    };
}
//# sourceMappingURL=attribute-names.function.js.map