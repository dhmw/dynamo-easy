/**
 * @module expression
 */
import { ConditionExpressionDefinitionFunction } from '../type/condition-expression-definition-function';
/**
 * function to combine multiple conditions with 'and'
 * @example
 * ```typescript
 * and(attribute('propA').eq('foo'), attribute('propB').eq('bar'))
 * ```
 */
export declare function and(...conditionDefinitionFns: ConditionExpressionDefinitionFunction[]): ConditionExpressionDefinitionFunction;
