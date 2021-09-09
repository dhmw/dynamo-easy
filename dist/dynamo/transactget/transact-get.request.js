"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metadata_for_model_function_1 = require("../../decorator/metadata/metadata-for-model.function");
const mapper_1 = require("../../mapper/mapper");
const dynamo_db_wrapper_1 = require("../dynamo-db-wrapper");
const get_table_name_function_1 = require("../get-table-name.function");
/**
 * max count of request items allowed by aws
 */
const MAX_REQUEST_ITEM_COUNT = 10;
/**
 * Request class for the TransactGetItems operation. Read up to 10 items from one or more tables in a transaction.
 */
class TransactGetRequest {
    constructor(dynamoDB) {
        this.tables = [];
        this.mapResponse = (response) => {
            const Items = response.Responses && Object.keys(response.Responses).length
                ? response.Responses.map((item, ix) => mapper_1.fromDb(item.Item, this.tables[ix]))
                : [];
            return {
                ConsumedCapacity: response.ConsumedCapacity,
                Items,
            };
        };
        this.dynamoDBWrapper = new dynamo_db_wrapper_1.DynamoDbWrapper(dynamoDB);
        this.params = {
            TransactItems: [],
        };
    }
    get dynamoDB() {
        return this.dynamoDBWrapper.dynamoDB;
    }
    /**
     * read item of model by key
     * @param modelClazz the corresponding ModelConstructor
     * @param key partial of T that contains PartitionKey and SortKey (if necessary). Throws if missing.
     */
    forModel(modelClazz, key) {
        // check if modelClazz is really an @Model() decorated class
        const metadata = metadata_for_model_function_1.metadataForModel(modelClazz);
        if (!metadata.modelOptions) {
            throw new Error('given ModelConstructor has no @Model decorator');
        }
        this.tables.push(modelClazz);
        // check if table was already used in this request
        const tableName = get_table_name_function_1.getTableName(metadata);
        // check if keys to add do not exceed max count
        if (this.params.TransactItems.length + 1 > MAX_REQUEST_ITEM_COUNT) {
            throw new Error(`you can request at max ${MAX_REQUEST_ITEM_COUNT} items per request`);
        }
        this.params.TransactItems.push({
            Get: {
                TableName: tableName,
                Key: mapper_1.createToKeyFn(modelClazz)(key),
            },
        });
        return this;
    }
    /**
     * return ConsumedCapacity of the corresponding tables in the response
     */
    returnConsumedCapacity(level) {
        this.params.ReturnConsumedCapacity = level;
        return this;
    }
    /**
     * execute request and return the raw response (without parsing the attributes to js objects)
     */
    execNoMap() {
        return this.dynamoDBWrapper.transactGetItems(this.params);
    }
    /**
     * execute request and return full response with the mapped js objects.
     */
    execFullResponse() {
        return this.dynamoDBWrapper.transactGetItems(this.params).then(this.mapResponse);
    }
    /**
     * execute request and return the parsed items.
     */
    exec() {
        return this.dynamoDBWrapper
            .transactGetItems(this.params)
            .then(this.mapResponse)
            .then((r) => r.Items);
    }
}
exports.TransactGetRequest = TransactGetRequest;
//# sourceMappingURL=transact-get.request.js.map