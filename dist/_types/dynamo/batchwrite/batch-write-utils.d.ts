/**
 * @module multi-model-requests/batch-write
 */
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import { DynamoDbWrapper } from '../dynamo-db-wrapper';
/**
 * Function which executes batchWriteItem operations until all given items (as params) are processed (written).
 * Between each follow-up request (in case of unprocessed items) a delay is interposed calculated by the given backoffTime and throttleTimeSlot.
 * @param dynamoDBWrapper
 * @param params containing the items per table to create the batchWrite operation
 * @param backoffTimer used to determine how many time slots the follow-up request should be delayed
 * @param throttleTimeSlot used to calculate the effective wait time
 * @hidden
 */
export declare function batchWriteItemsWriteAll(dynamoDBWrapper: DynamoDbWrapper, params: DynamoDB.BatchWriteItemInput, backoffTimer: IterableIterator<number>, throttleTimeSlot: number): Promise<DynamoDB.BatchGetItemOutput>;
/**
 * @hidden
 */
export declare type BatchWriteItemOutputWithUnprocessedItems = DynamoDB.BatchWriteItemOutput & {
    UnprocessedItems: DynamoDB.BatchWriteItemRequestMap;
};
/**
 * @hidden
 */
export declare function hasUnprocessedItems(response: DynamoDB.BatchWriteItemOutput): response is BatchWriteItemOutputWithUnprocessedItems;
