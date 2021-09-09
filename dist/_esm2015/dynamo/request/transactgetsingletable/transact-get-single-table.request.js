import { createToKeyFn, fromDb } from '../../../mapper/mapper';
import { BaseRequest } from '../base.request';
/**
 * Request class for TransactGetItems operation which supports a single model class only.
 */
export class TransactGetSingleTableRequest extends BaseRequest {
    constructor(dynamoDBWrapper, modelClazz, keys) {
        super(dynamoDBWrapper, modelClazz);
        this.mapResponse = (response) => {
            return {
                ConsumedCapacity: response.ConsumedCapacity,
                Items: (response.Responses || []).map((item) => fromDb(item.Item, this.modelClazz)),
            };
        };
        this.params.TransactItems = keys.map((key) => ({
            Get: {
                TableName: this.tableName,
                Key: createToKeyFn(this.modelClazz)(key),
            },
        }));
    }
    /**
     * fetch all entries and return the raw response (without parsing the attributes to js objects)
     */
    execNoMap() {
        return this.dynamoDBWrapper.transactGetItems(this.params);
    }
    execFullResponse() {
        return this.dynamoDBWrapper.transactGetItems(this.params).then(this.mapResponse);
    }
    /**
     * execute request and return the parsed items
     */
    exec() {
        return this.dynamoDBWrapper
            .transactGetItems(this.params)
            .then(this.mapResponse)
            .then((r) => r.Items);
    }
}
//# sourceMappingURL=transact-get-single-table.request.js.map