/**
 * @module expression
 */
import { NON_PARAM_FUNCTION_OPERATORS } from '../non-param-function-operators.const';
/**
 * @returns {boolean} Returns true for all function operators with no param false otherwise
 * @hidden
 */
export function isNoParamFunctionOperator(operator) {
    return NON_PARAM_FUNCTION_OPERATORS.includes(operator);
}
//# sourceMappingURL=is-no-param-function-operator.function.js.map