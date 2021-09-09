/**
 * @module expression
 */
import { Metadata } from '../../decorator/metadata/metadata';
import { ConditionalParamsHost, UpdateParamsHost } from '../operation-params.type';
import { StandardRequest } from '../request/standard.request';
import { ConditionExpressionDefinitionChain, ConditionExpressionDefinitionChainTyped, RequestConditionFunctionTyped } from './type/condition-expression-definition-chain';
import { ConditionOperator } from './type/condition-operator.type';
import { ExpressionType } from './type/expression-type.type';
import { SortKeyConditionFunction } from './type/sort-key-condition-function';
import { RequestUpdateFunction, UpdateExpressionDefinitionChain, UpdateExpressionDefinitionChainTyped } from './type/update-expression-definition-chain';
/**
 * return the update-functions which then can apply an updateDefinition to the given request.params
 * and afterwards will return the request object (which allows chaining)
 * @param attributePath
 * @param request
 * @param metadata
 * @hidden
 */
export declare function addUpdate<R extends UpdateParamsHost, T, K extends keyof T>(attributePath: K, request: R, metadata: Metadata<T>): RequestUpdateFunction<R, T, K>;
/**
 * return the condition-functions which then can apply a conditionDefinition to the given request.params
 * and afterwards will return the request object (which allows chaining)
 * @hidden
 */
export declare function addCondition<R extends ConditionalParamsHost, T, K extends keyof T>(expressionType: ExpressionType, attributePath: K, request: R, metadata?: Metadata<T>): RequestConditionFunctionTyped<R, T, K>;
/**
 * @hidden
 */
export declare function addSortKeyCondition<R extends ConditionalParamsHost>(keyName: keyof any, request: R): SortKeyConditionFunction<R>;
/**
 * @hidden
 */
export declare function addSortKeyCondition<T, R extends ConditionalParamsHost>(keyName: keyof T, request: R, metadata: Metadata<T>): SortKeyConditionFunction<R>;
/**
 * @hidden
 */
export declare function doAddCondition<T, R extends ConditionalParamsHost>(expressionType: ExpressionType, attributePath: string, request: R, metadata: Metadata<T> | undefined, operator: ConditionOperator, ...values: any[]): R;
/**
 * @hidden
 */
export declare function addPartitionKeyCondition<R extends StandardRequest<any, any, any, any>>(keyName: keyof any, keyValue: any, request: R): R;
export declare function addPartitionKeyCondition<T, R extends StandardRequest<T, any, any, any>>(keyName: keyof T, keyValue: any, request: R, metadata: Metadata<T>): R;
/**
 * @hidden
 */
export declare function updateDefinitionFunction(attributePath: string): UpdateExpressionDefinitionChain;
export declare function updateDefinitionFunction<T>(attributePath: keyof T): UpdateExpressionDefinitionChain;
export declare function updateDefinitionFunction<T, K extends keyof T>(attributePath: K): UpdateExpressionDefinitionChainTyped<T, K>;
/**
 * @hidden
 */
export declare function propertyDefinitionFunction<T>(attributePath: keyof T): ConditionExpressionDefinitionChain;
export declare function propertyDefinitionFunction<T, K extends keyof T>(attributePath: K): ConditionExpressionDefinitionChainTyped<T, K>;
