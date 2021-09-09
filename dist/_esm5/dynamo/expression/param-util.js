import * as tslib_1 from "tslib";
import { isEmpty } from '../../helper/is-empty.function';
import { isString } from '../../helper/is-string.function';
import { resolveAttributeValueNameConflicts } from './functions/resolve-attribute-value-name-conflicts.function';
/**
 * @hidden
 */
export function addUpdateExpression(updateExpression, params) {
    addExpression('UpdateExpression', updateExpression, params);
}
/**
 * @hidden
 */
export function addExpression(expressionType, condition, params) {
    var nameSafeCondition = resolveAttributeValueNameConflicts(condition, params);
    var expressionAttributeNames = tslib_1.__assign({}, params.ExpressionAttributeNames, nameSafeCondition.attributeNames);
    var expressionAttributeValues = tslib_1.__assign({}, params.ExpressionAttributeValues, nameSafeCondition.attributeValues);
    if (!isEmpty(expressionAttributeNames)) {
        params.ExpressionAttributeNames = expressionAttributeNames;
    }
    if (!isEmpty(expressionAttributeValues)) {
        params.ExpressionAttributeValues = expressionAttributeValues;
    }
    var statement = params[expressionType];
    if (isString(statement) && statement !== '') {
        switch (expressionType) {
            case 'UpdateExpression':
                ;
                params[expressionType] = mergeUpdateExpressions(statement, nameSafeCondition.statement);
                break;
            default:
                ;
                params[expressionType] = statement + " AND " + nameSafeCondition.statement;
        }
    }
    else {
        ;
        params[expressionType] = nameSafeCondition.statement;
    }
}
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
export function mergeUpdateExpressions(expression1, expression2) {
    var a = splitUpdateExpressionToActionKeyword(expression1);
    var b = splitUpdateExpressionToActionKeyword(expression2);
    return Array.from(new Set(tslib_1.__spread(Object.keys(a), Object.keys(b))))
        .map(function (clause) { return clause + " " + (!a[clause] ? b[clause] : !b[clause] ? a[clause] : a[clause] + ", " + b[clause]); })
        .join(' ');
}
/**
 * Will return an object containing all the update statements mapped to an update action keyword
 * @hidden
 */
function splitUpdateExpressionToActionKeyword(updateExpression) {
    // add a whitespace at the beginning of the expression to be able to work with a more stricter regex
    return ((" " + updateExpression)
        // the regex ensures a whitespace at the beginning of the ActionWord
        // -> to not have problems with properties named exactly as an ActionKeyword
        .split(/\s(SET|REMOVE|ADD|DELETE)\s/g)
        .reduce(function (u, e, i, arr) {
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