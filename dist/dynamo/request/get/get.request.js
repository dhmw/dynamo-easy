"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promise_tap_function_1 = require("../../../helper/promise-tap.function");
const logger_1 = require("../../../logger/logger");
const mapper_1 = require("../../../mapper/mapper");
const add_projection_expression_param_function_1 = require("../helper/add-projection-expression-param.function");
const standard_request_1 = require("../standard.request");
/**
 * Request class for the GetItem operation.
 */
class GetRequest extends standard_request_1.StandardRequest {
    constructor(dynamoDBWrapper, modelClazz, partitionKey, sortKey) {
        super(dynamoDBWrapper, modelClazz);
        this.logger = logger_1.createLogger('dynamo.request.GetRequest', modelClazz);
        this.params.Key = mapper_1.createKeyAttributes(this.metadata, partitionKey, sortKey);
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
    execFullResponse() {
        this.logger.debug('request', this.params);
        return this.dynamoDBWrapper
            .getItem(this.params)
            .then(promise_tap_function_1.promiseTap((response) => this.logger.debug('response', response)))
            .then((getItemResponse) => {
            const response = Object.assign({}, getItemResponse);
            if (getItemResponse.Item) {
                response.Item = mapper_1.fromDb(getItemResponse.Item, this.modelClazz);
            }
            else {
                response.Item = null;
            }
            return response;
        })
            .then(promise_tap_function_1.promiseTap((response) => this.logger.debug('mapped item', response.Item)));
    }
    /**
     * execute request and return the parsed item
     */
    exec() {
        this.logger.debug('request', this.params);
        return this.dynamoDBWrapper
            .getItem(this.params)
            .then(promise_tap_function_1.promiseTap((response) => this.logger.debug('response', response)))
            .then((response) => {
            if (response.Item) {
                return mapper_1.fromDb(response.Item, this.modelClazz);
            }
            else {
                return null;
            }
        })
            .then(promise_tap_function_1.promiseTap((item) => this.logger.debug('mapped item', item)));
    }
}
exports.GetRequest = GetRequest;
//# sourceMappingURL=get.request.js.map