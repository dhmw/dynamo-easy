import * as tslib_1 from "tslib";
import { metadataForModel } from '../../decorator/metadata/metadata-for-model.function';
import { randomExponentialBackoffTimer } from '../../helper/random-exponential-backoff-timer.generator';
import { createToKeyFn, fromDb } from '../../mapper/mapper';
import { DynamoDbWrapper } from '../dynamo-db-wrapper';
import { getTableName } from '../get-table-name.function';
import { batchGetItemsFetchAll } from './batch-get-utils';
import { BATCH_GET_DEFAULT_TIME_SLOT, BATCH_GET_MAX_REQUEST_ITEM_COUNT } from './batch-get.const';
/**
 * Request class for the BatchGetItem operation. Read multiple items from one or more tables.
 */
var BatchGetRequest = /** @class */ (function () {
    function BatchGetRequest(dynamoDB) {
        var _this = this;
        this.tables = new Map();
        this.itemCounter = 0;
        this.mapResponse = function (response) {
            var Responses = {};
            if (response.Responses && Object.keys(response.Responses).length) {
                Responses = Object.entries(response.Responses).reduce(function (u, _a) {
                    var _b = tslib_1.__read(_a, 2), key = _b[0], val = _b[1];
                    u[key] = val.map(function (attributes) { return fromDb(attributes, _this.tables.get(key)); });
                    return u;
                }, {});
            }
            return {
                ConsumedCapacity: response.ConsumedCapacity,
                UnprocessedKeys: response.UnprocessedKeys,
                Responses: Responses,
            };
        };
        this.dynamoDBWrapper = new DynamoDbWrapper(dynamoDB);
        this.params = {
            RequestItems: {},
        };
    }
    Object.defineProperty(BatchGetRequest.prototype, "dynamoDB", {
        get: function () {
            return this.dynamoDBWrapper.dynamoDB;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * return ConsumedCapacity of the corresponding tables in the response
     */
    BatchGetRequest.prototype.returnConsumedCapacity = function (level) {
        this.params.ReturnConsumedCapacity = level;
        return this;
    };
    /**
     * read items of model by key
     * @param modelClazz the corresponding ModelConstructor
     * @param keys an array of partials of T that contains PartitionKey and SortKey (if necessary). Throws if missing.
     * @param consistentRead set to true so the operation uses strongly consistent reads, default false
     */
    BatchGetRequest.prototype.forModel = function (modelClazz, keys, consistentRead) {
        if (consistentRead === void 0) { consistentRead = false; }
        // check if modelClazz is really an @Model() decorated class
        var metadata = metadataForModel(modelClazz);
        if (!metadata.modelOptions) {
            throw new Error('given ModelConstructor has no @Model decorator');
        }
        // check if table was already used in this request
        var tableName = getTableName(metadata);
        if (this.tables.has(tableName)) {
            throw new Error('table name already exists, please provide all the keys for the same table at once');
        }
        this.tables.set(tableName, modelClazz);
        // check if keys to add do not exceed max count
        if (this.itemCounter + keys.length > BATCH_GET_MAX_REQUEST_ITEM_COUNT) {
            throw new Error("you can request at max " + BATCH_GET_MAX_REQUEST_ITEM_COUNT + " items per request");
        }
        this.params.RequestItems[tableName] = {
            Keys: keys.map(createToKeyFn(modelClazz)),
            ConsistentRead: consistentRead,
        };
        this.itemCounter += keys.length;
        return this;
    };
    /**
     * execute the request and return the raw response (without parsing the attributes to js objects)
     * @param backoffTimer when unprocessed items are returned the next value of backoffTimer is used to determine how many time slots to wait before doing the next request
     * @param throttleTimeSlot the duration of a time slot in ms
     */
    BatchGetRequest.prototype.execNoMap = function (backoffTimer, throttleTimeSlot) {
        if (backoffTimer === void 0) { backoffTimer = randomExponentialBackoffTimer; }
        if (throttleTimeSlot === void 0) { throttleTimeSlot = BATCH_GET_DEFAULT_TIME_SLOT; }
        return this.fetch(backoffTimer, throttleTimeSlot);
    };
    /**
     * execute and return full response with the mapped js objects per table
     * @param backoffTimer when unprocessed items are returned the next value of backoffTimer is used to determine how many time slots to wait before doing the next request
     * @param throttleTimeSlot the duration of a time slot in ms
     */
    BatchGetRequest.prototype.execFullResponse = function (backoffTimer, throttleTimeSlot) {
        if (backoffTimer === void 0) { backoffTimer = randomExponentialBackoffTimer; }
        if (throttleTimeSlot === void 0) { throttleTimeSlot = BATCH_GET_DEFAULT_TIME_SLOT; }
        return this.fetch(backoffTimer, throttleTimeSlot).then(this.mapResponse);
    };
    /**
     * execute and return the parsed items per table
     * @param backoffTimer when unprocessed items are returned the next value of backoffTimer is used to determine how many time slots to wait before doing the next request
     * @param throttleTimeSlot the duration of a time slot in ms
     */
    BatchGetRequest.prototype.exec = function (backoffTimer, throttleTimeSlot) {
        if (backoffTimer === void 0) { backoffTimer = randomExponentialBackoffTimer; }
        if (throttleTimeSlot === void 0) { throttleTimeSlot = BATCH_GET_DEFAULT_TIME_SLOT; }
        return this.fetch(backoffTimer, throttleTimeSlot)
            .then(this.mapResponse)
            .then(function (r) { return r.Responses; });
    };
    BatchGetRequest.prototype.fetch = function (backoffTimer, throttleTimeSlot) {
        if (backoffTimer === void 0) { backoffTimer = randomExponentialBackoffTimer; }
        if (throttleTimeSlot === void 0) { throttleTimeSlot = BATCH_GET_DEFAULT_TIME_SLOT; }
        return batchGetItemsFetchAll(this.dynamoDBWrapper, tslib_1.__assign({}, this.params), backoffTimer(), throttleTimeSlot);
    };
    return BatchGetRequest;
}());
export { BatchGetRequest };
//# sourceMappingURL=batch-get.request.js.map