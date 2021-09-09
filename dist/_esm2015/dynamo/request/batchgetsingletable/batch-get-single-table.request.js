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
export class BatchGetSingleTableRequest extends BaseRequest {
    constructor(dynamoDBWrapper, modelClazz, keys) {
        super(dynamoDBWrapper, modelClazz);
        this.mapResponse = (response) => {
            let items = [];
            if (response.Responses && Object.keys(response.Responses).length && response.Responses[this.tableName]) {
                const mapped = response.Responses[this.tableName].map((attributeMap) => fromDb(attributeMap, this.modelClazz));
                items = mapped;
            }
            return {
                Items: items,
                UnprocessedKeys: response.UnprocessedKeys,
                ConsumedCapacity: response.ConsumedCapacity,
            };
        };
        this.logger = createLogger('dynamo.request.BatchGetSingleTableRequest', modelClazz);
        if (keys.length > BATCH_GET_MAX_REQUEST_ITEM_COUNT) {
            throw new Error(`you can request at max ${BATCH_GET_MAX_REQUEST_ITEM_COUNT} items per request`);
        }
        this.params.RequestItems = {
            [this.tableName]: {
                Keys: keys.map(createToKeyFn(modelClazz)),
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
        addProjectionExpressionParam(attributesToGet, this.params.RequestItems[this.tableName], this.metadata);
        return this;
    }
    /**
     * fetch all entries and return the raw response (without parsing the attributes to js objects)
     * @param backoffTimer when unprocessed keys are returned the next value of backoffTimer is used to determine how many time slots to wait before doing the next request
     * @param throttleTimeSlot the duration of a time slot in ms
     */
    execNoMap(backoffTimer = randomExponentialBackoffTimer, throttleTimeSlot = BATCH_GET_DEFAULT_TIME_SLOT) {
        return this.fetch(backoffTimer, throttleTimeSlot);
    }
    /**
     * fetch all entries and return an object containing the mapped items and the other response data
     * @param backoffTimer when unprocessed keys are returned the next value of backoffTimer is used to determine how many time slots to wait before doing the next request
     * @param throttleTimeSlot the duration of a time slot in ms
     */
    execFullResponse(backoffTimer = randomExponentialBackoffTimer, throttleTimeSlot = BATCH_GET_DEFAULT_TIME_SLOT) {
        return this.fetch(backoffTimer, throttleTimeSlot)
            .then(this.mapResponse)
            .then(promiseTap((response) => this.logger.debug('mapped items', response.Items)));
    }
    /**
     * fetch all entries and return the parsed items
     * @param backoffTimer when unprocessed keys are returned the next value of backoffTimer is used to determine how many time slots to wait before doing the next request
     * @param throttleTimeSlot the duration of a time slot in ms
     */
    exec(backoffTimer = randomExponentialBackoffTimer, throttleTimeSlot = BATCH_GET_DEFAULT_TIME_SLOT) {
        return this.fetch(backoffTimer, throttleTimeSlot)
            .then(this.mapResponse)
            .then((r) => r.Items)
            .then(promiseTap((items) => this.logger.debug('mapped items', items)));
    }
    fetch(backoffTimer = randomExponentialBackoffTimer, throttleTimeSlot = BATCH_GET_DEFAULT_TIME_SLOT) {
        this.logger.debug('request', this.params);
        return batchGetItemsFetchAll(this.dynamoDBWrapper, Object.assign({}, this.params), backoffTimer(), throttleTimeSlot).then(promiseTap((response) => this.logger.debug('response', response)));
    }
}
//# sourceMappingURL=batch-get-single-table.request.js.map