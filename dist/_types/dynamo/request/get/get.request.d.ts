/**
 * @module store-requests
 */
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import { ModelConstructor } from '../../../model/model-constructor';
import { DynamoDbWrapper } from '../../dynamo-db-wrapper';
import { StandardRequest } from '../standard.request';
import { GetResponse } from './get.response';
/**
 * Request class for the GetItem operation.
 */
export declare class GetRequest<T, T2 = T> extends StandardRequest<T, T2, DynamoDB.GetItemInput, GetRequest<T, T2>> {
    private readonly logger;
    constructor(dynamoDBWrapper: DynamoDbWrapper, modelClazz: ModelConstructor<T>, partitionKey: any, sortKey?: any);
    /**
     * Determines the read consistency model: If set to true, then the operation uses strongly consistent reads; otherwise, the operation uses eventually consistent reads.
     */
    consistentRead(consistentRead?: boolean): this;
    /**
     * Specifies the list of model attributes to be returned from the table instead of returning the entire document
     * @param attributesToGet List of model attributes to be returned
     */
    projectionExpression(...attributesToGet: Array<keyof T | string>): GetRequest<T, Partial<T>>;
    execFullResponse(): Promise<GetResponse<T2>>;
    /**
     * execute request and return the parsed item
     */
    exec(): Promise<T2 | null>;
}
