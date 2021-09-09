import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import { Metadata } from '../../../decorator/metadata/metadata';
/**
 * Adds ProjectionExpression param and expressionAttributeNames to the params object
 */
export declare function addProjectionExpressionParam<T>(attributesToGet: Array<keyof T | string>, params: DynamoDB.QueryInput | DynamoDB.ScanInput | DynamoDB.GetItemInput | DynamoDB.KeysAndAttributes, metadata?: Metadata<T>): void;
