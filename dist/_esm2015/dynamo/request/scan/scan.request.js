import { createLogger } from '../../../logger/logger';
import { ReadManyRequest } from '../read-many.request';
/**
 * Request class for the Scan operation.
 */
export class ScanRequest extends ReadManyRequest {
    constructor(dynamoDBWrapper, modelClazz) {
        super(dynamoDBWrapper, modelClazz);
        this.logger = createLogger('dynamo.request.ScanRequest', modelClazz);
    }
    doRequest(params) {
        return this.dynamoDBWrapper.scan(params);
    }
}
//# sourceMappingURL=scan.request.js.map