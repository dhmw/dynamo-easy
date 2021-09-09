/**
 * @module store-requests
 */
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import { randomExponentialBackoffTimer } from '../../../helper/random-exponential-backoff-timer.generator';
import { ModelConstructor } from '../../../model/model-constructor';
import { DynamoDbWrapper } from '../../dynamo-db-wrapper';
import { BaseRequest } from '../base.request';
import { BatchGetSingleTableResponse } from './batch-get-single-table.response';
/**
 * Request class for BatchGetItem operation which supports a single model class only.
 */
export declare class BatchGetSingleTableRequest<T, T2 = T> extends BaseRequest<T, T2, DynamoDB.BatchGetItemInput, BatchGetSingleTableRequest<T, T2>> {
    private readonly logger;
    constructor(dynamoDBWrapper: DynamoDbWrapper, modelClazz: ModelConstructor<T>, keys: Array<Partial<T>>);
    /**
     * Determines the read consistency model: If set to true, then the operation uses strongly consistent reads; otherwise, the operation uses eventually consistent reads.
     */
    consistentRead(value?: boolean): this;
    /**
     * Specifies the list of model attributes to be returned from the table instead of returning the entire document
     * @param attributesToGet List of model attributes to be returned
     */
    projectionExpression(...attributesToGet: Array<keyof T | string>): BatchGetSingleTableRequest<T, Partial<T>>;
    /**
     * fetch all entries and return the raw response (without parsing the attributes to js objects)
     * @param backoffTimer when unprocessed keys are returned the next value of backoffTimer is used to determine how many time slots to wait before doing the next request
     * @param throttleTimeSlot the duration of a time slot in ms
     */
    execNoMap(backoffTimer?: typeof randomExponentialBackoffTimer, throttleTimeSlot?: number): Promise<DynamoDB.BatchGetItemOutput>;
    /**
     * fetch all entries and return an object containing the mapped items and the other response data
     * @param backoffTimer when unprocessed keys are returned the next value of backoffTimer is used to determine how many time slots to wait before doing the next request
     * @param throttleTimeSlot the duration of a time slot in ms
     */
    execFullResponse(backoffTimer?: typeof randomExponentialBackoffTimer, throttleTimeSlot?: number): Promise<BatchGetSingleTableResponse<T2>>;
    /**
     * fetch all entries and return the parsed items
     * @param backoffTimer when unprocessed keys are returned the next value of backoffTimer is used to determine how many time slots to wait before doing the next request
     * @param throttleTimeSlot the duration of a time slot in ms
     */
    exec(backoffTimer?: typeof randomExponentialBackoffTimer, throttleTimeSlot?: number): Promise<T2[]>;
    private mapResponse;
    private fetch;
}
