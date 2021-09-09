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
export class DynamoStore {
    constructor(modelClazz, dynamoDB) {
        this.modelClazz = modelClazz;
        this.logger = createLogger('dynamo.DynamoStore', modelClazz);
        this.dynamoDBWrapper = new DynamoDbWrapper(dynamoDB);
        this.tableName = getTableName(modelClazz);
        this.logger.debug('instance created');
    }
    get dynamoDB() {
        return this.dynamoDBWrapper.dynamoDB;
    }
    put(item) {
        return new PutRequest(this.dynamoDBWrapper, this.modelClazz, item);
    }
    get(partitionKey, sortKey) {
        return new GetRequest(this.dynamoDBWrapper, this.modelClazz, partitionKey, sortKey);
    }
    update(partitionKey, sortKey) {
        return new UpdateRequest(this.dynamoDBWrapper, this.modelClazz, partitionKey, sortKey);
    }
    delete(partitionKey, sortKey) {
        return new DeleteRequest(this.dynamoDBWrapper, this.modelClazz, partitionKey, sortKey);
    }
    scan() {
        return new ScanRequest(this.dynamoDBWrapper, this.modelClazz);
    }
    query() {
        return new QueryRequest(this.dynamoDBWrapper, this.modelClazz);
    }
    /**
     * This is a special implementation of BatchGetItem request, because it only supports one table,
     * if you wish to retrieve items from multiple tables
     * create an instance of BatchGetItemInput and use store.makeRequest with it.
     */
    batchGet(keys) {
        return new BatchGetSingleTableRequest(this.dynamoDBWrapper, this.modelClazz, keys);
    }
    /**
     * This is a special implementation of batchWriteItem request, because it only supports one table,
     * if you wish to write items to multiple tables
     * create an instance of BatchWriteItemInput and use store.makeRequest with it.
     */
    batchWrite() {
        return new BatchWriteSingleTableRequest(this.dynamoDBWrapper, this.modelClazz);
    }
    transactGet(keys) {
        return new TransactGetSingleTableRequest(this.dynamoDBWrapper, this.modelClazz, keys);
    }
    makeRequest(operation, params) {
        this.logger.debug('request', params);
        return this.dynamoDBWrapper
            .makeRequest(operation, params)
            .then(promiseTap((r) => this.logger.debug('response', r)));
    }
}
//# sourceMappingURL=dynamo-store.js.map