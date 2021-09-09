/**
 * @module dynamo-easy
 */
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import { ModelConstructor } from '../model/model-constructor';
import { DynamoApiOperations } from './dynamo-api-operations.type';
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
export declare class DynamoStore<T> {
    private modelClazz;
    readonly dynamoDB: DynamoDB;
    readonly tableName: string;
    private readonly logger;
    private readonly dynamoDBWrapper;
    constructor(modelClazz: ModelConstructor<T>, dynamoDB?: DynamoDB);
    put(item: T): PutRequest<T>;
    get(partitionKey: any, sortKey?: any): GetRequest<T>;
    update(partitionKey: any, sortKey?: any): UpdateRequest<T>;
    delete(partitionKey: any, sortKey?: any): DeleteRequest<T>;
    scan(): ScanRequest<T>;
    query(): QueryRequest<T>;
    /**
     * This is a special implementation of BatchGetItem request, because it only supports one table,
     * if you wish to retrieve items from multiple tables
     * create an instance of BatchGetItemInput and use store.makeRequest with it.
     */
    batchGet(keys: Array<Partial<T>>): BatchGetSingleTableRequest<T>;
    /**
     * This is a special implementation of batchWriteItem request, because it only supports one table,
     * if you wish to write items to multiple tables
     * create an instance of BatchWriteItemInput and use store.makeRequest with it.
     */
    batchWrite(): BatchWriteSingleTableRequest<T>;
    transactGet(keys: Array<Partial<T>>): TransactGetSingleTableRequest<T>;
    makeRequest<Z>(operation: DynamoApiOperations, params?: Record<string, any>): Promise<Z>;
}
