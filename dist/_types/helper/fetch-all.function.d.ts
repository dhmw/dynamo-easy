/**
 * @module helper
 */
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import { QueryRequest } from '../dynamo/request/query/query.request';
import { ScanRequest } from '../dynamo/request/scan/scan.request';
/**
 * When we cant load all the items of a table with one request, we will fetch as long as there is more data
 * available. This can be used with scan and query requests.
 */
export declare function fetchAll<T>(request: ScanRequest<T> | QueryRequest<T>, startKey?: DynamoDB.Key): Promise<T[]>;
