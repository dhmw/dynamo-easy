"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../../../logger/logger");
const mapper_1 = require("../../../mapper/mapper");
const create_if_not_exists_condition_function_1 = require("../../expression/create-if-not-exists-condition.function");
const write_request_1 = require("../write.request");
/**
 * Request class for the PutItem operation.
 */
class PutRequest extends write_request_1.WriteRequest {
    constructor(dynamoDBWrapper, modelClazz, item) {
        super(dynamoDBWrapper, modelClazz);
        this.logger = logger_1.createLogger('dynamo.request.PutRequest', modelClazz);
        this.params.Item = mapper_1.toDb(item, this.modelClazz);
    }
    /**
     * Adds a condition expression to the request, which makes sure the item will only be saved if the id does not exist
     * @param predicate if false is provided nothing happens (it does NOT remove the condition)
     */
    ifNotExists(predicate = true) {
        if (predicate) {
            this.onlyIf(...create_if_not_exists_condition_function_1.createIfNotExistsCondition(this.metadata));
        }
        return this;
    }
    returnValues(returnValues) {
        this.params.ReturnValues = returnValues;
        return this;
    }
    doRequest(params) {
        return this.dynamoDBWrapper.putItem(params);
    }
}
exports.PutRequest = PutRequest;
//# sourceMappingURL=put.request.js.map