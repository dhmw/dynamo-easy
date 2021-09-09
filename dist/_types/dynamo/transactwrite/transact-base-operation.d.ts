/**
 * @module multi-model-requests/transact-write
 */
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import { Metadata } from '../../decorator/metadata/metadata';
import { ModelConstructor } from '../../model/model-constructor';
import { RequestConditionFunction, RequestConditionFunctionTyped } from '../expression/type/condition-expression-definition-chain';
import { ConditionExpressionDefinitionFunction } from '../expression/type/condition-expression-definition-function';
import { ConditionalParamsHost } from '../operation-params.type';
/**
 * Abstract base class for all transact items.
 */
export declare abstract class TransactBaseOperation<T, I extends DynamoDB.ConditionCheck | DynamoDB.Put | DynamoDB.Update | DynamoDB.Delete, R extends TransactBaseOperation<T, I, any>> implements ConditionalParamsHost {
    readonly params: I;
    readonly metadata: Metadata<T>;
    readonly modelClazz: ModelConstructor<T>;
    abstract readonly transactItem: DynamoDB.TransactWriteItem;
    protected constructor(modelClazz: ModelConstructor<T>);
    /**
     * create a condition on given attributePath
     * @example req.onlyIfAttribute('age').lt(10)
     */
    onlyIfAttribute<K extends keyof T>(attributePath: K): RequestConditionFunctionTyped<this, T, K>;
    onlyIfAttribute(attributePath: string): RequestConditionFunction<this, T>;
    /**
     * add a condition necessary for the transaction to succeed
     * @example req.onlyIf(or(attribute('age').lt(10), attribute('age').gt(20)))
     */
    onlyIf(...conditionDefFns: ConditionExpressionDefinitionFunction[]): this;
    /**
     * get the item attributes if the condition fails
     */
    returnValuesOnConditionCheckFailure(value: DynamoDB.ReturnValuesOnConditionCheckFailure): this;
}
