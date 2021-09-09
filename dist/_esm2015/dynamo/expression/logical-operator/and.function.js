import { mergeConditions } from './merge-conditions.function';
/**
 * function to combine multiple conditions with 'and'
 * @example
 * ```typescript
 * and(attribute('propA').eq('foo'), attribute('propB').eq('bar'))
 * ```
 */
export function and(...conditionDefinitionFns) {
    return mergeConditions('AND', conditionDefinitionFns);
}
//# sourceMappingURL=and.function.js.map