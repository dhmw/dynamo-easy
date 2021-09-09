/**
 * @module store-requests
 */
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import { ModelConstructor } from '../../../model/model-constructor';
import { DynamoDbWrapper } from '../../dynamo-db-wrapper';
import { BaseRequest } from '../base.request';
import { TransactGetResponse } from './transact-get-single-table.response';
/**
 * Request class for TransactGetItems operation which supports a single model class only.
 */
export declare class TransactGetSingleTableRequest<T, T2 = T> extends BaseRequest<T, T2, DynamoDB.TransactGetItemsInput, TransactGetSingleTableRequest<T, T2>> {
    constructor(dynamoDBWrapper: DynamoDbWrapper, modelClazz: ModelConstructor<T>, keys: Array<Partial<T>>);
    /**
     * fetch all entries and return the raw response (without parsing the attributes to js objects)
     */
    execNoMap(): Promise<DynamoDB.TransactGetItemsOutput>;
    execFullResponse(): Promise<TransactGetResponse<T2>>;
    /**
     * execute request and return the parsed items
     */
    exec(): Promise<T2[]>;
    private mapResponse;
}
