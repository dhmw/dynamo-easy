/**
 * @module multi-model-requests/batch-write
 */
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import { randomExponentialBackoffTimer } from '../../helper/random-exponential-backoff-timer.generator';
import { ModelConstructor } from '../../model/model-constructor';
/**
 * Request class for the BatchWriteItem operation. Put or delete multiple items in one or more table.
 */
export declare class BatchWriteRequest {
    readonly dynamoDB: DynamoDB;
    readonly params: DynamoDB.BatchWriteItemInput;
    private readonly dynamoDBWrapper;
    private itemCount;
    constructor(dynamoDB?: DynamoDB);
    /**
     * return ConsumedCapacity of the corresponding tables in the response
     */
    returnConsumedCapacity(value: DynamoDB.ReturnConsumedCapacity): BatchWriteRequest;
    /**
     * return item collection metrics.
     */
    returnItemCollectionMetrics(value: DynamoDB.ReturnItemCollectionMetrics): BatchWriteRequest;
    /**
     * add keys for deletion
     * @param modelClazz the corresponding ModelConstructor
     * @param keys an array of partials of T that contains PartitionKey and SortKey (if necessary). Throws if missing.
     */
    delete<T>(modelClazz: ModelConstructor<T>, keys: Array<Partial<T>>): BatchWriteRequest;
    /**
     * add items to put
     * @param modelClazz the corresponding ModelConstructor
     * @param items the items to put
     */
    put<T>(modelClazz: ModelConstructor<T>, items: T[]): BatchWriteRequest;
    /**
     * execute request
     * @param backoffTimer generator for how much timeSlots should be waited before requesting next batch. only used when capacity was exceeded. default randomExponentialBackoffTimer
     * @param throttleTimeSlot defines how long one timeSlot is for throttling, default 1 second
     */
    exec(backoffTimer?: typeof randomExponentialBackoffTimer, throttleTimeSlot?: number): Promise<void>;
    /**
     * execute request and return (last) response
     * @param backoffTimer generator for how much timeSlots should be waited before requesting next batch. only used when capacity was exceeded. default randomExponentialBackoffTimer
     * @param throttleTimeSlot defines how long one timeSlot is for throttling, default 1 second
     */
    execFullResponse(backoffTimer?: typeof randomExponentialBackoffTimer, throttleTimeSlot?: number): Promise<DynamoDB.BatchWriteItemOutput>;
    private requestItems;
    private write;
    private createDeleteRequest;
    private createPutRequest;
}
