import { toDb } from '../../mapper/mapper';
import { createIfNotExistsCondition } from '../expression/create-if-not-exists-condition.function';
import { TransactBaseOperation } from './transact-base-operation';
/**
 * TransactOperation class for transactional put items.
 */
export class TransactPut extends TransactBaseOperation {
    constructor(modelClazz, item) {
        super(modelClazz);
        this.params.Item = toDb(item, this.modelClazz);
    }
    /**
     * Adds a condition expression to the request, which makes sure the item will only be saved if the id does not exist
     */
    ifNotExists(predicate = true) {
        if (predicate) {
            this.onlyIf(...createIfNotExistsCondition(this.metadata));
        }
        return this;
    }
    get transactItem() {
        return {
            Put: Object.assign({}, this.params),
        };
    }
}
//# sourceMappingURL=transact-put.js.map