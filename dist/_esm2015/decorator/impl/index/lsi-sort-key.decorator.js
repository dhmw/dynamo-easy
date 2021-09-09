/**
 * @module decorators
 */
import { IndexType } from './index-type.enum';
import { initOrUpdateIndex } from './util';
/**
 * Marks a property as the sort key attribute of a local secondary index (the partition key must be same as in base table)
 */
export function LSISortKey(indexName) {
    return (target, propertyKey) => {
        if (typeof propertyKey === 'string') {
            initOrUpdateIndex(IndexType.LSI, { name: indexName, keyType: 'RANGE' }, target, propertyKey);
        }
    };
}
//# sourceMappingURL=lsi-sort-key.decorator.js.map