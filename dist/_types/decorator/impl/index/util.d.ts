/**
 * @module decorators
 */
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import { IndexType } from './index-type.enum';
/**
 * @hidden
 */
export interface IndexData {
    name: string;
    keyType: DynamoDB.KeyType;
}
/**
 * @hidden
 */
export declare function initOrUpdateIndex(indexType: IndexType, indexData: IndexData, target: any, propertyKey: string): void;
