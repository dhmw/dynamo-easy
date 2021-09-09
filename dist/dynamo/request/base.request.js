"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metadata_for_model_function_1 = require("../../decorator/metadata/metadata-for-model.function");
const get_table_name_function_1 = require("../get-table-name.function");
/**
 * abstract class for all request classes usable with DynamoStore.
 * which means they have only one table they work with
 * (even if the actual operation would allow to use multiple tables. e.g. BatchWriteSingleTable)
 */
class BaseRequest {
    constructor(dynamoDBWrapper, modelClazz) {
        this.dynamoDBWrapper = dynamoDBWrapper;
        if (modelClazz === null || modelClazz === undefined) {
            throw new Error(`please provide the ModelConstructor for the request, won't work otherwise`);
        }
        this.modelClazz = modelClazz;
        this.metadata = metadata_for_model_function_1.metadataForModel(this.modelClazz);
        if (!this.metadata.modelOptions) {
            throw new Error('given ModelConstructor has no @Model decorator');
        }
        this.tableName = get_table_name_function_1.getTableName(this.metadata);
        this.params = {};
    }
    /**
     * return ConsumedCapacity of the corresponding table(s) in the response
     * @param level not all requests support all values
     */
    returnConsumedCapacity(level) {
        this.params.ReturnConsumedCapacity = level;
        return this;
    }
}
exports.BaseRequest = BaseRequest;
//# sourceMappingURL=base.request.js.map