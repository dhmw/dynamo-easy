// https://github.com/jonschlinkert/is-plain-object
import { getTag } from './get-tag.function';
import { Tag } from './tag.enum';
function isObject(val) {
    return val != null && typeof val === 'object' && Array.isArray(val) === false;
}
function isObjectObject(o) {
    return isObject(o) === true && getTag(o) === Tag.OBJECT;
}
export function isPlainObject(o) {
    return !(!isObjectObject(o) ||
        typeof o.constructor !== 'function' ||
        !isObjectObject(o.constructor.prototype) ||
        !o.constructor.prototype.hasOwnProperty('isPrototypeOf'));
}
//# sourceMappingURL=is-plain-object.function.js.map