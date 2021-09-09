"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promise_tap_function_1 = require("../../helper/promise-tap.function");
const mapper_1 = require("../../mapper/mapper");
const public_api_1 = require("../expression/logical-operator/public.api");
const param_util_1 = require("../expression/param-util");
const request_expression_builder_1 = require("../expression/request-expression-builder");
const standard_request_1 = require("./standard.request");
/**
 * abstract class for all basic write request classes (DeleteItem, PutItem, UpdateItem
 */
class WriteRequest extends standard_request_1.StandardRequest {
    constructor(dynamoDBWrapper, modelClazz) {
        super(dynamoDBWrapper, modelClazz);
    }
    /**
     * return item collection metrics.
     */
    returnItemCollectionMetrics(returnItemCollectionMetrics) {
        this.params.ReturnItemCollectionMetrics = returnItemCollectionMetrics;
        return this;
    }
    onlyIfAttribute(attributePath) {
        return request_expression_builder_1.addCondition('ConditionExpression', attributePath, this, this.metadata);
    }
    /**
     * @example writeRequest.onlyIf( attribute('age').eq(23) )
     * @example writeRequest.onlyIf( or( attribute('age').lt(18), attribute('age').gt(65) ) )
     */
    onlyIf(...conditionDefFns) {
        const condition = public_api_1.and(...conditionDefFns)(undefined, this.metadata);
        param_util_1.addExpression('ConditionExpression', condition, this.params);
        return this;
    }
    /**
     * @returns { void } if no ReturnValues are requested, { T } if the requested ReturnValues are ALL_OLD|ALL_NEW or {Partial<T>} if the requested ReturnValues are UPDATED_OLD|UPDATED_NEW
     */
    exec() {
        /*
         * kind a hacky - this is just for typing reasons so Promise<void> is the default return type when not defining a
         * returnValues other than NONE
         */
        return this.execFullResponse().then((r) => r.Item);
    }
    /**
     * execute request and return the full response
     */
    execFullResponse() {
        this.logger.debug('request', this.params);
        return this.doRequest(this.params)
            .then(promise_tap_function_1.promiseTap((response) => this.logger.debug('response', response)))
            .then((resp) => {
            const attrs = resp.Attributes;
            delete resp.Attributes; // delete Attributes on response so it will not be on returned value
            const r = resp;
            if (typeof attrs === 'object' && attrs !== null) {
                /*
                 * kind a hacky - this is just for typing reasons so Item is default not defined when not defining a
                 * returnValues other than NONE
                 */
                ;
                r.Item = mapper_1.fromDb(attrs, this.modelClazz);
            }
            return r;
        })
            .then(promise_tap_function_1.promiseTap((resp) => this.logger.debug('mapped response', resp)));
    }
    /**
     * execute request without parsing (mapping) the response attributes to js objects
     */
    execNoMap() {
        this.logger.debug('request', this.params);
        return this.doRequest(this.params).then(promise_tap_function_1.promiseTap((response) => this.logger.debug('response', response)));
    }
}
exports.WriteRequest = WriteRequest;
//# sourceMappingURL=write.request.js.map