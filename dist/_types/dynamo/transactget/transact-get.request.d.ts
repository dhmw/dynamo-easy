/**
 * @module multi-model-requests/transact-get
 */
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import { ModelConstructor } from '../../model/model-constructor';
import { TransactGetFullResponse } from './transact-get-full.response';
import { TransactGetRequest1 } from './transact-get.request.type';
/**
 * Request class for the TransactGetItems operation. Read up to 10 items from one or more tables in a transaction.
 */
export declare class TransactGetRequest {
    readonly dynamoDB: DynamoDB;
    readonly params: DynamoDB.TransactGetItemsInput;
    private readonly dynamoDBWrapper;
    private readonly tables;
    constructor(dynamoDB?: DynamoDB);
    /**
     * read item of model by key
     * @param modelClazz the corresponding ModelConstructor
     * @param key partial of T that contains PartitionKey and SortKey (if necessary). Throws if missing.
     */
    forModel<T>(modelClazz: ModelConstructor<T>, key: Partial<T>): TransactGetRequest1<T>;
    /**
     * return ConsumedCapacity of the corresponding tables in the response
     */
    returnConsumedCapacity(level: DynamoDB.ReturnConsumedCapacity): TransactGetRequest;
    /**
     * execute request and return the raw response (without parsing the attributes to js objects)
     */
    execNoMap(): Promise<DynamoDB.TransactGetItemsOutput>;
    /**
     * execute request and return full response with the mapped js objects.
     */
    execFullResponse(): Promise<TransactGetFullResponse<any[]>>;
    /**
     * execute request and return the parsed items.
     */
    exec(): Promise<any[]>;
    private mapResponse;
}
