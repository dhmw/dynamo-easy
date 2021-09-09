/**
 * @module expression
 */
import { ConditionExpressionDefinitionFunction } from '../type/condition-expression-definition-function';
/**
 * function to combine multiple conditions with or
 * @example
 * ```typescript
 * or(attribute('propA').eq('foo'), attribute('propB').eq('bar'))
 * ```
 */
export declare function or(...conditionDefinitionFns: ConditionExpressionDefinitionFunction[]): ConditionExpressionDefinitionFunction;
