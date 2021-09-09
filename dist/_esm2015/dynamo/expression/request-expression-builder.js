import { curry } from '../../helper/curry.function';
import { buildFilterExpression } from './condition-expression-builder';
import { addExpression } from './param-util';
import { prepareAndAddUpdateExpressions } from './prepare-and-add-update-expressions.function';
import { OPERATOR_TO_ALIAS_MAP } from './type/condition-operator-to-alias-map.const';
import { UPDATE_ACTION_DEFS } from './type/update-action-defs.const';
import { buildUpdateExpression } from './update-expression-builder';
/**
 * return the update-functions which then can apply an updateDefinition to the given request.params
 * and afterwards will return the request object (which allows chaining)
 * @param attributePath
 * @param request
 * @param metadata
 * @hidden
 */
export function addUpdate(attributePath, request, metadata) {
    // f the function to create the update functions
    const f = (operator) => {
        // return the function the user will call in the end
        return (...values) => {
            const copy = [...values];
            const curried = curry(buildUpdateExpression);
            const updateDefFn = curried(attributePath, operator, copy);
            prepareAndAddUpdateExpressions(metadata, request.params, [updateDefFn]);
            // return the request so the user can continue to chain
            return request;
        };
    };
    // let the update functions be created with f
    return createUpdateFunctions(f);
}
/**
 * return the condition-functions which then can apply a conditionDefinition to the given request.params
 * and afterwards will return the request object (which allows chaining)
 * @hidden
 */
export function addCondition(expressionType, attributePath, request, metadata) {
    // f the function to create the condition functions
    const f = (operator) => {
        // return the function the user will call in the end
        return (...values) => {
            return doAddCondition(expressionType, attributePath, request, metadata, operator, ...values);
        };
    };
    return createConditionFunctions(f);
}
/**
 * @hidden
 */
export function addSortKeyCondition(keyName, request, metadata) {
    // f the function to create the condition functions
    const f = (operator) => {
        // return the function the user will call in the end
        return (...values) => {
            return doAddCondition('KeyConditionExpression', keyName, request, metadata, operator, ...values);
        };
    };
    // only a subset of available operators are supported for sort keys
    return createConditionFunctions(f, '=', '<=', '<', '>', '>=', 'begins_with', 'BETWEEN');
}
/**
 * @hidden
 */
export function doAddCondition(expressionType, attributePath, request, metadata, operator, ...values) {
    const copy = [...values];
    const existingValueKeys = request.params.ExpressionAttributeValues
        ? Object.keys(request.params.ExpressionAttributeValues)
        : [];
    const condition = buildFilterExpression(attributePath, operator, copy, existingValueKeys, metadata);
    addExpression(expressionType, condition, request.params);
    // return the request so the user can continue to chain
    return request;
}
export function addPartitionKeyCondition(keyName, keyValue, request, metadata) {
    if (metadata) {
        return addSortKeyCondition(keyName, request, metadata).equals(keyValue);
    }
    else {
        return addSortKeyCondition(keyName, request).equals(keyValue);
    }
}
export function updateDefinitionFunction(attributePath) {
    // f the function to create the update functions
    const f = (operation) => {
        // return the function the user will call in the end
        return (...values) => {
            const copy = [...values];
            const curried = curry(buildUpdateExpression);
            // return the UpdateExpressionDefinitionFunction which the request will execute
            return curried(attributePath, operation, copy);
        };
    };
    // let the update functions be created with f
    return createUpdateFunctions(f);
}
export function propertyDefinitionFunction(attributePath) {
    const f = (operator) => {
        return (...values) => {
            const copy = [...values];
            const curried = curry(buildFilterExpression);
            return curried(attributePath, operator, copy);
        };
    };
    return createConditionFunctions(f);
}
/**
 * Creates an object which contains callable functions for all update operations defined in update-operation type
 * for all the values included in operators
 *
 * @param {(operator: ConditionOperator) => any} impl The function which is called with the operator and returns a function which expects the value
 * for the condition. when executed the implementation defines what to do with the condition, just return it for example or add the condition to the request
 * parameters as another example
 * @hidden
 */
function createUpdateFunctions(impl) {
    return UPDATE_ACTION_DEFS.reduce((result, updateActionDef) => {
        Reflect.set(result, updateActionDef.action, impl(updateActionDef));
        return result;
    }, {});
}
/**
 * Creates an object which contains callable functions for all aliases defined in CONDITION_OPERATOR_ALIAS or if operators parameter is defined,
 * for all the values included in operators
 *
 * @param {(operator: ConditionOperator) => any} impl The function which is called with the operator and returns a function which expects the value
 * for the condition. when executed the implementation defines what to do with the condition, just return it for example or add the condition to the request
 * parameters as another example
 * @hidden
 */
function createConditionFunctions(impl, ...operators) {
    const includedAlias = operators && operators.length ? operators : Object.keys(OPERATOR_TO_ALIAS_MAP);
    return includedAlias.reduce((result, operator) => {
        const alias = OPERATOR_TO_ALIAS_MAP[operator];
        if (Array.isArray(alias)) {
            alias.forEach((a) => Reflect.set(result, a, impl(operator)));
        }
        else {
            Reflect.set(result, alias, impl(operator));
        }
        return result;
    }, {});
}
//# sourceMappingURL=request-expression-builder.js.map