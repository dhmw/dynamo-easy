import { randomExponentialBackoffTimer } from '../../../helper/random-exponential-backoff-timer.generator';
import { createLogger } from '../../../logger/logger';
import { createToKeyFn, toDb } from '../../../mapper/mapper';
import { batchWriteItemsWriteAll } from '../../batchwrite/batch-write-utils';
import { BATCH_WRITE_DEFAULT_TIME_SLOT, BATCH_WRITE_MAX_REQUEST_ITEM_COUNT } from '../../batchwrite/batch-write.const';
import { BaseRequest } from '../base.request';
/**
 * Request class for BatchWriteItem operation which supports a single model class only.
 */
export class BatchWriteSingleTableRequest extends BaseRequest {
    constructor(dynamoDBWrapper, modelClazz) {
        super(dynamoDBWrapper, modelClazz);
        this.toKey = createToKeyFn(this.modelClazz);
        this.createDeleteRequest = (item) => ({
            DeleteRequest: { Key: this.toKey(item) },
        });
        this.createPutRequest = (item) => ({ PutRequest: { Item: toDb(item, this.modelClazz) } });
        this.logger = createLogger('dynamo.request.BatchWriteSingleTableRequest', modelClazz);
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
        if (this.params.RequestItems[this.tableName].length + items.length > BATCH_WRITE_MAX_REQUEST_ITEM_COUNT) {
            throw new Error(`batch write takes at max ${BATCH_WRITE_MAX_REQUEST_ITEM_COUNT} items`);
        }
        this.params.RequestItems[this.tableName].push(...items.map(this.createDeleteRequest));
        return this;
    }
    put(items) {
        if (this.params.RequestItems[this.tableName].length + items.length > BATCH_WRITE_MAX_REQUEST_ITEM_COUNT) {
            throw new Error(`batch write takes at max ${BATCH_WRITE_MAX_REQUEST_ITEM_COUNT} items`);
        }
        this.params.RequestItems[this.tableName].push(...items.map(this.createPutRequest));
        return this;
    }
    /**
     * execute the request
     * @param backoffTimer when unprocessed items are returned the next value of backoffTimer is used to determine how many time slots to wait before doing the next request
     * @param throttleTimeSlot the duration of a time slot in ms
     */
    exec(backoffTimer = randomExponentialBackoffTimer, throttleTimeSlot = BATCH_WRITE_DEFAULT_TIME_SLOT) {
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
    execFullResponse(backoffTimer = randomExponentialBackoffTimer, throttleTimeSlot = BATCH_WRITE_DEFAULT_TIME_SLOT) {
        return this.write(backoffTimer, throttleTimeSlot);
    }
    write(backoffTimer, throttleTimeSlot) {
        return batchWriteItemsWriteAll(this.dynamoDBWrapper, Object.assign({}, this.params), backoffTimer(), throttleTimeSlot);
    }
}
//# sourceMappingURL=batch-write-single-table.request.js.map