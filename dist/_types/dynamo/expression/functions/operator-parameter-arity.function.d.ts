/**
 * @module expression
 */
import { ConditionOperator } from '../type/condition-operator.type';
/**
 * Every expression condition operator has a predefined arity (amount) of function parameters, this method
 * returns this value
 *
 * @returns {number} The amount of required method parameters when calling an operator function
 * @hidden
 */
export declare function operatorParameterArity(operator: ConditionOperator): number;
