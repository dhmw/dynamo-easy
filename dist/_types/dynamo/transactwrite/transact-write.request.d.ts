/**
 * @module multi-model-requests/transact-write
 */
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import { TransactOperation } from './transact-operation.type';
/**
 * Request class for the TransactWriteItems operation. Write up to 25 items to one or many tables in a transaction.
 */
export declare class TransactWriteRequest {
    readonly dynamoDB: DynamoDB;
    readonly params: DynamoDB.TransactWriteItemsInput;
    private readonly dynamoDBWrapper;
    constructor(dynamoDB?: DynamoDB);
    /**
     * return ConsumedCapacity of the corresponding table(s) in the response
     */
    returnConsumedCapacity(level: DynamoDB.ReturnConsumedCapacity): this;
    /**
     * return item collection metrics.
     */
    returnItemCollectionMetrics(returnItemCollectionMetrics: DynamoDB.ReturnItemCollectionMetrics): this;
    /**
     * add up to 25 transaction operations
     * create the operations with:
     * {@link TransactConditionCheck}, {@link TransactDelete}, {@link TransactPut}, {@link TransactUpdate}
     */
    transact(...writeOperations: TransactOperation[]): this;
    /**
     * execute the request and return the full reponse.
     */
    execFullResponse(): Promise<DynamoDB.TransactWriteItemsOutput>;
    /**
     * execute the request.
     */
    exec(): Promise<void>;
}
