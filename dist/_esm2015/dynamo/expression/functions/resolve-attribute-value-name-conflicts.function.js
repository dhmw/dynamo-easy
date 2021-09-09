import { uniqueAttributeValueName } from './unique-attribute-value-name.function';
/**
 * resolves name conflict when expression uses an attributeValueName that is already used in given *Input
 * @param expression
 * @param params
 * @return safe-to-use Expression
 * @hidden
 */
export function resolveAttributeValueNameConflicts(expression, params) {
    let attributeValues = {};
    let statement = expression.statement;
    if (params.ExpressionAttributeValues) {
        const existingAttributeValueNames = Object.keys(params.ExpressionAttributeValues);
        Object.keys(expression.attributeValues)
            .map((key) => [key, uniqueAttributeValueName(key.replace(':', ''), existingAttributeValueNames)])
            .forEach(([oldValName, newValName]) => {
            attributeValues[newValName] = expression.attributeValues[oldValName];
            // split-join based replaceAll
            statement = statement.split(oldValName).join(newValName);
        });
    }
    else {
        attributeValues = expression.attributeValues;
    }
    return Object.assign({}, expression, { attributeValues, statement });
}
//# sourceMappingURL=resolve-attribute-value-name-conflicts.function.js.map