import { getTag } from './get-tag.function';
import { Tag } from './tag.enum';
/**
 * @return Returns true for any value where typeof equals 'string' or an object created with String constructor
 */
export function isBoolean(value) {
    return typeof value === 'boolean' || getTag(value) === Tag.BOOLEAN;
}
//# sourceMappingURL=is-boolean.function.js.map