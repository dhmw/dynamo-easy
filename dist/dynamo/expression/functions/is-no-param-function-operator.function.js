"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module expression
 */
const non_param_function_operators_const_1 = require("../non-param-function-operators.const");
/**
 * @returns {boolean} Returns true for all function operators with no param false otherwise
 * @hidden
 */
function isNoParamFunctionOperator(operator) {
    return non_param_function_operators_const_1.NON_PARAM_FUNCTION_OPERATORS.includes(operator);
}
exports.isNoParamFunctionOperator = isNoParamFunctionOperator;
//# sourceMappingURL=is-no-param-function-operator.function.js.map