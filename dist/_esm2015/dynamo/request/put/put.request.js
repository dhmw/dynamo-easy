import { createLogger } from '../../../logger/logger';
import { toDb } from '../../../mapper/mapper';
import { createIfNotExistsCondition } from '../../expression/create-if-not-exists-condition.function';
import { WriteRequest } from '../write.request';
/**
 * Request class for the PutItem operation.
 */
export class PutRequest extends WriteRequest {
    constructor(dynamoDBWrapper, modelClazz, item) {
        super(dynamoDBWrapper, modelClazz);
        this.logger = createLogger('dynamo.request.PutRequest', modelClazz);
        this.params.Item = toDb(item, this.modelClazz);
    }
    /**
     * Adds a condition expression to the request, which makes sure the item will only be saved if the id does not exist
     * @param predicate if false is provided nothing happens (it does NOT remove the condition)
     */
    ifNotExists(predicate = true) {
        if (predicate) {
            this.onlyIf(...createIfNotExistsCondition(this.metadata));
        }
        return this;
    }
    returnValues(returnValues) {
        this.params.ReturnValues = returnValues;
        return this;
    }
    doRequest(params) {
        return this.dynamoDBWrapper.putItem(params);
    }
}
//# sourceMappingURL=put.request.js.map