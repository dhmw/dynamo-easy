/**
 * @module store-requests
 */
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import { Omit } from '../../../model/omit.type';
export declare type TransactGetResponse<T> = Omit<DynamoDB.TransactGetItemsOutput, 'Responses'> & {
    Items: T[];
};
