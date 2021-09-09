/**
 * @module multi-model-requests/batch-get
 */
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import { randomExponentialBackoffTimer } from '../../helper/random-exponential-backoff-timer.generator';
import { ModelConstructor } from '../../model/model-constructor';
import { BatchGetFullResponse } from './batch-get-full.response';
import { BatchGetResponse } from './batch-get.response';
/**
 * Request class for the BatchGetItem operation. Read multiple items from one or more tables.
 */
export declare class BatchGetRequest {
    readonly dynamoDB: DynamoDB;
    readonly params: DynamoDB.BatchGetItemInput;
    private readonly dynamoDBWrapper;
    private readonly tables;
    private itemCounter;
    constructor(dynamoDB?: DynamoDB);
    /**
     * return ConsumedCapacity of the corresponding tables in the response
     */
    returnConsumedCapacity(level: DynamoDB.ReturnConsumedCapacity): BatchGetRequest;
    /**
     * read items of model by key
     * @param modelClazz the corresponding ModelConstructor
     * @param keys an array of partials of T that contains PartitionKey and SortKey (if necessary). Throws if missing.
     * @param consistentRead set to true so the operation uses strongly consistent reads, default false
     */
    forModel<T>(modelClazz: ModelConstructor<T>, keys: Array<Partial<T>>, consistentRead?: boolean): BatchGetRequest;
    /**
     * execute the request and return the raw response (without parsing the attributes to js objects)
     * @param backoffTimer when unprocessed items are returned the next value of backoffTimer is used to determine how many time slots to wait before doing the next request
     * @param throttleTimeSlot the duration of a time slot in ms
     */
    execNoMap(backoffTimer?: typeof randomExponentialBackoffTimer, throttleTimeSlot?: number): Promise<DynamoDB.BatchGetItemOutput>;
    /**
     * execute and return full response with the mapped js objects per table
     * @param backoffTimer when unprocessed items are returned the next value of backoffTimer is used to determine how many time slots to wait before doing the next request
     * @param throttleTimeSlot the duration of a time slot in ms
     */
    execFullResponse(backoffTimer?: typeof randomExponentialBackoffTimer, throttleTimeSlot?: number): Promise<BatchGetFullResponse>;
    /**
     * execute and return the parsed items per table
     * @param backoffTimer when unprocessed items are returned the next value of backoffTimer is used to determine how many time slots to wait before doing the next request
     * @param throttleTimeSlot the duration of a time slot in ms
     */
    exec(backoffTimer?: typeof randomExponentialBackoffTimer, throttleTimeSlot?: number): Promise<BatchGetResponse>;
    private fetch;
    private mapResponse;
}
