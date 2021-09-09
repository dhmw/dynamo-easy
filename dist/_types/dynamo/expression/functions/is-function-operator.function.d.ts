import { ConditionOperator } from '../type/condition-operator.type';
import { FunctionOperator } from '../type/function-operator.type';
/**
 * An operator can either be an comparator or a function, this method helps to check for function operator
 * @param {ConditionOperator} operator
 * @returns {boolean} Returns true if the operator is a function operator, false otherwise
 * @hidden
 */
export declare function isFunctionOperator(operator: ConditionOperator): operator is FunctionOperator;
