/**
 * @module expression
 */
import { hasSortKey } from '../../decorator/metadata/metadata';
import { attribute } from './logical-operator/public.api';
/**
 * @hidden
 */
export function createIfNotExistsCondition(metadata) {
    const conditionDefFns = [
        attribute(metadata.getPartitionKey()).attributeNotExists(),
    ];
    if (hasSortKey(metadata)) {
        conditionDefFns.push(attribute(metadata.getSortKey()).attributeNotExists());
    }
    return conditionDefFns;
}
//# sourceMappingURL=create-if-not-exists-condition.function.js.map