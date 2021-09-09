"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../../../logger/logger");
const mapper_1 = require("../../../mapper/mapper");
const write_request_1 = require("../write.request");
/**
 * Request class for the DeleteItem operation.
 */
class DeleteRequest extends write_request_1.WriteRequest {
    constructor(dynamoDBWrapper, modelClazz, partitionKey, sortKey) {
        super(dynamoDBWrapper, modelClazz);
        this.logger = logger_1.createLogger('dynamo.request.DeleteRequest', modelClazz);
        this.params.Key = mapper_1.createKeyAttributes(this.metadata, partitionKey, sortKey);
    }
    returnValues(returnValues) {
        this.params.ReturnValues = returnValues;
        return this;
    }
    doRequest(params) {
        return this.dynamoDBWrapper.deleteItem(params);
    }
}
exports.DeleteRequest = DeleteRequest;
//# sourceMappingURL=delete.request.js.map