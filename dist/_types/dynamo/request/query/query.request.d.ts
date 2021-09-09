/**
 * @module store-requests
 */
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import { Logger } from '../../../logger/logger';
import { ModelConstructor } from '../../../model/model-constructor';
import { DynamoDbWrapper } from '../../dynamo-db-wrapper';
import { SortKeyConditionFunction } from '../../expression/type/sort-key-condition-function';
import { ReadManyRequest } from '../read-many.request';
import { QueryResponse } from './query.response';
/**
 * Request class for the Query operation.
 */
export declare class QueryRequest<T, T2 = T> extends ReadManyRequest<T, T2, DynamoDB.QueryInput, DynamoDB.QueryOutput, QueryResponse<T2>, QueryRequest<T, T2>, QueryRequest<T, Partial<T>>> {
    protected readonly logger: Logger;
    constructor(dynamoDBWrapper: DynamoDbWrapper, modelClazz: ModelConstructor<T>);
    wherePartitionKey(partitionKeyValue: any): this;
    /**
     * used to define some condition for the sort key, use the secondary index to query based on a custom index
     */
    whereSortKey(): SortKeyConditionFunction<this>;
    ascending(): this;
    descending(): this;
    protected doRequest(params: DynamoDB.QueryInput): Promise<DynamoDB.QueryOutput>;
}
