import { resolveAttributeNames } from '../../expression/functions/attribute-names.function';
/**
 * Adds ProjectionExpression param and expressionAttributeNames to the params object
 */
export function addProjectionExpressionParam(attributesToGet, params, metadata) {
    const resolved = attributesToGet.map((attributeToGet) => resolveAttributeNames(attributeToGet, metadata));
    params.ProjectionExpression = resolved.map((attr) => attr.placeholder).join(', ');
    resolved.forEach((r) => {
        params.ExpressionAttributeNames = Object.assign({}, params.ExpressionAttributeNames, r.attributeNames);
    });
}
//# sourceMappingURL=add-projection-expression-param.function.js.map