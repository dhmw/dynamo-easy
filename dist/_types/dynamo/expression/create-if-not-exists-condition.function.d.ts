/**
 * @module expression
 */
import { Metadata } from '../../decorator/metadata/metadata';
import { ConditionExpressionDefinitionFunction } from './type/condition-expression-definition-function';
/**
 * @hidden
 */
export declare function createIfNotExistsCondition<T>(metadata: Metadata<T>): ConditionExpressionDefinitionFunction[];
