import { getTableName } from '../get-table-name.function';
import { BaseRequest } from './base.request';
/**
 * abstract class for all requests types that operate on exactly one dynamo table.
 * basically just sets the TableName info on input params.
 */
export class StandardRequest extends BaseRequest {
    constructor(dynamoDBWrapper, modelClazz) {
        super(dynamoDBWrapper, modelClazz);
        this.params.TableName = getTableName(this.metadata);
    }
}
//# sourceMappingURL=standard.request.js.map