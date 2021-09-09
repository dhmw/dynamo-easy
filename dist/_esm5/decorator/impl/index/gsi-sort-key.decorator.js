/**
 * @module decorators
 */
import { IndexType } from './index-type.enum';
import { initOrUpdateIndex } from './util';
/**
 * decorator to use property as GSI sort key
 */
export function GSISortKey(indexName) {
    return function (target, propertyKey) {
        if (typeof propertyKey === 'string') {
            initOrUpdateIndex(IndexType.GSI, { name: indexName, keyType: 'RANGE' }, target, propertyKey);
        }
    };
}
//# sourceMappingURL=gsi-sort-key.decorator.js.map