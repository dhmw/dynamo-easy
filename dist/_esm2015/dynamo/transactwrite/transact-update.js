import { createKeyAttributes } from '../../mapper/mapper';
import { prepareAndAddUpdateExpressions } from '../expression/prepare-and-add-update-expressions.function';
import { addUpdate } from '../expression/request-expression-builder';
import { TransactBaseOperation } from './transact-base-operation';
/**
 * TransactOperation class for transactional update items.
 */
export class TransactUpdate extends TransactBaseOperation {
    constructor(modelClazz, partitionKey, sortKey) {
        super(modelClazz);
        this.params.Key = createKeyAttributes(this.metadata, partitionKey, sortKey);
    }
    /**
     * create and add a single update operation
     * @example updtTrans.updateAttribute('path.to.attr').set('newVal')
     */
    updateAttribute(attributePath) {
        return addUpdate(attributePath, this, this.metadata);
    }
    /**
     * add multiple update ops
     * @example updtTrans.operations(update('path.to.attr).set('newVal'), ... )
     */
    operations(...updateDefFns) {
        prepareAndAddUpdateExpressions(this.metadata, this.params, updateDefFns);
        return this;
    }
    get transactItem() {
        return {
            Update: Object.assign({}, this.params),
        };
    }
}
//# sourceMappingURL=transact-update.js.map