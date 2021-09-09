import { createLogger } from '../../../logger/logger';
import { createKeyAttributes } from '../../../mapper/mapper';
import { WriteRequest } from '../write.request';
/**
 * Request class for the DeleteItem operation.
 */
export class DeleteRequest extends WriteRequest {
    constructor(dynamoDBWrapper, modelClazz, partitionKey, sortKey) {
        super(dynamoDBWrapper, modelClazz);
        this.logger = createLogger('dynamo.request.DeleteRequest', modelClazz);
        this.params.Key = createKeyAttributes(this.metadata, partitionKey, sortKey);
    }
    returnValues(returnValues) {
        this.params.ReturnValues = returnValues;
        return this;
    }
    doRequest(params) {
        return this.dynamoDBWrapper.deleteItem(params);
    }
}
//# sourceMappingURL=delete.request.js.map