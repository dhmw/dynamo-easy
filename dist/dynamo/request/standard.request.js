"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_table_name_function_1 = require("../get-table-name.function");
const base_request_1 = require("./base.request");
/**
 * abstract class for all requests types that operate on exactly one dynamo table.
 * basically just sets the TableName info on input params.
 */
class StandardRequest extends base_request_1.BaseRequest {
    constructor(dynamoDBWrapper, modelClazz) {
        super(dynamoDBWrapper, modelClazz);
        this.params.TableName = get_table_name_function_1.getTableName(this.metadata);
    }
}
exports.StandardRequest = StandardRequest;
//# sourceMappingURL=standard.request.js.map