import { createLogger } from '../../../logger/logger';
import { createKeyAttributes } from '../../../mapper/mapper';
import { prepareAndAddUpdateExpressions } from '../../expression/prepare-and-add-update-expressions.function';
import { addUpdate } from '../../expression/request-expression-builder';
import { WriteRequest } from '../write.request';
/**
 * Request class for the UpdateItem operation.
 */
export class UpdateRequest extends WriteRequest {
    constructor(dynamoDBWrapper, modelClazz, partitionKey, sortKey) {
        super(dynamoDBWrapper, modelClazz);
        this.logger = createLogger('dynamo.request.UpdateRequest', modelClazz);
        this.params.Key = createKeyAttributes(this.metadata, partitionKey, sortKey);
    }
    /**
     * create and add a single update operation
     * @example req.updateAttribute('path.to.attr').set('newVal')
     */
    updateAttribute(attributePath) {
        return addUpdate(attributePath, this, this.metadata);
    }
    /**
     * add multiple update operations comma separated
     * @example req.operations(update('path.to.attr).set('newVal'), ... )
     */
    operations(...updateDefFns) {
        prepareAndAddUpdateExpressions(this.metadata, this.params, updateDefFns);
        return this;
    }
    returnValues(returnValues) {
        this.params.ReturnValues = returnValues;
        return this;
    }
    doRequest(params) {
        return this.dynamoDBWrapper.updateItem(this.params);
    }
}
//# sourceMappingURL=update.request.js.map