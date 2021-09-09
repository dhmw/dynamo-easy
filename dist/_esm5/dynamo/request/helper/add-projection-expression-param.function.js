import * as tslib_1 from "tslib";
import { resolveAttributeNames } from '../../expression/functions/attribute-names.function';
/**
 * Adds ProjectionExpression param and expressionAttributeNames to the params object
 */
export function addProjectionExpressionParam(attributesToGet, params, metadata) {
    var resolved = attributesToGet.map(function (attributeToGet) { return resolveAttributeNames(attributeToGet, metadata); });
    params.ProjectionExpression = resolved.map(function (attr) { return attr.placeholder; }).join(', ');
    resolved.forEach(function (r) {
        params.ExpressionAttributeNames = tslib_1.__assign({}, params.ExpressionAttributeNames, r.attributeNames);
    });
}
//# sourceMappingURL=add-projection-expression-param.function.js.map