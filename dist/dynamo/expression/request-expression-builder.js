"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const curry_function_1 = require("../../helper/curry.function");
const condition_expression_builder_1 = require("./condition-expression-builder");
const param_util_1 = require("./param-util");
const prepare_and_add_update_expressions_function_1 = require("./prepare-and-add-update-expressions.function");
const condition_operator_to_alias_map_const_1 = require("./type/condition-operator-to-alias-map.const");
const update_action_defs_const_1 = require("./type/update-action-defs.const");
const update_expression_builder_1 = require("./update-expression-builder");
/**
 * return the update-functions which then can apply an updateDefinition to the given request.params
 * and afterwards will return the request object (which allows chaining)
 * @param attributePath
 * @param request
 * @param metadata
 * @hidden
 */
function addUpdate(attributePath, request, metadata) {
    // f the function to create the update functions
    const f = (operator) => {
        // return the function the user will call in the end
        return (...values) => {
            const copy = [...values];
            const curried = curry_function_1.curry(update_expression_builder_1.buildUpdateExpression);
            const updateDefFn = curried(attributePath, operator, copy);
            prepare_and_add_update_expressions_function_1.prepareAndAddUpdateExpressions(metadata, request.params, [updateDefFn]);
            // return the request so the user can continue to chain
            return request;
        };
    };
    // let the update functions be created with f
    return createUpdateFunctions(f);
}
exports.addUpdate = addUpdate;
/**
 * return the condition-functions which then can apply a conditionDefinition to the given request.params
 * and afterwards will return the request object (which allows chaining)
 * @hidden
 */
function addCondition(expressionType, attributePath, request, metadata) {
    // f the function to create the condition functions
    const f = (operator) => {
        // return the function the user will call in the end
        return (...values) => {
            return doAddCondition(expressionType, attributePath, request, metadata, operator, ...values);
        };
    };
    return createConditionFunctions(f);
}
exports.addCondition = addCondition;
/**
 * @hidden
 */
function addSortKeyCondition(keyName, request, metadata) {
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
exports.addSortKeyCondition = addSortKeyCondition;
/**
 * @hidden
 */
function doAddCondition(expressionType, attributePath, request, metadata, operator, ...values) {
    const copy = [...values];
    const existingValueKeys = request.params.ExpressionAttributeValues
        ? Object.keys(request.params.ExpressionAttributeValues)
        : [];
    const condition = condition_expression_builder_1.buildFilterExpression(attributePath, operator, copy, existingValueKeys, metadata);
    param_util_1.addExpression(expressionType, condition, request.params);
    // return the request so the user can continue to chain
    return request;
}
exports.doAddCondition = doAddCondition;
function addPartitionKeyCondition(keyName, keyValue, request, metadata) {
    if (metadata) {
        return addSortKeyCondition(keyName, request, metadata).equals(keyValue);
    }
    else {
        return addSortKeyCondition(keyName, request).equals(keyValue);
    }
}
exports.addPartitionKeyCondition = addPartitionKeyCondition;
function updateDefinitionFunction(attributePath) {
    // f the function to create the update functions
    const f = (operation) => {
        // return the function the user will call in the end
        return (...values) => {
            const copy = [...values];
            const curried = curry_function_1.curry(update_expression_builder_1.buildUpdateExpression);
            // return the UpdateExpressionDefinitionFunction which the request will execute
            return curried(attributePath, operation, copy);
        };
    };
    // let the update functions be created with f
    return createUpdateFunctions(f);
}
exports.updateDefinitionFunction = updateDefinitionFunction;
function propertyDefinitionFunction(attributePath) {
    const f = (operator) => {
        return (...values) => {
            const copy = [...values];
            const curried = curry_function_1.curry(condition_expression_builder_1.buildFilterExpression);
            return curried(attributePath, operator, copy);
        };
    };
    return createConditionFunctions(f);
}
exports.propertyDefinitionFunction = propertyDefinitionFunction;
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
    return update_action_defs_const_1.UPDATE_ACTION_DEFS.reduce((result, updateActionDef) => {
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
    const includedAlias = operators && operators.length ? operators : Object.keys(condition_operator_to_alias_map_const_1.OPERATOR_TO_ALIAS_MAP);
    return includedAlias.reduce((result, operator) => {
        const alias = condition_operator_to_alias_map_const_1.OPERATOR_TO_ALIAS_MAP[operator];
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