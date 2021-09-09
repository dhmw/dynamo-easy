"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_tag_function_1 = require("./get-tag.function");
const tag_enum_1 = require("./tag.enum");
/**
 * @return Returns true for any value where typeof equals 'string' or an object created with String constructor
 */
function isString(value) {
    return typeof value === 'string' || get_tag_function_1.getTag(value) === tag_enum_1.Tag.STRING;
}
exports.isString = isString;
//# sourceMappingURL=is-string.function.js.map