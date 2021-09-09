/**
 * function to negate a condition
 * @example
 * ```typescript
 * not(attribute('propA').eq('foo'))
 * ```
 */
export function not(conditionDefinitionFn) {
    return function (expressionAttributeValues, metadata) {
        var condition = conditionDefinitionFn(expressionAttributeValues, metadata);
        condition.statement = "NOT " + condition.statement;
        return condition;
    };
}
//# sourceMappingURL=not.function.js.map