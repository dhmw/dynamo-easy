import { createKeyAttributes } from '../../mapper/mapper';
import { TransactBaseOperation } from './transact-base-operation';
/**
 * TransactOperation class for transactional delete items
 */
export class TransactDelete extends TransactBaseOperation {
    constructor(modelClazz, partitionKey, sortKey) {
        super(modelClazz);
        this.params.Key = createKeyAttributes(this.metadata, partitionKey, sortKey);
    }
    get transactItem() {
        return {
            Delete: Object.assign({}, this.params),
        };
    }
}
//# sourceMappingURL=transact-delete.js.map