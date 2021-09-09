import { getTag } from './get-tag.function';
import { Tag } from './tag.enum';
/**
 * @return Returns true for any value where typeof equals 'number' or an object created with Number constructor
 */
export function isNumber(value) {
    return typeof value === 'number' || getTag(value) === Tag.NUMBER;
}
//# sourceMappingURL=is-number.function.js.map