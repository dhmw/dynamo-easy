"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metadata_for_model_function_1 = require("../../decorator/metadata/metadata-for-model.function");
const random_exponential_backoff_timer_generator_1 = require("../../helper/random-exponential-backoff-timer.generator");
const mapper_1 = require("../../mapper/mapper");
const dynamo_db_wrapper_1 = require("../dynamo-db-wrapper");
const get_table_name_function_1 = require("../get-table-name.function");
const batch_get_utils_1 = require("./batch-get-utils");
const batch_get_const_1 = require("./batch-get.const");
/**
 * Request class for the BatchGetItem operation. Read multiple items from one or more tables.
 */
class BatchGetRequest {
    constructor(dynamoDB) {
        this.tables = new Map();
        this.itemCounter = 0;
        this.mapResponse = (response) => {
            let Responses = {};
            if (response.Responses && Object.keys(response.Responses).length) {
                Responses = Object.entries(response.Responses).reduce((u, [key, val]) => {
                    u[key] = val.map((attributes) => mapper_1.fromDb(attributes, this.tables.get(key)));
                    return u;
                }, {});
            }
            return {
                ConsumedCapacity: response.ConsumedCapacity,
                UnprocessedKeys: response.UnprocessedKeys,
                Responses,
            };
        };
        this.dynamoDBWrapper = new dynamo_db_wrapper_1.DynamoDbWrapper(dynamoDB);
        this.params = {
            RequestItems: {},
        };
    }
    get dynamoDB() {
        return this.dynamoDBWrapper.dynamoDB;
    }
    /**
     * return ConsumedCapacity of the corresponding tables in the response
     */
    returnConsumedCapacity(level) {
        this.params.ReturnConsumedCapacity = level;
        return this;
    }
    /**
     * read items of model by key
     * @param modelClazz the corresponding ModelConstructor
     * @param keys an array of partials of T that contains PartitionKey and SortKey (if necessary). Throws if missing.
     * @param consistentRead set to true so the operation uses strongly consistent reads, default false
     */
    forModel(modelClazz, keys, consistentRead = false) {
        // check if modelClazz is really an @Model() decorated class
        const metadata = metadata_for_model_function_1.metadataForModel(modelClazz);
        if (!metadata.modelOptions) {
            throw new Error('given ModelConstructor has no @Model decorator');
        }
        // check if table was already used in this request
        const tableName = get_table_name_function_1.getTableName(metadata);
        if (this.tables.has(tableName)) {
            throw new Error('table name already exists, please provide all the keys for the same table at once');
        }
        this.tables.set(tableName, modelClazz);
        // check if keys to add do not exceed max count
        if (this.itemCounter + keys.length > batch_get_const_1.BATCH_GET_MAX_REQUEST_ITEM_COUNT) {
            throw new Error(`you can request at max ${batch_get_const_1.BATCH_GET_MAX_REQUEST_ITEM_COUNT} items per request`);
        }
        this.params.RequestItems[tableName] = {
            Keys: keys.map(mapper_1.createToKeyFn(modelClazz)),
            ConsistentRead: consistentRead,
        };
        this.itemCounter += keys.length;
        return this;
    }
    /**
     * execute the request and return the raw response (without parsing the attributes to js objects)
     * @param backoffTimer when unprocessed items are returned the next value of backoffTimer is used to determine how many time slots to wait before doing the next request
     * @param throttleTimeSlot the duration of a time slot in ms
     */
    execNoMap(backoffTimer = random_exponential_backoff_timer_generator_1.randomExponentialBackoffTimer, throttleTimeSlot = batch_get_const_1.BATCH_GET_DEFAULT_TIME_SLOT) {
        return this.fetch(backoffTimer, throttleTimeSlot);
    }
    /**
     * execute and return full response with the mapped js objects per table
     * @param backoffTimer when unprocessed items are returned the next value of backoffTimer is used to determine how many time slots to wait before doing the next request
     * @param throttleTimeSlot the duration of a time slot in ms
     */
    execFullResponse(backoffTimer = random_exponential_backoff_timer_generator_1.randomExponentialBackoffTimer, throttleTimeSlot = batch_get_const_1.BATCH_GET_DEFAULT_TIME_SLOT) {
        return this.fetch(backoffTimer, throttleTimeSlot).then(this.mapResponse);
    }
    /**
     * execute and return the parsed items per table
     * @param backoffTimer when unprocessed items are returned the next value of backoffTimer is used to determine how many time slots to wait before doing the next request
     * @param throttleTimeSlot the duration of a time slot in ms
     */
    exec(backoffTimer = random_exponential_backoff_timer_generator_1.randomExponentialBackoffTimer, throttleTimeSlot = batch_get_const_1.BATCH_GET_DEFAULT_TIME_SLOT) {
        return this.fetch(backoffTimer, throttleTimeSlot)
            .then(this.mapResponse)
            .then((r) => r.Responses);
    }
    fetch(backoffTimer = random_exponential_backoff_timer_generator_1.randomExponentialBackoffTimer, throttleTimeSlot = batch_get_const_1.BATCH_GET_DEFAULT_TIME_SLOT) {
        return batch_get_utils_1.batchGetItemsFetchAll(this.dynamoDBWrapper, Object.assign({}, this.params), backoffTimer(), throttleTimeSlot);
    }
}
exports.BatchGetRequest = BatchGetRequest;
//# sourceMappingURL=batch-get.request.js.map