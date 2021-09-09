"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const merge_conditions_function_1 = require("./merge-conditions.function");
/**
 * function to combine multiple conditions with or
 * @example
 * ```typescript
 * or(attribute('propA').eq('foo'), attribute('propB').eq('bar'))
 * ```
 */
function or(...conditionDefinitionFns) {
    return merge_conditions_function_1.mergeConditions('OR', conditionDefinitionFns);
}
exports.or = or;
//# sourceMappingURL=or.function.js.map