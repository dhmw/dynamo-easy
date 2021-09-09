import * as tslib_1 from "tslib";
import { randomExponentialBackoffTimer } from '../../helper/random-exponential-backoff-timer.generator';
import { createToKeyFn, toDb } from '../../mapper/mapper';
import { DynamoDbWrapper } from '../dynamo-db-wrapper';
import { getTableName } from '../get-table-name.function';
import { batchWriteItemsWriteAll } from './batch-write-utils';
import { BATCH_WRITE_DEFAULT_TIME_SLOT, BATCH_WRITE_MAX_REQUEST_ITEM_COUNT } from './batch-write.const';
/**
 * Request class for the BatchWriteItem operation. Put or delete multiple items in one or more table.
 */
var BatchWriteRequest = /** @class */ (function () {
    function BatchWriteRequest(dynamoDB) {
        this.itemCount = 0;
        this.createDeleteRequest = function (modelClazz) {
            var toKey = createToKeyFn(modelClazz);
            return function (item) { return ({ DeleteRequest: { Key: toKey(item) } }); };
        };
        this.createPutRequest = function (modelClazz) {
            return function (item) { return ({ PutRequest: { Item: toDb(item, modelClazz) } }); };
        };
        this.dynamoDBWrapper = new DynamoDbWrapper(dynamoDB);
        this.params = {
            RequestItems: {},
        };
    }
    Object.defineProperty(BatchWriteRequest.prototype, "dynamoDB", {
        get: function () {
            return this.dynamoDBWrapper.dynamoDB;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * return ConsumedCapacity of the corresponding tables in the response
     */
    BatchWriteRequest.prototype.returnConsumedCapacity = function (value) {
        this.params.ReturnConsumedCapacity = value;
        return this;
    };
    /**
     * return item collection metrics.
     */
    BatchWriteRequest.prototype.returnItemCollectionMetrics = function (value) {
        this.params.ReturnItemCollectionMetrics = value;
        return this;
    };
    /**
     * add keys for deletion
     * @param modelClazz the corresponding ModelConstructor
     * @param keys an array of partials of T that contains PartitionKey and SortKey (if necessary). Throws if missing.
     */
    BatchWriteRequest.prototype.delete = function (modelClazz, keys) {
        this.requestItems(modelClazz, keys.map(this.createDeleteRequest(modelClazz)));
        return this;
    };
    /**
     * add items to put
     * @param modelClazz the corresponding ModelConstructor
     * @param items the items to put
     */
    BatchWriteRequest.prototype.put = function (modelClazz, items) {
        this.requestItems(modelClazz, items.map(this.createPutRequest(modelClazz)));
        return this;
    };
    /**
     * execute request
     * @param backoffTimer generator for how much timeSlots should be waited before requesting next batch. only used when capacity was exceeded. default randomExponentialBackoffTimer
     * @param throttleTimeSlot defines how long one timeSlot is for throttling, default 1 second
     */
    BatchWriteRequest.prototype.exec = function (backoffTimer, throttleTimeSlot) {
        if (backoffTimer === void 0) { backoffTimer = randomExponentialBackoffTimer; }
        if (throttleTimeSlot === void 0) { throttleTimeSlot = BATCH_WRITE_DEFAULT_TIME_SLOT; }
        return this.write(backoffTimer, throttleTimeSlot).then(function () {
            return;
        });
    };
    /**
     * execute request and return (last) response
     * @param backoffTimer generator for how much timeSlots should be waited before requesting next batch. only used when capacity was exceeded. default randomExponentialBackoffTimer
     * @param throttleTimeSlot defines how long one timeSlot is for throttling, default 1 second
     */
    BatchWriteRequest.prototype.execFullResponse = function (backoffTimer, throttleTimeSlot) {
        if (backoffTimer === void 0) { backoffTimer = randomExponentialBackoffTimer; }
        if (throttleTimeSlot === void 0) { throttleTimeSlot = BATCH_WRITE_DEFAULT_TIME_SLOT; }
        return this.write(backoffTimer, throttleTimeSlot);
    };
    BatchWriteRequest.prototype.requestItems = function (modelClazz, items) {
        var _a;
        if (this.itemCount + items.length > BATCH_WRITE_MAX_REQUEST_ITEM_COUNT) {
            throw new Error("batch write takes at max " + BATCH_WRITE_MAX_REQUEST_ITEM_COUNT + " items");
        }
        var tableName = getTableName(modelClazz);
        this.params.RequestItems[tableName] = this.params.RequestItems[tableName] || [];
        (_a = this.params.RequestItems[tableName]).push.apply(_a, tslib_1.__spread(items));
        this.itemCount += items.length;
    };
    BatchWriteRequest.prototype.write = function (backoffTimer, throttleTimeSlot) {
        return batchWriteItemsWriteAll(this.dynamoDBWrapper, tslib_1.__assign({}, this.params), backoffTimer(), throttleTimeSlot);
    };
    return BatchWriteRequest;
}());
export { BatchWriteRequest };
//# sourceMappingURL=batch-write.request.js.map