import { ConditionExpressionDefinitionFunction } from '../type/condition-expression-definition-function';
/**
 * @hidden
 */
export declare function mergeConditions(operator: 'AND' | 'OR', conditionDefinitionFns: ConditionExpressionDefinitionFunction[]): ConditionExpressionDefinitionFunction;
