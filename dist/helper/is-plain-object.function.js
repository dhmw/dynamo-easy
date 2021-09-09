"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// https://github.com/jonschlinkert/is-plain-object
const get_tag_function_1 = require("./get-tag.function");
const tag_enum_1 = require("./tag.enum");
function isObject(val) {
    return val != null && typeof val === 'object' && Array.isArray(val) === false;
}
function isObjectObject(o) {
    return isObject(o) === true && get_tag_function_1.getTag(o) === tag_enum_1.Tag.OBJECT;
}
function isPlainObject(o) {
    return !(!isObjectObject(o) ||
        typeof o.constructor !== 'function' ||
        !isObjectObject(o.constructor.prototype) ||
        !o.constructor.prototype.hasOwnProperty('isPrototypeOf'));
}
exports.isPlainObject = isPlainObject;
//# sourceMappingURL=is-plain-object.function.js.map