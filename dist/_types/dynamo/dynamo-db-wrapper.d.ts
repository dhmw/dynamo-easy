/**
 * @module dynamo-easy
 */
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
/**
 * Simply calls the sessionValidityEnsurer before each standard dynamoDB operations and returns a promise for each
 * request
 * @hidden
 */
export declare class DynamoDbWrapper {
    readonly dynamoDB: DynamoDB;
    constructor(dynamoDB?: DynamoDB);
    putItem(params: DynamoDB.PutItemInput): Promise<DynamoDB.PutItemOutput>;
    getItem(params: DynamoDB.GetItemInput): Promise<DynamoDB.GetItemOutput>;
    updateItem(params: DynamoDB.UpdateItemInput): Promise<DynamoDB.UpdateItemOutput>;
    deleteItem(params: DynamoDB.DeleteItemInput): Promise<DynamoDB.DeleteItemOutput>;
    batchWriteItem(params: DynamoDB.BatchWriteItemInput): Promise<DynamoDB.BatchWriteItemOutput>;
    batchGetItems(params: DynamoDB.BatchGetItemInput): Promise<DynamoDB.BatchGetItemOutput>;
    transactWriteItems(params: DynamoDB.TransactWriteItemsInput): Promise<DynamoDB.TransactWriteItemsOutput>;
    transactGetItems(params: DynamoDB.TransactGetItemsInput): Promise<DynamoDB.TransactGetItemsOutput>;
    scan(params: DynamoDB.ScanInput): Promise<DynamoDB.ScanOutput>;
    query(params: DynamoDB.QueryInput): Promise<DynamoDB.QueryOutput>;
    makeRequest(operation: string, params?: Record<string, any>): Promise<any>;
}
