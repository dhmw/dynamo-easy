import { addUpdateExpression } from './param-util';
/**
 * @hidden
 */
export function prepareAndAddUpdateExpressions(metadata, params, updateDefFns) {
    if (updateDefFns && updateDefFns.length) {
        const sortedByActionKeyWord = updateDefFns
            .map((updateDefFn) => {
            return updateDefFn(params.ExpressionAttributeNames, metadata);
        })
            .reduce((result, expr) => {
            const actionKeyword = expr.type;
            if (!result.has(actionKeyword)) {
                result.set(actionKeyword, []);
            }
            result.get(actionKeyword).push(expr);
            return result;
        }, new Map());
        const actionStatements = [];
        let attributeValues = {};
        let attributeNames = {};
        for (const [actionKeyword, updateExpressions] of sortedByActionKeyWord) {
            const statements = [];
            if (updateExpressions && updateExpressions.length) {
                updateExpressions.forEach((updateExpression) => {
                    statements.push(updateExpression.statement);
                    attributeValues = Object.assign({}, attributeValues, updateExpression.attributeValues);
                    attributeNames = Object.assign({}, attributeNames, updateExpression.attributeNames);
                });
                actionStatements.push(`${actionKeyword} ${statements.join(', ')}`);
            }
        }
        const expression = {
            statement: actionStatements.join(' '),
            attributeValues,
            attributeNames,
        };
        addUpdateExpression(expression, params);
    }
    else {
        throw new Error('at least one update operation must be defined');
    }
}
//# sourceMappingURL=prepare-and-add-update-expressions.function.js.map