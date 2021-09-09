/**
 * @module multi-model-requests/batch-get
 */
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import { DynamoDbWrapper } from '../dynamo-db-wrapper';
/**
 * Function which executes batchGetItem operations until all given items (as params) are processed (fetched).
 * Between each follow-up request (in case of unprocessed items) a delay is interposed calculated by the given backoffTime and throttleTimeSlot.
 * @param dynamoDBWrapper
 * @param params containing the keys per table to create the batchGet operation
 * @param backoffTimer used to determine how many time slots the follow-up request should be delayed
 * @param throttleTimeSlot used to calculate the effective wait time
 * @hidden
 */
export declare function batchGetItemsFetchAll(dynamoDBWrapper: DynamoDbWrapper, params: DynamoDB.BatchGetItemInput, backoffTimer: IterableIterator<number>, throttleTimeSlot: number): Promise<DynamoDB.BatchGetItemOutput>;
/**
 * @hidden
 */
export declare type BatchGetItemOutputWithUnprocessedKeys = DynamoDB.BatchGetItemOutput & {
    UnprocessedKeys: DynamoDB.BatchGetRequestMap;
};
/**
 * @hidden
 */
export declare function hasUnprocessedKeys(response: DynamoDB.BatchGetItemOutput): response is BatchGetItemOutputWithUnprocessedKeys;
/**
 * combines a first with a second response. ConsumedCapacity is always from the latter.
 * @hidden
 */
export declare function combineBatchGetResponses(response1: DynamoDB.BatchGetItemOutput): (response2: DynamoDB.BatchGetItemOutput) => DynamoDB.BatchGetItemOutput;
