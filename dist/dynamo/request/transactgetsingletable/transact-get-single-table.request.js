"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mapper_1 = require("../../../mapper/mapper");
const base_request_1 = require("../base.request");
/**
 * Request class for TransactGetItems operation which supports a single model class only.
 */
class TransactGetSingleTableRequest extends base_request_1.BaseRequest {
    constructor(dynamoDBWrapper, modelClazz, keys) {
        super(dynamoDBWrapper, modelClazz);
        this.mapResponse = (response) => {
            return {
                ConsumedCapacity: response.ConsumedCapacity,
                Items: (response.Responses || []).map((item) => mapper_1.fromDb(item.Item, this.modelClazz)),
            };
        };
        this.params.TransactItems = keys.map((key) => ({
            Get: {
                TableName: this.tableName,
                Key: mapper_1.createToKeyFn(this.modelClazz)(key),
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
exports.TransactGetSingleTableRequest = TransactGetSingleTableRequest;
//# sourceMappingURL=transact-get-single-table.request.js.map