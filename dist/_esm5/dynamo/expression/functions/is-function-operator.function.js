/**
 * @module expression
 */
import { FUNCTION_OPERATORS } from '../function-operators.const';
/**
 * An operator can either be an comparator or a function, this method helps to check for function operator
 * @param {ConditionOperator} operator
 * @returns {boolean} Returns true if the operator is a function operator, false otherwise
 * @hidden
 */
export function isFunctionOperator(operator) {
    return FUNCTION_OPERATORS.includes(operator);
}
//# sourceMappingURL=is-function-operator.function.js.map