/**
 * @module store-requests
 */
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import { Logger } from '../../logger/logger';
import { ModelConstructor } from '../../model/model-constructor';
import { Omit } from '../../model/omit.type';
import { DynamoDbWrapper } from '../dynamo-db-wrapper';
import { RequestConditionFunction, RequestConditionFunctionTyped } from '../expression/type/condition-expression-definition-chain';
import { ConditionExpressionDefinitionFunction } from '../expression/type/condition-expression-definition-function';
import { StandardRequest } from './standard.request';
declare type WriteResponse<O extends DynamoDB.DeleteItemOutput | DynamoDB.PutItemOutput | DynamoDB.UpdateItemOutput, T> = Omit<O, 'Attributes'>;
/**
 * abstract class for all basic write request classes (DeleteItem, PutItem, UpdateItem
 */
export declare abstract class WriteRequest<T, T2, I extends DynamoDB.DeleteItemInput | DynamoDB.PutItemInput | DynamoDB.UpdateItemInput, O extends DynamoDB.DeleteItemOutput | DynamoDB.PutItemOutput | DynamoDB.UpdateItemOutput, R extends WriteRequest<T, T2, I, O, R>> extends StandardRequest<T, T2, I, R> {
    protected abstract readonly logger: Logger;
    protected constructor(dynamoDBWrapper: DynamoDbWrapper, modelClazz: ModelConstructor<T>);
    protected abstract doRequest(params: I): Promise<O>;
    /**
     * return item collection metrics.
     */
    returnItemCollectionMetrics(returnItemCollectionMetrics: DynamoDB.ReturnItemCollectionMetrics): this;
    /**
     * add a condition for propertyPath
     * @param attributePath
     */
    onlyIfAttribute<K extends keyof T>(attributePath: K): RequestConditionFunctionTyped<this, T, K>;
    onlyIfAttribute(attributePath: string): RequestConditionFunction<this, T>;
    /**
     * @example writeRequest.onlyIf( attribute('age').eq(23) )
     * @example writeRequest.onlyIf( or( attribute('age').lt(18), attribute('age').gt(65) ) )
     */
    onlyIf(...conditionDefFns: ConditionExpressionDefinitionFunction[]): this;
    /**
     * @returns { void } if no ReturnValues are requested, { T } if the requested ReturnValues are ALL_OLD|ALL_NEW or {Partial<T>} if the requested ReturnValues are UPDATED_OLD|UPDATED_NEW
     */
    exec(): Promise<T2>;
    /**
     * execute request and return the full response
     */
    execFullResponse(): Promise<WriteResponse<O, T2>>;
    /**
     * execute request without parsing (mapping) the response attributes to js objects
     */
    execNoMap(): Promise<O>;
}
export {};
