"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promise_tap_function_1 = require("../../../helper/promise-tap.function");
const random_exponential_backoff_timer_generator_1 = require("../../../helper/random-exponential-backoff-timer.generator");
const logger_1 = require("../../../logger/logger");
const mapper_1 = require("../../../mapper/mapper");
const batch_get_utils_1 = require("../../batchget/batch-get-utils");
const batch_get_const_1 = require("../../batchget/batch-get.const");
const base_request_1 = require("../base.request");
const add_projection_expression_param_function_1 = require("../helper/add-projection-expression-param.function");
/**
 * Request class for BatchGetItem operation which supports a single model class only.
 */
class BatchGetSingleTableRequest extends base_request_1.BaseRequest {
    constructor(dynamoDBWrapper, modelClazz, keys) {
        super(dynamoDBWrapper, modelClazz);
        this.mapResponse = (response) => {
            let items = [];
            if (response.Responses && Object.keys(response.Responses).length && response.Responses[this.tableName]) {
                const mapped = response.Responses[this.tableName].map((attributeMap) => mapper_1.fromDb(attributeMap, this.modelClazz));
                items = mapped;
            }
            return {
                Items: items,
                UnprocessedKeys: response.UnprocessedKeys,
                ConsumedCapacity: response.ConsumedCapacity,
            };
        };
        this.logger = logger_1.createLogger('dynamo.request.BatchGetSingleTableRequest', modelClazz);
        if (keys.length > batch_get_const_1.BATCH_GET_MAX_REQUEST_ITEM_COUNT) {
            throw new Error(`you can request at max ${batch_get_const_1.BATCH_GET_MAX_REQUEST_ITEM_COUNT} items per request`);
        }
        this.params.RequestItems = {
            [this.tableName]: {
                Keys: keys.map(mapper_1.createToKeyFn(modelClazz)),
            },
        };
    }
    /**
     * Determines the read consistency model: If set to true, then the operation uses strongly consistent reads; otherwise, the operation uses eventually consistent reads.
     */
    consistentRead(value = true) {
        this.params.RequestItems[this.tableName].ConsistentRead = value;
        return this;
    }
    /**
     * Specifies the list of model attributes to be returned from the table instead of returning the entire document
     * @param attributesToGet List of model attributes to be returned
     */
    projectionExpression(...attributesToGet) {
        add_projection_expression_param_function_1.addProjectionExpressionParam(attributesToGet, this.params.RequestItems[this.tableName], this.metadata);
        return this;
    }
    /**
     * fetch all entries and return the raw response (without parsing the attributes to js objects)
     * @param backoffTimer when unprocessed keys are returned the next value of backoffTimer is used to determine how many time slots to wait before doing the next request
     * @param throttleTimeSlot the duration of a time slot in ms
     */
    execNoMap(backoffTimer = random_exponential_backoff_timer_generator_1.randomExponentialBackoffTimer, throttleTimeSlot = batch_get_const_1.BATCH_GET_DEFAULT_TIME_SLOT) {
        return this.fetch(backoffTimer, throttleTimeSlot);
    }
    /**
     * fetch all entries and return an object containing the mapped items and the other response data
     * @param backoffTimer when unprocessed keys are returned the next value of backoffTimer is used to determine how many time slots to wait before doing the next request
     * @param throttleTimeSlot the duration of a time slot in ms
     */
    execFullResponse(backoffTimer = random_exponential_backoff_timer_generator_1.randomExponentialBackoffTimer, throttleTimeSlot = batch_get_const_1.BATCH_GET_DEFAULT_TIME_SLOT) {
        return this.fetch(backoffTimer, throttleTimeSlot)
            .then(this.mapResponse)
            .then(promise_tap_function_1.promiseTap((response) => this.logger.debug('mapped items', response.Items)));
    }
    /**
     * fetch all entries and return the parsed items
     * @param backoffTimer when unprocessed keys are returned the next value of backoffTimer is used to determine how many time slots to wait before doing the next request
     * @param throttleTimeSlot the duration of a time slot in ms
     */
    exec(backoffTimer = random_exponential_backoff_timer_generator_1.randomExponentialBackoffTimer, throttleTimeSlot = batch_get_const_1.BATCH_GET_DEFAULT_TIME_SLOT) {
        return this.fetch(backoffTimer, throttleTimeSlot)
            .then(this.mapResponse)
            .then((r) => r.Items)
            .then(promise_tap_function_1.promiseTap((items) => this.logger.debug('mapped items', items)));
    }
    fetch(backoffTimer = random_exponential_backoff_timer_generator_1.randomExponentialBackoffTimer, throttleTimeSlot = batch_get_const_1.BATCH_GET_DEFAULT_TIME_SLOT) {
        this.logger.debug('request', this.params);
        return batch_get_utils_1.batchGetItemsFetchAll(this.dynamoDBWrapper, Object.assign({}, this.params), backoffTimer(), throttleTimeSlot).then(promise_tap_function_1.promiseTap((response) => this.logger.debug('response', response)));
    }
}
exports.BatchGetSingleTableRequest = BatchGetSingleTableRequest;
//# sourceMappingURL=batch-get-single-table.request.js.map