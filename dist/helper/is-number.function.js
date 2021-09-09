"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_tag_function_1 = require("./get-tag.function");
const tag_enum_1 = require("./tag.enum");
/**
 * @return Returns true for any value where typeof equals 'number' or an object created with Number constructor
 */
function isNumber(value) {
    return typeof value === 'number' || get_tag_function_1.getTag(value) === tag_enum_1.Tag.NUMBER;
}
exports.isNumber = isNumber;
//# sourceMappingURL=is-number.function.js.map