/**
 * @module store-requests
 */
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import { randomExponentialBackoffTimer } from '../../../helper/random-exponential-backoff-timer.generator';
import { ModelConstructor } from '../../../model/model-constructor';
import { DynamoDbWrapper } from '../../dynamo-db-wrapper';
import { BaseRequest } from '../base.request';
/**
 * Request class for BatchWriteItem operation which supports a single model class only.
 */
export declare class BatchWriteSingleTableRequest<T, T2 = T> extends BaseRequest<T, T2, DynamoDB.BatchWriteItemInput, BatchWriteSingleTableRequest<T, T2>> {
    private readonly logger;
    private toKey;
    constructor(dynamoDBWrapper: DynamoDbWrapper, modelClazz: ModelConstructor<T>);
    /**
     * return item collection metrics.
     */
    returnItemCollectionMetrics(value: DynamoDB.ReturnItemCollectionMetrics): this;
    delete(items: Array<Partial<T>>): this;
    put(items: T[]): this;
    /**
     * execute the request
     * @param backoffTimer when unprocessed items are returned the next value of backoffTimer is used to determine how many time slots to wait before doing the next request
     * @param throttleTimeSlot the duration of a time slot in ms
     */
    exec(backoffTimer?: typeof randomExponentialBackoffTimer, throttleTimeSlot?: number): Promise<void>;
    /**
     * execute the request and return the full response
     * @param backoffTimer when unprocessed items are returned the next value of backoffTimer is used to determine how many time slots to wait before doing the next request
     * @param throttleTimeSlot the duration of a time slot in ms
     */
    execFullResponse(backoffTimer?: typeof randomExponentialBackoffTimer, throttleTimeSlot?: number): Promise<DynamoDB.BatchWriteItemOutput>;
    private write;
    private createDeleteRequest;
    private createPutRequest;
}
