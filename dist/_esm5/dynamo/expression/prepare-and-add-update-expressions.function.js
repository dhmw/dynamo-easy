import * as tslib_1 from "tslib";
import { addUpdateExpression } from './param-util';
/**
 * @hidden
 */
export function prepareAndAddUpdateExpressions(metadata, params, updateDefFns) {
    var e_1, _a;
    if (updateDefFns && updateDefFns.length) {
        var sortedByActionKeyWord = updateDefFns
            .map(function (updateDefFn) {
            return updateDefFn(params.ExpressionAttributeNames, metadata);
        })
            .reduce(function (result, expr) {
            var actionKeyword = expr.type;
            if (!result.has(actionKeyword)) {
                result.set(actionKeyword, []);
            }
            result.get(actionKeyword).push(expr);
            return result;
        }, new Map());
        var actionStatements = [];
        var attributeValues_1 = {};
        var attributeNames_1 = {};
        var _loop_1 = function (actionKeyword, updateExpressions) {
            var statements = [];
            if (updateExpressions && updateExpressions.length) {
                updateExpressions.forEach(function (updateExpression) {
                    statements.push(updateExpression.statement);
                    attributeValues_1 = tslib_1.__assign({}, attributeValues_1, updateExpression.attributeValues);
                    attributeNames_1 = tslib_1.__assign({}, attributeNames_1, updateExpression.attributeNames);
                });
                actionStatements.push(actionKeyword + " " + statements.join(', '));
            }
        };
        try {
            for (var sortedByActionKeyWord_1 = tslib_1.__values(sortedByActionKeyWord), sortedByActionKeyWord_1_1 = sortedByActionKeyWord_1.next(); !sortedByActionKeyWord_1_1.done; sortedByActionKeyWord_1_1 = sortedByActionKeyWord_1.next()) {
                var _b = tslib_1.__read(sortedByActionKeyWord_1_1.value, 2), actionKeyword = _b[0], updateExpressions = _b[1];
                _loop_1(actionKeyword, updateExpressions);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (sortedByActionKeyWord_1_1 && !sortedByActionKeyWord_1_1.done && (_a = sortedByActionKeyWord_1.return)) _a.call(sortedByActionKeyWord_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var expression = {
            statement: actionStatements.join(' '),
            attributeValues: attributeValues_1,
            attributeNames: attributeNames_1,
        };
        addUpdateExpression(expression, params);
    }
    else {
        throw new Error('at least one update operation must be defined');
    }
}
//# sourceMappingURL=prepare-and-add-update-expressions.function.js.map