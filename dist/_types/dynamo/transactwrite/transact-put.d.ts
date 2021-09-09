/**
 * @module multi-model-requests/transact-write
 */
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import { ModelConstructor } from '../../model/model-constructor';
import { TransactBaseOperation } from './transact-base-operation';
/**
 * TransactOperation class for transactional put items.
 */
export declare class TransactPut<T> extends TransactBaseOperation<T, DynamoDB.Put, TransactPut<T>> {
    constructor(modelClazz: ModelConstructor<T>, item: T);
    /**
     * Adds a condition expression to the request, which makes sure the item will only be saved if the id does not exist
     */
    ifNotExists(predicate?: boolean): this;
    readonly transactItem: {
        Put: {
            Item: DynamoDB.PutItemInputAttributeMap;
            TableName: string;
            ConditionExpression?: string | undefined;
            ExpressionAttributeNames?: DynamoDB.ExpressionAttributeNameMap | undefined;
            ExpressionAttributeValues?: DynamoDB.ExpressionAttributeValueMap | undefined;
            ReturnValuesOnConditionCheckFailure?: string | undefined;
        };
    };
}
