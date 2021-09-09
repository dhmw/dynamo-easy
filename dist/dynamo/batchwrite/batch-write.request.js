"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const random_exponential_backoff_timer_generator_1 = require("../../helper/random-exponential-backoff-timer.generator");
const mapper_1 = require("../../mapper/mapper");
const dynamo_db_wrapper_1 = require("../dynamo-db-wrapper");
const get_table_name_function_1 = require("../get-table-name.function");
const batch_write_utils_1 = require("./batch-write-utils");
const batch_write_const_1 = require("./batch-write.const");
/**
 * Request class for the BatchWriteItem operation. Put or delete multiple items in one or more table.
 */
class BatchWriteRequest {
    constructor(dynamoDB) {
        this.itemCount = 0;
        this.createDeleteRequest = (modelClazz) => {
            const toKey = mapper_1.createToKeyFn(modelClazz);
            return (item) => ({ DeleteRequest: { Key: toKey(item) } });
        };
        this.createPutRequest = (modelClazz) => {
            return (item) => ({ PutRequest: { Item: mapper_1.toDb(item, modelClazz) } });
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
    returnConsumedCapacity(value) {
        this.params.ReturnConsumedCapacity = value;
        return this;
    }
    /**
     * return item collection metrics.
     */
    returnItemCollectionMetrics(value) {
        this.params.ReturnItemCollectionMetrics = value;
        return this;
    }
    /**
     * add keys for deletion
     * @param modelClazz the corresponding ModelConstructor
     * @param keys an array of partials of T that contains PartitionKey and SortKey (if necessary). Throws if missing.
     */
    delete(modelClazz, keys) {
        this.requestItems(modelClazz, keys.map(this.createDeleteRequest(modelClazz)));
        return this;
    }
    /**
     * add items to put
     * @param modelClazz the corresponding ModelConstructor
     * @param items the items to put
     */
    put(modelClazz, items) {
        this.requestItems(modelClazz, items.map(this.createPutRequest(modelClazz)));
        return this;
    }
    /**
     * execute request
     * @param backoffTimer generator for how much timeSlots should be waited before requesting next batch. only used when capacity was exceeded. default randomExponentialBackoffTimer
     * @param throttleTimeSlot defines how long one timeSlot is for throttling, default 1 second
     */
    exec(backoffTimer = random_exponential_backoff_timer_generator_1.randomExponentialBackoffTimer, throttleTimeSlot = batch_write_const_1.BATCH_WRITE_DEFAULT_TIME_SLOT) {
        return this.write(backoffTimer, throttleTimeSlot).then(() => {
            return;
        });
    }
    /**
     * execute request and return (last) response
     * @param backoffTimer generator for how much timeSlots should be waited before requesting next batch. only used when capacity was exceeded. default randomExponentialBackoffTimer
     * @param throttleTimeSlot defines how long one timeSlot is for throttling, default 1 second
     */
    execFullResponse(backoffTimer = random_exponential_backoff_timer_generator_1.randomExponentialBackoffTimer, throttleTimeSlot = batch_write_const_1.BATCH_WRITE_DEFAULT_TIME_SLOT) {
        return this.write(backoffTimer, throttleTimeSlot);
    }
    requestItems(modelClazz, items) {
        if (this.itemCount + items.length > batch_write_const_1.BATCH_WRITE_MAX_REQUEST_ITEM_COUNT) {
            throw new Error(`batch write takes at max ${batch_write_const_1.BATCH_WRITE_MAX_REQUEST_ITEM_COUNT} items`);
        }
        const tableName = get_table_name_function_1.getTableName(modelClazz);
        this.params.RequestItems[tableName] = this.params.RequestItems[tableName] || [];
        this.params.RequestItems[tableName].push(...items);
        this.itemCount += items.length;
    }
    write(backoffTimer, throttleTimeSlot) {
        return batch_write_utils_1.batchWriteItemsWriteAll(this.dynamoDBWrapper, Object.assign({}, this.params), backoffTimer(), throttleTimeSlot);
    }
}
exports.BatchWriteRequest = BatchWriteRequest;
//# sourceMappingURL=batch-write.request.js.map