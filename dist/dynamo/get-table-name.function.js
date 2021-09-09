"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module dynamo-easy
 */
const dynamo_easy_config_1 = require("../config/dynamo-easy-config");
const metadata_1 = require("../decorator/metadata/metadata");
const metadata_for_model_function_1 = require("../decorator/metadata/metadata-for-model.function");
/**
 * only contains these characters «a-z A-Z 0-9 - _ .» and is between 3 and 255 characters long
 * http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Limits.html#limits-naming-rules
 * @hidden
 */
const REGEX_TABLE_NAME = /^[a-zA-Z0-9_\-.]{3,255}$/;
/**
 * @hidden
 */
function getTableName(metaDataOrModelClazz) {
    const modelOptions = metaDataOrModelClazz instanceof metadata_1.Metadata
        ? metaDataOrModelClazz.modelOptions
        : metadata_for_model_function_1.metadataForModel(metaDataOrModelClazz).modelOptions;
    const tableName = dynamo_easy_config_1.dynamoEasyConfig.tableNameResolver(modelOptions.tableName);
    if (!REGEX_TABLE_NAME.test(tableName)) {
        throw new Error(`make sure the table name «${tableName}» is valid (see http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Limits.html#limits-naming-rules for details)`);
    }
    return tableName;
}
exports.getTableName = getTableName;
//# sourceMappingURL=get-table-name.function.js.map