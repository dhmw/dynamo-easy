/**
 * @module decorators
 */
import { IndexType } from './index-type.enum';
import { initOrUpdateIndex } from './util';
/**
 * decorator to use property as GSI partition key
 */
export function GSIPartitionKey(indexName) {
    return function (target, propertyKey) {
        if (typeof propertyKey === 'string') {
            initOrUpdateIndex(IndexType.GSI, { name: indexName, keyType: 'HASH' }, target, propertyKey);
        }
    };
}
//# sourceMappingURL=gsi-partition-key.decorator.js.map