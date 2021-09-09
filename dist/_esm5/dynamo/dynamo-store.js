import { promiseTap } from '../helper/promise-tap.function';
import { createLogger } from '../logger/logger';
import { DynamoDbWrapper } from './dynamo-db-wrapper';
import { getTableName } from './get-table-name.function';
import { BatchGetSingleTableRequest } from './request/batchgetsingletable/batch-get-single-table.request';
import { BatchWriteSingleTableRequest } from './request/batchwritesingletable/batch-write-single-table.request';
import { DeleteRequest } from './request/delete/delete.request';
import { GetRequest } from './request/get/get.request';
import { PutRequest } from './request/put/put.request';
import { QueryRequest } from './request/query/query.request';
import { ScanRequest } from './request/scan/scan.request';
import { TransactGetSingleTableRequest } from './request/transactgetsingletable/transact-get-single-table.request';
import { UpdateRequest } from './request/update/update.request';
/**
 * DynamoStore
 */
var DynamoStore = /** @class */ (function () {
    function DynamoStore(modelClazz, dynamoDB) {
        this.modelClazz = modelClazz;
        this.logger = createLogger('dynamo.DynamoStore', modelClazz);
        this.dynamoDBWrapper = new DynamoDbWrapper(dynamoDB);
        this.tableName = getTableName(modelClazz);
        this.logger.debug('instance created');
    }
    Object.defineProperty(DynamoStore.prototype, "dynamoDB", {
        get: function () {
            return this.dynamoDBWrapper.dynamoDB;
        },
        enumerable: true,
        configurable: true
    });
    DynamoStore.prototype.put = function (item) {
        return new PutRequest(this.dynamoDBWrapper, this.modelClazz, item);
    };
    DynamoStore.prototype.get = function (partitionKey, sortKey) {
        return new GetRequest(this.dynamoDBWrapper, this.modelClazz, partitionKey, sortKey);
    };
    DynamoStore.prototype.update = function (partitionKey, sortKey) {
        return new UpdateRequest(this.dynamoDBWrapper, this.modelClazz, partitionKey, sortKey);
    };
    DynamoStore.prototype.delete = function (partitionKey, sortKey) {
        return new DeleteRequest(this.dynamoDBWrapper, this.modelClazz, partitionKey, sortKey);
    };
    DynamoStore.prototype.scan = function () {
        return new ScanRequest(this.dynamoDBWrapper, this.modelClazz);
    };
    DynamoStore.prototype.query = function () {
        return new QueryRequest(this.dynamoDBWrapper, this.modelClazz);
    };
    /**
     * This is a special implementation of BatchGetItem request, because it only supports one table,
     * if you wish to retrieve items from multiple tables
     * create an instance of BatchGetItemInput and use store.makeRequest with it.
     */
    DynamoStore.prototype.batchGet = function (keys) {
        return new BatchGetSingleTableRequest(this.dynamoDBWrapper, this.modelClazz, keys);
    };
    /**
     * This is a special implementation of batchWriteItem request, because it only supports one table,
     * if you wish to write items to multiple tables
     * create an instance of BatchWriteItemInput and use store.makeRequest with it.
     */
    DynamoStore.prototype.batchWrite = function () {
        return new BatchWriteSingleTableRequest(this.dynamoDBWrapper, this.modelClazz);
    };
    DynamoStore.prototype.transactGet = function (keys) {
        return new TransactGetSingleTableRequest(this.dynamoDBWrapper, this.modelClazz, keys);
    };
    DynamoStore.prototype.makeRequest = function (operation, params) {
        var _this = this;
        this.logger.debug('request', params);
        return this.dynamoDBWrapper
            .makeRequest(operation, params)
            .then(promiseTap(function (r) { return _this.logger.debug('response', r); }));
    };
    return DynamoStore;
}());
export { DynamoStore };
//# sourceMappingURL=dynamo-store.js.map