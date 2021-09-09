import { metadataForModel } from '../../decorator/metadata/metadata-for-model.function';
import { getTableName } from '../get-table-name.function';
/**
 * abstract class for all request classes usable with DynamoStore.
 * which means they have only one table they work with
 * (even if the actual operation would allow to use multiple tables. e.g. BatchWriteSingleTable)
 */
export class BaseRequest {
    constructor(dynamoDBWrapper, modelClazz) {
        this.dynamoDBWrapper = dynamoDBWrapper;
        if (modelClazz === null || modelClazz === undefined) {
            throw new Error(`please provide the ModelConstructor for the request, won't work otherwise`);
        }
        this.modelClazz = modelClazz;
        this.metadata = metadataForModel(this.modelClazz);
        if (!this.metadata.modelOptions) {
            throw new Error('given ModelConstructor has no @Model decorator');
        }
        this.tableName = getTableName(this.metadata);
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
//# sourceMappingURL=base.request.js.map