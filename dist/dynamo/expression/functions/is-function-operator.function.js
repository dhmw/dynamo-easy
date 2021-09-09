"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module expression
 */
const function_operators_const_1 = require("../function-operators.const");
/**
 * An operator can either be an comparator or a function, this method helps to check for function operator
 * @param {ConditionOperator} operator
 * @returns {boolean} Returns true if the operator is a function operator, false otherwise
 * @hidden
 */
function isFunctionOperator(operator) {
    return function_operators_const_1.FUNCTION_OPERATORS.includes(operator);
}
exports.isFunctionOperator = isFunctionOperator;
//# sourceMappingURL=is-function-operator.function.js.map