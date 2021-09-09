/**
 * @module store-requests
 */
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import { Logger } from '../../../logger/logger';
import { ModelConstructor } from '../../../model/model-constructor';
import { DynamoDbWrapper } from '../../dynamo-db-wrapper';
import { WriteRequest } from '../write.request';
/**
 * Request class for the DeleteItem operation.
 */
export declare class DeleteRequest<T, T2 = void> extends WriteRequest<T, T2, DynamoDB.DeleteItemInput, DynamoDB.DeleteItemOutput, DeleteRequest<T, T2>> {
    protected readonly logger: Logger;
    constructor(dynamoDBWrapper: DynamoDbWrapper, modelClazz: ModelConstructor<T>, partitionKey: any, sortKey?: any);
    returnValues(returnValues: 'ALL_OLD'): DeleteRequest<T, T>;
    returnValues(returnValues: 'NONE'): DeleteRequest<T, void>;
    protected doRequest(params: DynamoDB.DeleteItemInput): Promise<DynamoDB.DeleteItemOutput>;
}
