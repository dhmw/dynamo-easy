/**
 * @module store-requests
 */
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import { Logger } from '../../../logger/logger';
import { ModelConstructor } from '../../../model/model-constructor';
import { DynamoDbWrapper } from '../../dynamo-db-wrapper';
import { WriteRequest } from '../write.request';
/**
 * Request class for the PutItem operation.
 */
export declare class PutRequest<T, T2 = void> extends WriteRequest<T, T2, DynamoDB.PutItemInput, DynamoDB.PutItemOutput, PutRequest<T, T2>> {
    protected readonly logger: Logger;
    constructor(dynamoDBWrapper: DynamoDbWrapper, modelClazz: ModelConstructor<T>, item: T);
    /**
     * Adds a condition expression to the request, which makes sure the item will only be saved if the id does not exist
     * @param predicate if false is provided nothing happens (it does NOT remove the condition)
     */
    ifNotExists(predicate?: boolean): this;
    returnValues(returnValues: 'ALL_OLD'): PutRequest<T, T>;
    returnValues(returnValues: 'NONE'): PutRequest<T, void>;
    protected doRequest(params: DynamoDB.PutItemInput): Promise<DynamoDB.PutItemOutput>;
}
