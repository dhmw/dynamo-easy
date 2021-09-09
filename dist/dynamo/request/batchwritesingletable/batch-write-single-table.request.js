"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const random_exponential_backoff_timer_generator_1 = require("../../../helper/random-exponential-backoff-timer.generator");
const logger_1 = require("../../../logger/logger");
const mapper_1 = require("../../../mapper/mapper");
const batch_write_utils_1 = require("../../batchwrite/batch-write-utils");
const batch_write_const_1 = require("../../batchwrite/batch-write.const");
const base_request_1 = require("../base.request");
/**
 * Request class for BatchWriteItem operation which supports a single model class only.
 */
class BatchWriteSingleTableRequest extends base_request_1.BaseRequest {
    constructor(dynamoDBWrapper, modelClazz) {
        super(dynamoDBWrapper, modelClazz);
        this.toKey = mapper_1.createToKeyFn(this.modelClazz);
        this.createDeleteRequest = (item) => ({
            DeleteRequest: { Key: this.toKey(item) },
        });
        this.createPutRequest = (item) => ({ PutRequest: { Item: mapper_1.toDb(item, this.modelClazz) } });
        this.logger = logger_1.createLogger('dynamo.request.BatchWriteSingleTableRequest', modelClazz);
        this.params.RequestItems = {
            [this.tableName]: [],
        };
    }
    /**
     * return item collection metrics.
     */
    returnItemCollectionMetrics(value) {
        this.params.ReturnItemCollectionMetrics = value;
        return this;
    }
    delete(items) {
        if (this.params.RequestItems[this.tableName].length + items.length > batch_write_const_1.BATCH_WRITE_MAX_REQUEST_ITEM_COUNT) {
            throw new Error(`batch write takes at max ${batch_write_const_1.BATCH_WRITE_MAX_REQUEST_ITEM_COUNT} items`);
        }
        this.params.RequestItems[this.tableName].push(...items.map(this.createDeleteRequest));
        return this;
    }
    put(items) {
        if (this.params.RequestItems[this.tableName].length + items.length > batch_write_const_1.BATCH_WRITE_MAX_REQUEST_ITEM_COUNT) {
            throw new Error(`batch write takes at max ${batch_write_const_1.BATCH_WRITE_MAX_REQUEST_ITEM_COUNT} items`);
        }
        this.params.RequestItems[this.tableName].push(...items.map(this.createPutRequest));
        return this;
    }
    /**
     * execute the request
     * @param backoffTimer when unprocessed items are returned the next value of backoffTimer is used to determine how many time slots to wait before doing the next request
     * @param throttleTimeSlot the duration of a time slot in ms
     */
    exec(backoffTimer = random_exponential_backoff_timer_generator_1.randomExponentialBackoffTimer, throttleTimeSlot = batch_write_const_1.BATCH_WRITE_DEFAULT_TIME_SLOT) {
        this.logger.debug('starting batchWriteItem');
        return this.write(backoffTimer, throttleTimeSlot).then(() => {
            return;
        });
    }
    /**
     * execute the request and return the full response
     * @param backoffTimer when unprocessed items are returned the next value of backoffTimer is used to determine how many time slots to wait before doing the next request
     * @param throttleTimeSlot the duration of a time slot in ms
     */
    execFullResponse(backoffTimer = random_exponential_backoff_timer_generator_1.randomExponentialBackoffTimer, throttleTimeSlot = batch_write_const_1.BATCH_WRITE_DEFAULT_TIME_SLOT) {
        return this.write(backoffTimer, throttleTimeSlot);
    }
    write(backoffTimer, throttleTimeSlot) {
        return batch_write_utils_1.batchWriteItemsWriteAll(this.dynamoDBWrapper, Object.assign({}, this.params), backoffTimer(), throttleTimeSlot);
    }
}
exports.BatchWriteSingleTableRequest = BatchWriteSingleTableRequest;
//# sourceMappingURL=batch-write-single-table.request.js.map