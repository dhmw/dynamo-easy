import { ConditionExpressionDefinitionFunction } from '../type/condition-expression-definition-function';
/**
 * function to negate a condition
 * @example
 * ```typescript
 * not(attribute('propA').eq('foo'))
 * ```
 */
export declare function not(conditionDefinitionFn: ConditionExpressionDefinitionFunction): ConditionExpressionDefinitionFunction;
