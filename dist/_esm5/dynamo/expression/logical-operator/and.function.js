import { mergeConditions } from './merge-conditions.function';
/**
 * function to combine multiple conditions with 'and'
 * @example
 * ```typescript
 * and(attribute('propA').eq('foo'), attribute('propB').eq('bar'))
 * ```
 */
export function and() {
    var conditionDefinitionFns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        conditionDefinitionFns[_i] = arguments[_i];
    }
    return mergeConditions('AND', conditionDefinitionFns);
}
//# sourceMappingURL=and.function.js.map