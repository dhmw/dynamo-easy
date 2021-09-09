"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../../../logger/logger");
const mapper_1 = require("../../../mapper/mapper");
const prepare_and_add_update_expressions_function_1 = require("../../expression/prepare-and-add-update-expressions.function");
const request_expression_builder_1 = require("../../expression/request-expression-builder");
const write_request_1 = require("../write.request");
/**
 * Request class for the UpdateItem operation.
 */
class UpdateRequest extends write_request_1.WriteRequest {
    constructor(dynamoDBWrapper, modelClazz, partitionKey, sortKey) {
        super(dynamoDBWrapper, modelClazz);
        this.logger = logger_1.createLogger('dynamo.request.UpdateRequest', modelClazz);
        this.params.Key = mapper_1.createKeyAttributes(this.metadata, partitionKey, sortKey);
    }
    /**
     * create and add a single update operation
     * @example req.updateAttribute('path.to.attr').set('newVal')
     */
    updateAttribute(attributePath) {
        return request_expression_builder_1.addUpdate(attributePath, this, this.metadata);
    }
    /**
     * add multiple update operations comma separated
     * @example req.operations(update('path.to.attr).set('newVal'), ... )
     */
    operations(...updateDefFns) {
        prepare_and_add_update_expressions_function_1.prepareAndAddUpdateExpressions(this.metadata, this.params, updateDefFns);
        return this;
    }
    returnValues(returnValues) {
        this.params.ReturnValues = returnValues;
        return this;
    }
    doRequest(params) {
        return this.dynamoDBWrapper.updateItem(this.params);
    }
}
exports.UpdateRequest = UpdateRequest;
//# sourceMappingURL=update.request.js.map