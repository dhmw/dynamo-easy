import * as tslib_1 from "tslib";
import { promiseTap } from '../../../helper/promise-tap.function';
import { randomExponentialBackoffTimer } from '../../../helper/random-exponential-backoff-timer.generator';
import { createLogger } from '../../../logger/logger';
import { createToKeyFn, fromDb } from '../../../mapper/mapper';
import { batchGetItemsFetchAll } from '../../batchget/batch-get-utils';
import { BATCH_GET_DEFAULT_TIME_SLOT, BATCH_GET_MAX_REQUEST_ITEM_COUNT } from '../../batchget/batch-get.const';
import { BaseRequest } from '../base.request';
import { addProjectionExpressionParam } from '../helper/add-projection-expression-param.function';
/**
 * Request class for BatchGetItem operation which supports a single model class only.
 */
var BatchGetSingleTableRequest = /** @class */ (function (_super) {
    tslib_1.__extends(BatchGetSingleTableRequest, _super);
    function BatchGetSingleTableRequest(dynamoDBWrapper, modelClazz, keys) {
        var _a;
        var _this = _super.call(this, dynamoDBWrapper, modelClazz) || this;
        _this.mapResponse = function (response) {
            var items = [];
            if (response.Responses && Object.keys(response.Responses).length && response.Responses[_this.tableName]) {
                var mapped = response.Responses[_this.tableName].map(function (attributeMap) {
                    return fromDb(attributeMap, _this.modelClazz);
                });
                items = mapped;
            }
            return {
                Items: items,
                UnprocessedKeys: response.UnprocessedKeys,
                ConsumedCapacity: response.ConsumedCapacity,
            };
        };
        _this.logger = createLogger('dynamo.request.BatchGetSingleTableRequest', modelClazz);
        if (keys.length > BATCH_GET_MAX_REQUEST_ITEM_COUNT) {
            throw new Error("you can request at max " + BATCH_GET_MAX_REQUEST_ITEM_COUNT + " items per request");
        }
        _this.params.RequestItems = (_a = {},
            _a[_this.tableName] = {
                Keys: keys.map(createToKeyFn(modelClazz)),
            },
            _a);
        return _this;
    }
    /**
     * Determines the read consistency model: If set to true, then the operation uses strongly consistent reads; otherwise, the operation uses eventually consistent reads.
     */
    BatchGetSingleTableRequest.prototype.consistentRead = function (value) {
        if (value === void 0) { value = true; }
        this.params.RequestItems[this.tableName].ConsistentRead = value;
        return this;
    };
    /**
     * Specifies the list of model attributes to be returned from the table instead of returning the entire document
     * @param attributesToGet List of model attributes to be returned
     */
    BatchGetSingleTableRequest.prototype.projectionExpression = function () {
        var attributesToGet = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            attributesToGet[_i] = arguments[_i];
        }
        addProjectionExpressionParam(attributesToGet, this.params.RequestItems[this.tableName], this.metadata);
        return this;
    };
    /**
     * fetch all entries and return the raw response (without parsing the attributes to js objects)
     * @param backoffTimer when unprocessed keys are returned the next value of backoffTimer is used to determine how many time slots to wait before doing the next request
     * @param throttleTimeSlot the duration of a time slot in ms
     */
    BatchGetSingleTableRequest.prototype.execNoMap = function (backoffTimer, throttleTimeSlot) {
        if (backoffTimer === void 0) { backoffTimer = randomExponentialBackoffTimer; }
        if (throttleTimeSlot === void 0) { throttleTimeSlot = BATCH_GET_DEFAULT_TIME_SLOT; }
        return this.fetch(backoffTimer, throttleTimeSlot);
    };
    /**
     * fetch all entries and return an object containing the mapped items and the other response data
     * @param backoffTimer when unprocessed keys are returned the next value of backoffTimer is used to determine how many time slots to wait before doing the next request
     * @param throttleTimeSlot the duration of a time slot in ms
     */
    BatchGetSingleTableRequest.prototype.execFullResponse = function (backoffTimer, throttleTimeSlot) {
        var _this = this;
        if (backoffTimer === void 0) { backoffTimer = randomExponentialBackoffTimer; }
        if (throttleTimeSlot === void 0) { throttleTimeSlot = BATCH_GET_DEFAULT_TIME_SLOT; }
        return this.fetch(backoffTimer, throttleTimeSlot)
            .then(this.mapResponse)
            .then(promiseTap(function (response) { return _this.logger.debug('mapped items', response.Items); }));
    };
    /**
     * fetch all entries and return the parsed items
     * @param backoffTimer when unprocessed keys are returned the next value of backoffTimer is used to determine how many time slots to wait before doing the next request
     * @param throttleTimeSlot the duration of a time slot in ms
     */
    BatchGetSingleTableRequest.prototype.exec = function (backoffTimer, throttleTimeSlot) {
        var _this = this;
        if (backoffTimer === void 0) { backoffTimer = randomExponentialBackoffTimer; }
        if (throttleTimeSlot === void 0) { throttleTimeSlot = BATCH_GET_DEFAULT_TIME_SLOT; }
        return this.fetch(backoffTimer, throttleTimeSlot)
            .then(this.mapResponse)
            .then(function (r) { return r.Items; })
            .then(promiseTap(function (items) { return _this.logger.debug('mapped items', items); }));
    };
    BatchGetSingleTableRequest.prototype.fetch = function (backoffTimer, throttleTimeSlot) {
        var _this = this;
        if (backoffTimer === void 0) { backoffTimer = randomExponentialBackoffTimer; }
        if (throttleTimeSlot === void 0) { throttleTimeSlot = BATCH_GET_DEFAULT_TIME_SLOT; }
        this.logger.debug('request', this.params);
        return batchGetItemsFetchAll(this.dynamoDBWrapper, tslib_1.__assign({}, this.params), backoffTimer(), throttleTimeSlot).then(promiseTap(function (response) { return _this.logger.debug('response', response); }));
    };
    return BatchGetSingleTableRequest;
}(BaseRequest));
export { BatchGetSingleTableRequest };
//# sourceMappingURL=batch-get-single-table.request.js.map