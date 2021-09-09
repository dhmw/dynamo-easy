/**
 * @module multi-model-requests/transact-write
 */
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import { ModelConstructor } from '../../model/model-constructor';
import { RequestUpdateFunction } from '../expression/type/update-expression-definition-chain';
import { UpdateExpressionDefinitionFunction } from '../expression/type/update-expression-definition-function';
import { TransactBaseOperation } from './transact-base-operation';
/**
 * TransactOperation class for transactional update items.
 */
export declare class TransactUpdate<T> extends TransactBaseOperation<T, DynamoDB.Update, TransactUpdate<T>> {
    constructor(modelClazz: ModelConstructor<T>, partitionKey: any, sortKey?: any);
    /**
     * create and add a single update operation
     * @example updtTrans.updateAttribute('path.to.attr').set('newVal')
     */
    updateAttribute<K extends keyof T>(attributePath: K): RequestUpdateFunction<this, T, K>;
    /**
     * add multiple update ops
     * @example updtTrans.operations(update('path.to.attr).set('newVal'), ... )
     */
    operations(...updateDefFns: UpdateExpressionDefinitionFunction[]): this;
    readonly transactItem: {
        Update: {
            Key: DynamoDB.Key;
            UpdateExpression: string;
            TableName: string;
            ConditionExpression?: string | undefined;
            ExpressionAttributeNames?: DynamoDB.ExpressionAttributeNameMap | undefined;
            ExpressionAttributeValues?: DynamoDB.ExpressionAttributeValueMap | undefined;
            ReturnValuesOnConditionCheckFailure?: string | undefined;
        };
    };
}
