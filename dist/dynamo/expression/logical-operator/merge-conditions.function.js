"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unique_attribute_value_name_function_1 = require("../functions/unique-attribute-value-name.function");
/**
 * @hidden
 */
function mergeConditions(operator, conditionDefinitionFns) {
    return (expressionAttributeValues, metadata) => {
        const mergedCondition = {
            statement: '',
            attributeNames: {},
            attributeValues: {},
        };
        const statements = [];
        conditionDefinitionFns.forEach((conditionDefinitionFn) => {
            // we can reuse the same for multiple conditions
            const condition = conditionDefinitionFn(expressionAttributeValues, metadata);
            mergedCondition.attributeNames = Object.assign({}, mergedCondition.attributeNames, condition.attributeNames);
            /*
             * we need to make sure the value variable name is unique, this wont' work so the second :name must be renamed
             * {
             *    ":name" : { S: "the name" },
             *    ":name" : { S: "other name" }
             * }
             *                |
             *                |
             *                ▽
             * {
             *    ":name" : { S: "the name" },
             *    ":name_2" : { S: "other name" }
             * }
             *
             */
            const attributeValues = {};
            Object.keys(condition.attributeValues).forEach((key) => {
                const unique = unique_attribute_value_name_function_1.uniqueAttributeValueName(key.replace(':', ''), Object.keys(mergedCondition.attributeValues));
                if (key !== unique) {
                    // rename of the attributeName is required in condition
                    condition.statement = condition.statement.replace(key, unique);
                }
                attributeValues[unique] = condition.attributeValues[key];
            });
            mergedCondition.attributeValues = Object.assign({}, mergedCondition.attributeValues, attributeValues);
            statements.push(condition.statement);
        });
        mergedCondition.statement = statements.length === 1 ? statements[0] : `(${statements.join(' ' + operator + ' ')})`;
        return mergedCondition;
    };
}
exports.mergeConditions = mergeConditions;
//# sourceMappingURL=merge-conditions.function.js.map