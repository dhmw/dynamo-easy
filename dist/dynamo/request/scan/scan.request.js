"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../../../logger/logger");
const read_many_request_1 = require("../read-many.request");
/**
 * Request class for the Scan operation.
 */
class ScanRequest extends read_many_request_1.ReadManyRequest {
    constructor(dynamoDBWrapper, modelClazz) {
        super(dynamoDBWrapper, modelClazz);
        this.logger = logger_1.createLogger('dynamo.request.ScanRequest', modelClazz);
    }
    doRequest(params) {
        return this.dynamoDBWrapper.scan(params);
    }
}
exports.ScanRequest = ScanRequest;
//# sourceMappingURL=scan.request.js.map