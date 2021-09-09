/**
 * @module store-requests
 */
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import { Logger } from '../../../logger/logger';
import { ModelConstructor } from '../../../model/model-constructor';
import { DynamoDbWrapper } from '../../dynamo-db-wrapper';
import { RequestUpdateFunction } from '../../expression/type/update-expression-definition-chain';
import { UpdateExpressionDefinitionFunction } from '../../expression/type/update-expression-definition-function';
import { WriteRequest } from '../write.request';
/**
 * Request class for the UpdateItem operation.
 */
export declare class UpdateRequest<T, T2 = void> extends WriteRequest<T, T2, DynamoDB.UpdateItemInput, DynamoDB.UpdateItemOutput, UpdateRequest<T, T2>> {
    protected readonly logger: Logger;
    constructor(dynamoDBWrapper: DynamoDbWrapper, modelClazz: ModelConstructor<T>, partitionKey: any, sortKey?: any);
    /**
     * create and add a single update operation
     * @example req.updateAttribute('path.to.attr').set('newVal')
     */
    updateAttribute<K extends keyof T>(attributePath: K): RequestUpdateFunction<this, T, K>;
    /**
     * add multiple update operations comma separated
     * @example req.operations(update('path.to.attr).set('newVal'), ... )
     */
    operations(...updateDefFns: UpdateExpressionDefinitionFunction[]): this;
    returnValues(returnValues: 'ALL_OLD' | 'ALL_NEW'): UpdateRequest<T, T>;
    returnValues(returnValues: 'UPDATED_OLD' | 'UPDATED_NEW'): UpdateRequest<T, Partial<T>>;
    returnValues(returnValues: 'NONE'): UpdateRequest<T, void>;
    protected doRequest(params: DynamoDB.UpdateItemInput): Promise<DynamoDB.UpdateItemOutput>;
}
