"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is_empty_function_1 = require("../../helper/is-empty.function");
const is_string_function_1 = require("../../helper/is-string.function");
const resolve_attribute_value_name_conflicts_function_1 = require("./functions/resolve-attribute-value-name-conflicts.function");
/**
 * @hidden
 */
function addUpdateExpression(updateExpression, params) {
    addExpression('UpdateExpression', updateExpression, params);
}
exports.addUpdateExpression = addUpdateExpression;
/**
 * @hidden
 */
function addExpression(expressionType, condition, params) {
    const nameSafeCondition = resolve_attribute_value_name_conflicts_function_1.resolveAttributeValueNameConflicts(condition, params);
    const expressionAttributeNames = Object.assign({}, params.ExpressionAttributeNames, nameSafeCondition.attributeNames);
    const expressionAttributeValues = Object.assign({}, params.ExpressionAttributeValues, nameSafeCondition.attributeValues);
    if (!is_empty_function_1.isEmpty(expressionAttributeNames)) {
        params.ExpressionAttributeNames = expressionAttributeNames;
    }
    if (!is_empty_function_1.isEmpty(expressionAttributeValues)) {
        params.ExpressionAttributeValues = expressionAttributeValues;
    }
    const statement = params[expressionType];
    if (is_string_function_1.isString(statement) && statement !== '') {
        switch (expressionType) {
            case 'UpdateExpression':
                ;
                params[expressionType] = mergeUpdateExpressions(statement, nameSafeCondition.statement);
                break;
            default:
                ;
                params[expressionType] = `${statement} AND ${nameSafeCondition.statement}`;
        }
    }
    else {
        ;
        params[expressionType] = nameSafeCondition.statement;
    }
}
exports.addExpression = addExpression;
/**
 * Will merge two update expressions into one, one action keyword can only appear once in an update expression
 *
 * ```
 * const merged = mergeUpdateExpressions(
 *                    'SET a, b REMOVE e, f ADD i, j DELETE m, n',
 *                    'SET c, d REMOVE g, h ADD k, l DELETE o, p',
 *                )
 * console.log(merged) -> 'SET a, b, c, d REMOVE e, f, g, h ADD i, j, k, l DELETE m, n, o, p'
 * ```
 *
 * @hidden
 */
function mergeUpdateExpressions(expression1, expression2) {
    const a = splitUpdateExpressionToActionKeyword(expression1);
    const b = splitUpdateExpressionToActionKeyword(expression2);
    return Array.from(new Set([...Object.keys(a), ...Object.keys(b)]))
        .map((clause) => `${clause} ` + (!a[clause] ? b[clause] : !b[clause] ? a[clause] : `${a[clause]}, ${b[clause]}`))
        .join(' ');
}
exports.mergeUpdateExpressions = mergeUpdateExpressions;
/**
 * Will return an object containing all the update statements mapped to an update action keyword
 * @hidden
 */
function splitUpdateExpressionToActionKeyword(updateExpression) {
    // add a whitespace at the beginning of the expression to be able to work with a more stricter regex
    return (` ${updateExpression}`
        // the regex ensures a whitespace at the beginning of the ActionWord
        // -> to not have problems with properties named exactly as an ActionKeyword
        .split(/\s(SET|REMOVE|ADD|DELETE)\s/g)
        .reduce((u, e, i, arr) => {
        if (isUpdateActionKeyword(e)) {
            u[e] = arr[i + 1];
        }
        return u;
    }, {}));
}
/**
 * @hidden
 */
function isUpdateActionKeyword(val) {
    return /^(SET|REMOVE|ADD|DELETE)$/.test(val);
}
//# sourceMappingURL=param-util.js.map