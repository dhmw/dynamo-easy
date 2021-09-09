"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is_function_operator_function_1 = require("./is-function-operator.function");
const is_no_param_function_operator_function_1 = require("./is-no-param-function-operator.function");
/**
 * Every expression condition operator has a predefined arity (amount) of function parameters, this method
 * returns this value
 *
 * @returns {number} The amount of required method parameters when calling an operator function
 * @hidden
 */
function operatorParameterArity(operator) {
    if (is_function_operator_function_1.isFunctionOperator(operator) && is_no_param_function_operator_function_1.isNoParamFunctionOperator(operator)) {
        return 0;
    }
    else {
        switch (operator) {
            case '=':
            case '>':
            case '>=':
            case '<':
            case '<=':
            case '<>':
            case 'begins_with':
            case 'attribute_type':
            case 'contains':
            case 'not_contains':
            case 'IN':
                return 1;
            case 'BETWEEN':
                return 2;
            default:
                throw new Error(`no parameter arity defined for operator ${operator}`);
        }
    }
}
exports.operatorParameterArity = operatorParameterArity;
//# sourceMappingURL=operator-parameter-arity.function.js.map