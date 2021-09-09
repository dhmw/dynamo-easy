import { mergeConditions } from './merge-conditions.function';
/**
 * function to combine multiple conditions with or
 * @example
 * ```typescript
 * or(attribute('propA').eq('foo'), attribute('propB').eq('bar'))
 * ```
 */
export function or() {
    var conditionDefinitionFns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        conditionDefinitionFns[_i] = arguments[_i];
    }
    return mergeConditions('OR', conditionDefinitionFns);
}
//# sourceMappingURL=or.function.js.map