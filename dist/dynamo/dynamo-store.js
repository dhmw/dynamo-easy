"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promise_tap_function_1 = require("../helper/promise-tap.function");
const logger_1 = require("../logger/logger");
const dynamo_db_wrapper_1 = require("./dynamo-db-wrapper");
const get_table_name_function_1 = require("./get-table-name.function");
const batch_get_single_table_request_1 = require("./request/batchgetsingletable/batch-get-single-table.request");
const batch_write_single_table_request_1 = require("./request/batchwritesingletable/batch-write-single-table.request");
const delete_request_1 = require("./request/delete/delete.request");
const get_request_1 = require("./request/get/get.request");
const put_request_1 = require("./request/put/put.request");
const query_request_1 = require("./request/query/query.request");
const scan_request_1 = require("./request/scan/scan.request");
const transact_get_single_table_request_1 = require("./request/transactgetsingletable/transact-get-single-table.request");
const update_request_1 = require("./request/update/update.request");
/**
 * DynamoStore
 */
class DynamoStore {
    constructor(modelClazz, dynamoDB) {
        this.modelClazz = modelClazz;
        this.logger = logger_1.createLogger('dynamo.DynamoStore', modelClazz);
        this.dynamoDBWrapper = new dynamo_db_wrapper_1.DynamoDbWrapper(dynamoDB);
        this.tableName = get_table_name_function_1.getTableName(modelClazz);
        this.logger.debug('instance created');
    }
    get dynamoDB() {
        return this.dynamoDBWrapper.dynamoDB;
    }
    put(item) {
        return new put_request_1.PutRequest(this.dynamoDBWrapper, this.modelClazz, item);
    }
    get(partitionKey, sortKey) {
        return new get_request_1.GetRequest(this.dynamoDBWrapper, this.modelClazz, partitionKey, sortKey);
    }
    update(partitionKey, sortKey) {
        return new update_request_1.UpdateRequest(this.dynamoDBWrapper, this.modelClazz, partitionKey, sortKey);
    }
    delete(partitionKey, sortKey) {
        return new delete_request_1.DeleteRequest(this.dynamoDBWrapper, this.modelClazz, partitionKey, sortKey);
    }
    scan() {
        return new scan_request_1.ScanRequest(this.dynamoDBWrapper, this.modelClazz);
    }
    query() {
        return new query_request_1.QueryRequest(this.dynamoDBWrapper, this.modelClazz);
    }
    /**
     * This is a special implementation of BatchGetItem request, because it only supports one table,
     * if you wish to retrieve items from multiple tables
     * create an instance of BatchGetItemInput and use store.makeRequest with it.
     */
    batchGet(keys) {
        return new batch_get_single_table_request_1.BatchGetSingleTableRequest(this.dynamoDBWrapper, this.modelClazz, keys);
    }
    /**
     * This is a special implementation of batchWriteItem request, because it only supports one table,
     * if you wish to write items to multiple tables
     * create an instance of BatchWriteItemInput and use store.makeRequest with it.
     */
    batchWrite() {
        return new batch_write_single_table_request_1.BatchWriteSingleTableRequest(this.dynamoDBWrapper, this.modelClazz);
    }
    transactGet(keys) {
        return new transact_get_single_table_request_1.TransactGetSingleTableRequest(this.dynamoDBWrapper, this.modelClazz, keys);
    }
    makeRequest(operation, params) {
        this.logger.debug('request', params);
        return this.dynamoDBWrapper
            .makeRequest(operation, params)
            .then(promise_tap_function_1.promiseTap((r) => this.logger.debug('response', r)));
    }
}
exports.DynamoStore = DynamoStore;
//# sourceMappingURL=dynamo-store.js.map