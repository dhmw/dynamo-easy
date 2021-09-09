import { createKeyAttributes } from '../../mapper/mapper';
import { TransactBaseOperation } from './transact-base-operation';
/**
 * TransactOperation class for transactional condition checks.
 */
export class TransactConditionCheck extends TransactBaseOperation {
    constructor(modelClazz, partitionKey, sortKey) {
        super(modelClazz);
        this.params.Key = createKeyAttributes(this.metadata, partitionKey, sortKey);
    }
    get transactItem() {
        return {
            ConditionCheck: Object.assign({}, this.params),
        };
    }
}
//# sourceMappingURL=transact-condition-check.js.map