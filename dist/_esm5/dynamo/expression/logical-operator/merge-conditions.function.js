import * as tslib_1 from "tslib";
import { uniqueAttributeValueName } from '../functions/unique-attribute-value-name.function';
/**
 * @hidden
 */
export function mergeConditions(operator, conditionDefinitionFns) {
    return function (expressionAttributeValues, metadata) {
        var mergedCondition = {
            statement: '',
            attributeNames: {},
            attributeValues: {},
        };
        var statements = [];
        conditionDefinitionFns.forEach(function (conditionDefinitionFn) {
            // we can reuse the same for multiple conditions
            var condition = conditionDefinitionFn(expressionAttributeValues, metadata);
            mergedCondition.attributeNames = tslib_1.__assign({}, mergedCondition.attributeNames, condition.attributeNames);
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
            var attributeValues = {};
            Object.keys(condition.attributeValues).forEach(function (key) {
                var unique = uniqueAttributeValueName(key.replace(':', ''), Object.keys(mergedCondition.attributeValues));
                if (key !== unique) {
                    // rename of the attributeName is required in condition
                    condition.statement = condition.statement.replace(key, unique);
                }
                attributeValues[unique] = condition.attributeValues[key];
            });
            mergedCondition.attributeValues = tslib_1.__assign({}, mergedCondition.attributeValues, attributeValues);
            statements.push(condition.statement);
        });
        mergedCondition.statement = statements.length === 1 ? statements[0] : "(" + statements.join(' ' + operator + ' ') + ")";
        return mergedCondition;
    };
}
//# sourceMappingURL=merge-conditions.function.js.map