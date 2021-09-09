"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const merge_conditions_function_1 = require("./merge-conditions.function");
/**
 * function to combine multiple conditions with 'and'
 * @example
 * ```typescript
 * and(attribute('propA').eq('foo'), attribute('propB').eq('bar'))
 * ```
 */
function and(...conditionDefinitionFns) {
    return merge_conditions_function_1.mergeConditions('AND', conditionDefinitionFns);
}
exports.and = and;
//# sourceMappingURL=and.function.js.map