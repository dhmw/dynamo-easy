"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetch_all_function_1 = require("../../helper/fetch-all.function");
const promise_tap_function_1 = require("../../helper/promise-tap.function");
const mapper_1 = require("../../mapper/mapper");
const and_function_1 = require("../expression/logical-operator/and.function");
const param_util_1 = require("../expression/param-util");
const request_expression_builder_1 = require("../expression/request-expression-builder");
const add_projection_expression_param_function_1 = require("./helper/add-projection-expression-param.function");
const standard_request_1 = require("./standard.request");
/**
 * abstract class for query and scan request classes.
 */
class ReadManyRequest extends standard_request_1.StandardRequest {
    constructor(dynamoDBWrapper, modelClazz) {
        super(dynamoDBWrapper, modelClazz);
        this.mapFromDb = (output) => {
            const response = Object.assign({}, output);
            response.Items = (output.Items || []).map((item) => mapper_1.fromDb(item, this.modelClazz));
            return response;
        };
    }
    /**
     *
     * @param key A map representing the start id which is included in next call, if null is delivered
     * startKey will be removed from params
     */
    exclusiveStartKey(key) {
        // TODO ENHANCEMENT exclusiveStartKey(item: Partial<T>)
        if (key) {
            this.params.ExclusiveStartKey = key;
        }
        else {
            delete this.params.ExclusiveStartKey;
        }
        return this;
    }
    /**
     * query items on the given index.
     */
    index(indexName) {
        const index = this.metadata.getIndex(indexName);
        if (index) {
            this.secondaryIndex = index;
            this.params.IndexName = indexName;
        }
        else {
            throw new Error(`there is no index with name <${indexName}> defined for model ${this.modelClazz.name}`);
        }
        return this;
    }
    /**
     * set Limit to params - The maximum number of items to evaluate (not necessarily the number of matching items)
     */
    limit(limit) {
        if (limit === ReadManyRequest.INFINITE_LIMIT) {
            delete this.params.Limit;
        }
        else {
            if (limit !== null && limit !== undefined && limit > 0) {
                this.params.Limit = limit;
            }
            else {
                throw new Error('limit must be a valid positive number');
            }
        }
        return this;
    }
    /**
     * Determines the read consistency model: If set to true, then the operation uses strongly consistent reads; otherwise, the operation uses eventually consistent reads.
     */
    consistentRead(consistentRead = true) {
        this.params.ConsistentRead = consistentRead;
        return this;
    }
    /**
     * Specifies the list of model attributes to be returned from the table instead of returning the entire document
     * @param attributesToGet List of model attributes to be returned
     */
    projectionExpression(...attributesToGet) {
        add_projection_expression_param_function_1.addProjectionExpressionParam(attributesToGet, this.params, this.metadata);
        return this;
    }
    whereAttribute(attributePath) {
        return request_expression_builder_1.addCondition('FilterExpression', attributePath, this, this.metadata);
    }
    /**
     * add one or multiple conditions.
     * @example req.where( attribute('age').eq(23) )
     * @example req.where( or( attribute('age').lt(18), attribute('age').gt(65) ) )
     */
    where(...conditionDefFns) {
        const condition = and_function_1.and(...conditionDefFns)(undefined, this.metadata);
        param_util_1.addExpression('FilterExpression', condition, this.params);
        return this;
    }
    /**
     * execute the request and return the raw response (without parsing the attributes to js objects)
     */
    execNoMap() {
        this.logger.debug('request (noMap)', this.params);
        return this.doRequest(this.params).then(promise_tap_function_1.promiseTap((response) => this.logger.debug('response', response)));
    }
    /**
     * Execute with Limit: 1 to read the first item only
     */
    execSingle() {
        // do not alter the params on the instance but add the additional 'Limit' param to a copy.
        // otherwise a follow-up request with the very same request-object would be wrong
        const params = Object.assign({}, this.params, { Limit: 1 });
        this.logger.debug('single request', params);
        return this.doRequest(params)
            .then(promise_tap_function_1.promiseTap((response) => this.logger.debug('response', response)))
            .then(this.mapFromDb)
            .then((r) => (r.Items && r.Items.length ? r.Items[0] : null))
            .then(promise_tap_function_1.promiseTap((item) => this.logger.debug('mapped item', item)));
    }
    /**
     * Execute with Select: 'Count' to count the items.
     */
    execCount() {
        // do not alter the params on the instance but add the additional 'Select' param to a copy.
        // otherwise a follow-up request with the very same request-object would be wrong
        const params = Object.assign({}, this.params, { Select: 'COUNT' });
        this.logger.debug('count request', params);
        return this.doRequest(params)
            .then(promise_tap_function_1.promiseTap((response) => this.logger.debug('response', response)))
            .then((response) => response.Count || 0)
            .then(promise_tap_function_1.promiseTap((count) => this.logger.debug('count', count)));
    }
    /**
     * execute request and return the parsed items
     */
    exec() {
        this.logger.debug('request', this.params);
        return this.doRequest(this.params)
            .then(promise_tap_function_1.promiseTap((response) => this.logger.debug('response', response)))
            .then(this.mapFromDb)
            .then((r) => r.Items)
            .then(promise_tap_function_1.promiseTap((items) => this.logger.debug('mapped items', items)));
    }
    /**
     * execute request and return the full response with the parsed items
     */
    execFullResponse() {
        this.logger.debug('request', this.params);
        return this.doRequest(this.params)
            .then(promise_tap_function_1.promiseTap((response) => this.logger.debug('response', response)))
            .then(this.mapFromDb)
            .then(promise_tap_function_1.promiseTap((response) => this.logger.debug('mapped items', response.Items)));
    }
    /**
     * fetches all pages. may uses all provisionedOutput, therefore for client side use cases rather use pagedDatasource (exec)
     */
    execFetchAll() {
        return fetch_all_function_1.fetchAll(this);
    }
}
/** Infinite limit will remove the Limit param from request params when calling ReadManyRequest.limit(ReadManyRequest.INFINITE_LIMIT) */
ReadManyRequest.INFINITE_LIMIT = -1;
exports.ReadManyRequest = ReadManyRequest;
//# sourceMappingURL=read-many.request.js.map