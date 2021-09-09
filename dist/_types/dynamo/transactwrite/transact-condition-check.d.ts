/**
 * @module multi-model-requests/transact-write
 */
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import { ModelConstructor } from '../../model/model-constructor';
import { TransactBaseOperation } from './transact-base-operation';
/**
 * TransactOperation class for transactional condition checks.
 */
export declare class TransactConditionCheck<T> extends TransactBaseOperation<T, DynamoDB.ConditionCheck, TransactConditionCheck<T>> {
    constructor(modelClazz: ModelConstructor<T>, partitionKey: any, sortKey?: any);
    readonly transactItem: {
        ConditionCheck: {
            Key: DynamoDB.Key;
            TableName: string;
            ConditionExpression: string;
            ExpressionAttributeNames?: DynamoDB.ExpressionAttributeNameMap | undefined;
            ExpressionAttributeValues?: DynamoDB.ExpressionAttributeValueMap | undefined;
            ReturnValuesOnConditionCheckFailure?: string | undefined;
        };
    };
}
