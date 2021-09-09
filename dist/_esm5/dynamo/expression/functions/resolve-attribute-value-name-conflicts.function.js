import * as tslib_1 from "tslib";
import { uniqueAttributeValueName } from './unique-attribute-value-name.function';
/**
 * resolves name conflict when expression uses an attributeValueName that is already used in given *Input
 * @param expression
 * @param params
 * @return safe-to-use Expression
 * @hidden
 */
export function resolveAttributeValueNameConflicts(expression, params) {
    var attributeValues = {};
    var statement = expression.statement;
    if (params.ExpressionAttributeValues) {
        var existingAttributeValueNames_1 = Object.keys(params.ExpressionAttributeValues);
        Object.keys(expression.attributeValues)
            .map(function (key) { return [key, uniqueAttributeValueName(key.replace(':', ''), existingAttributeValueNames_1)]; })
            .forEach(function (_a) {
            var _b = tslib_1.__read(_a, 2), oldValName = _b[0], newValName = _b[1];
            attributeValues[newValName] = expression.attributeValues[oldValName];
            // split-join based replaceAll
            statement = statement.split(oldValName).join(newValName);
        });
    }
    else {
        attributeValues = expression.attributeValues;
    }
    return tslib_1.__assign({}, expression, { attributeValues: attributeValues, statement: statement });
}
//# sourceMappingURL=resolve-attribute-value-name-conflicts.function.js.map