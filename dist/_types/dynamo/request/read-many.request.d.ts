/**
 * @module store-requests
 */
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import { SecondaryIndex } from '../../decorator/impl/index/secondary-index';
import { Logger } from '../../logger/logger';
import { ModelConstructor } from '../../model/model-constructor';
import { DynamoDbWrapper } from '../dynamo-db-wrapper';
import { RequestConditionFunction, RequestConditionFunctionTyped } from '../expression/type/condition-expression-definition-chain';
import { ConditionExpressionDefinitionFunction } from '../expression/type/condition-expression-definition-function';
import { QueryRequest } from './query/query.request';
import { QueryResponse } from './query/query.response';
import { ScanRequest } from './scan/scan.request';
import { ScanResponse } from './scan/scan.response';
import { StandardRequest } from './standard.request';
/**
 * abstract class for query and scan request classes.
 */
export declare abstract class ReadManyRequest<T, T2, I extends DynamoDB.QueryInput | DynamoDB.ScanInput, O extends DynamoDB.QueryOutput | DynamoDB.ScanOutput, Z extends QueryResponse<T2> | ScanResponse<T2>, R extends QueryRequest<T, T2> | ScanRequest<T, T2>, R2 extends QueryRequest<T, Partial<T>> | ScanRequest<T, Partial<T>>> extends StandardRequest<T, T2, I, ReadManyRequest<T, T2, I, O, Z, R, R2>> {
    /** Infinite limit will remove the Limit param from request params when calling ReadManyRequest.limit(ReadManyRequest.INFINITE_LIMIT) */
    static INFINITE_LIMIT: number;
    protected secondaryIndex?: SecondaryIndex<T>;
    protected abstract readonly logger: Logger;
    /**
     * method that executes the actual call on dynamoDBWrapper with the given params.
     */
    protected abstract doRequest(params: I): Promise<O>;
    protected constructor(dynamoDBWrapper: DynamoDbWrapper, modelClazz: ModelConstructor<T>);
    /**
     *
     * @param key A map representing the start id which is included in next call, if null is delivered
     * startKey will be removed from params
     */
    exclusiveStartKey(key: DynamoDB.Key | null): this;
    /**
     * query items on the given index.
     */
    index(indexName: string): this;
    /**
     * set Limit to params - The maximum number of items to evaluate (not necessarily the number of matching items)
     */
    limit(limit: number): this;
    /**
     * Determines the read consistency model: If set to true, then the operation uses strongly consistent reads; otherwise, the operation uses eventually consistent reads.
     */
    consistentRead(consistentRead?: boolean): this;
    /**
     * Specifies the list of model attributes to be returned from the table instead of returning the entire document
     * @param attributesToGet List of model attributes to be returned
     */
    projectionExpression(...attributesToGet: Array<keyof T | string>): R2;
    /**
     * add a condition for propertyPath
     * @example req.whereAttribute('path.to.prop').eq('value')
     */
    whereAttribute<K extends keyof T>(attributePath: K): RequestConditionFunctionTyped<this, T, K>;
    whereAttribute(attributePath: string): RequestConditionFunction<this, T>;
    /**
     * add one or multiple conditions.
     * @example req.where( attribute('age').eq(23) )
     * @example req.where( or( attribute('age').lt(18), attribute('age').gt(65) ) )
     */
    where(...conditionDefFns: ConditionExpressionDefinitionFunction[]): this;
    /**
     * execute the request and return the raw response (without parsing the attributes to js objects)
     */
    execNoMap(): Promise<O>;
    /**
     * Execute with Limit: 1 to read the first item only
     */
    execSingle(): Promise<T2 | null>;
    /**
     * Execute with Select: 'Count' to count the items.
     */
    execCount(): Promise<number>;
    /**
     * execute request and return the parsed items
     */
    exec(): Promise<T2[]>;
    /**
     * execute request and return the full response with the parsed items
     */
    execFullResponse(): Promise<Z>;
    /**
     * fetches all pages. may uses all provisionedOutput, therefore for client side use cases rather use pagedDatasource (exec)
     */
    execFetchAll(): Promise<T2[]>;
    protected mapFromDb: (output: O) => Z;
}
