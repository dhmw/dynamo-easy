import * as tslib_1 from "tslib";
import { randomExponentialBackoffTimer } from '../../../helper/random-exponential-backoff-timer.generator';
import { createLogger } from '../../../logger/logger';
import { createToKeyFn, toDb } from '../../../mapper/mapper';
import { batchWriteItemsWriteAll } from '../../batchwrite/batch-write-utils';
import { BATCH_WRITE_DEFAULT_TIME_SLOT, BATCH_WRITE_MAX_REQUEST_ITEM_COUNT } from '../../batchwrite/batch-write.const';
import { BaseRequest } from '../base.request';
/**
 * Request class for BatchWriteItem operation which supports a single model class only.
 */
var BatchWriteSingleTableRequest = /** @class */ (function (_super) {
    tslib_1.__extends(BatchWriteSingleTableRequest, _super);
    function BatchWriteSingleTableRequest(dynamoDBWrapper, modelClazz) {
        var _a;
        var _this = _super.call(this, dynamoDBWrapper, modelClazz) || this;
        _this.toKey = createToKeyFn(_this.modelClazz);
        _this.createDeleteRequest = function (item) { return ({
            DeleteRequest: { Key: _this.toKey(item) },
        }); };
        _this.createPutRequest = function (item) { return ({ PutRequest: { Item: toDb(item, _this.modelClazz) } }); };
        _this.logger = createLogger('dynamo.request.BatchWriteSingleTableRequest', modelClazz);
        _this.params.RequestItems = (_a = {},
            _a[_this.tableName] = [],
            _a);
        return _this;
    }
    /**
     * return item collection metrics.
     */
    BatchWriteSingleTableRequest.prototype.returnItemCollectionMetrics = function (value) {
        this.params.ReturnItemCollectionMetrics = value;
        return this;
    };
    BatchWriteSingleTableRequest.prototype.delete = function (items) {
        var _a;
        if (this.params.RequestItems[this.tableName].length + items.length > BATCH_WRITE_MAX_REQUEST_ITEM_COUNT) {
            throw new Error("batch write takes at max " + BATCH_WRITE_MAX_REQUEST_ITEM_COUNT + " items");
        }
        (_a = this.params.RequestItems[this.tableName]).push.apply(_a, tslib_1.__spread(items.map(this.createDeleteRequest)));
        return this;
    };
    BatchWriteSingleTableRequest.prototype.put = function (items) {
        var _a;
        if (this.params.RequestItems[this.tableName].length + items.length > BATCH_WRITE_MAX_REQUEST_ITEM_COUNT) {
            throw new Error("batch write takes at max " + BATCH_WRITE_MAX_REQUEST_ITEM_COUNT + " items");
        }
        (_a = this.params.RequestItems[this.tableName]).push.apply(_a, tslib_1.__spread(items.map(this.createPutRequest)));
        return this;
    };
    /**
     * execute the request
     * @param backoffTimer when unprocessed items are returned the next value of backoffTimer is used to determine how many time slots to wait before doing the next request
     * @param throttleTimeSlot the duration of a time slot in ms
     */
    BatchWriteSingleTableRequest.prototype.exec = function (backoffTimer, throttleTimeSlot) {
        if (backoffTimer === void 0) { backoffTimer = randomExponentialBackoffTimer; }
        if (throttleTimeSlot === void 0) { throttleTimeSlot = BATCH_WRITE_DEFAULT_TIME_SLOT; }
        this.logger.debug('starting batchWriteItem');
        return this.write(backoffTimer, throttleTimeSlot).then(function () {
            return;
        });
    };
    /**
     * execute the request and return the full response
     * @param backoffTimer when unprocessed items are returned the next value of backoffTimer is used to determine how many time slots to wait before doing the next request
     * @param throttleTimeSlot the duration of a time slot in ms
     */
    BatchWriteSingleTableRequest.prototype.execFullResponse = function (backoffTimer, throttleTimeSlot) {
        if (backoffTimer === void 0) { backoffTimer = randomExponentialBackoffTimer; }
        if (throttleTimeSlot === void 0) { throttleTimeSlot = BATCH_WRITE_DEFAULT_TIME_SLOT; }
        return this.write(backoffTimer, throttleTimeSlot);
    };
    BatchWriteSingleTableRequest.prototype.write = function (backoffTimer, throttleTimeSlot) {
        return batchWriteItemsWriteAll(this.dynamoDBWrapper, tslib_1.__assign({}, this.params), backoffTimer(), throttleTimeSlot);
    };
    return BatchWriteSingleTableRequest;
}(BaseRequest));
export { BatchWriteSingleTableRequest };
//# sourceMappingURL=batch-write-single-table.request.js.map