"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * function to negate a condition
 * @example
 * ```typescript
 * not(attribute('propA').eq('foo'))
 * ```
 */
function not(conditionDefinitionFn) {
    return (expressionAttributeValues, metadata) => {
        const condition = conditionDefinitionFn(expressionAttributeValues, metadata);
        condition.statement = `NOT ${condition.statement}`;
        return condition;
    };
}
exports.not = not;
//# sourceMappingURL=not.function.js.map