"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module expression
 */
const attribute_name_replacer_function_1 = require("./attribute-name-replacer.function");
/**
 * @hidden
 */
exports.BRACED_INDEX_REGEX = /\[(\d+)]/g;
/**
 * Creates a unique attribute value placeholder name to use in the expression
 *
 * @returns {string} The unique attribute value placeholder name in respect to the given existing value names (no duplicates allowed)
 * @hidden
 */
function uniqueAttributeValueName(key, existingValueNames) {
    key = key.replace(/\./g, '__').replace(exports.BRACED_INDEX_REGEX, attribute_name_replacer_function_1.attributeNameReplacer);
    let potentialName = `:${key}`;
    let idx = 1;
    if (existingValueNames && existingValueNames.length) {
        while (existingValueNames.includes(potentialName)) {
            idx++;
            potentialName = `:${key}_${idx}`;
        }
    }
    return potentialName;
}
exports.uniqueAttributeValueName = uniqueAttributeValueName;
//# sourceMappingURL=unique-attribute-value-name.function.js.map