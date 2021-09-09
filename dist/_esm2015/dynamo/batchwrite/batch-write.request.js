import { randomExponentialBackoffTimer } from '../../helper/random-exponential-backoff-timer.generator';
import { createToKeyFn, toDb } from '../../mapper/mapper';
import { DynamoDbWrapper } from '../dynamo-db-wrapper';
import { getTableName } from '../get-table-name.function';
import { batchWriteItemsWriteAll } from './batch-write-utils';
import { BATCH_WRITE_DEFAULT_TIME_SLOT, BATCH_WRITE_MAX_REQUEST_ITEM_COUNT } from './batch-write.const';
/**
 * Request class for the BatchWriteItem operation. Put or delete multiple items in one or more table.
 */
export class BatchWriteRequest {
    constructor(dynamoDB) {
        this.itemCount = 0;
        this.createDeleteRequest = (modelClazz) => {
            const toKey = createToKeyFn(modelClazz);
            return (item) => ({ DeleteRequest: { Key: toKey(item) } });
        };
        this.createPutRequest = (modelClazz) => {
            return (item) => ({ PutRequest: { Item: toDb(item, modelClazz) } });
        };
        this.dynamoDBWrapper = new DynamoDbWrapper(dynamoDB);
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
    exec(backoffTimer = randomExponentialBackoffTimer, throttleTimeSlot = BATCH_WRITE_DEFAULT_TIME_SLOT) {
        return this.write(backoffTimer, throttleTimeSlot).then(() => {
            return;
        });
    }
    /**
     * execute request and return (last) response
     * @param backoffTimer generator for how much timeSlots should be waited before requesting next batch. only used when capacity was exceeded. default randomExponentialBackoffTimer
     * @param throttleTimeSlot defines how long one timeSlot is for throttling, default 1 second
     */
    execFullResponse(backoffTimer = randomExponentialBackoffTimer, throttleTimeSlot = BATCH_WRITE_DEFAULT_TIME_SLOT) {
        return this.write(backoffTimer, throttleTimeSlot);
    }
    requestItems(modelClazz, items) {
        if (this.itemCount + items.length > BATCH_WRITE_MAX_REQUEST_ITEM_COUNT) {
            throw new Error(`batch write takes at max ${BATCH_WRITE_MAX_REQUEST_ITEM_COUNT} items`);
        }
        const tableName = getTableName(modelClazz);
        this.params.RequestItems[tableName] = this.params.RequestItems[tableName] || [];
        this.params.RequestItems[tableName].push(...items);
        this.itemCount += items.length;
    }
    write(backoffTimer, throttleTimeSlot) {
        return batchWriteItemsWriteAll(this.dynamoDBWrapper, Object.assign({}, this.params), backoffTimer(), throttleTimeSlot);
    }
}
//# sourceMappingURL=batch-write.request.js.map