import { mergeConditions } from './merge-conditions.function';
/**
 * function to combine multiple conditions with or
 * @example
 * ```typescript
 * or(attribute('propA').eq('foo'), attribute('propB').eq('bar'))
 * ```
 */
export function or(...conditionDefinitionFns) {
    return mergeConditions('OR', conditionDefinitionFns);
}
//# sourceMappingURL=or.function.js.map