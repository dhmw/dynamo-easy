"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const attribute_names_function_1 = require("../../expression/functions/attribute-names.function");
/**
 * Adds ProjectionExpression param and expressionAttributeNames to the params object
 */
function addProjectionExpressionParam(attributesToGet, params, metadata) {
    const resolved = attributesToGet.map((attributeToGet) => attribute_names_function_1.resolveAttributeNames(attributeToGet, metadata));
    params.ProjectionExpression = resolved.map((attr) => attr.placeholder).join(', ');
    resolved.forEach((r) => {
        params.ExpressionAttributeNames = Object.assign({}, params.ExpressionAttributeNames, r.attributeNames);
    });
}
exports.addProjectionExpressionParam = addProjectionExpressionParam;
//# sourceMappingURL=add-projection-expression-param.function.js.map