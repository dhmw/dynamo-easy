/**
 * @module multi-model-requests/transact-write
 */
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import { ModelConstructor } from '../../model/model-constructor';
import { TransactBaseOperation } from './transact-base-operation';
/**
 * TransactOperation class for transactional delete items
 */
export declare class TransactDelete<T> extends TransactBaseOperation<T, DynamoDB.Delete, TransactDelete<T>> {
    constructor(modelClazz: ModelConstructor<T>, partitionKey: any, sortKey?: any);
    readonly transactItem: {
        Delete: {
            Key: DynamoDB.Key;
            TableName: string;
            ConditionExpression?: string | undefined;
            ExpressionAttributeNames?: DynamoDB.ExpressionAttributeNameMap | undefined;
            ExpressionAttributeValues?: DynamoDB.ExpressionAttributeValueMap | undefined;
            ReturnValuesOnConditionCheckFailure?: string | undefined;
        };
    };
}
