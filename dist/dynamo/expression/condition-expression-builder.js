"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const property_metadata_model_1 = require("../../decorator/metadata/property-metadata.model");
const curry_function_1 = require("../../helper/curry.function");
const is_plain_object_function_1 = require("../../helper/is-plain-object.function");
const mapper_1 = require("../../mapper/mapper");
const util_1 = require("../../mapper/util");
const attribute_names_function_1 = require("./functions/attribute-names.function");
const is_function_operator_function_1 = require("./functions/is-function-operator.function");
const is_no_param_function_operator_function_1 = require("./functions/is-no-param-function-operator.function");
const operator_parameter_arity_function_1 = require("./functions/operator-parameter-arity.function");
const unique_attribute_value_name_function_1 = require("./functions/unique-attribute-value-name.function");
const update_expression_builder_1 = require("./update-expression-builder");
const util_2 = require("./util");
/**
 * see http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html
 * https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Condition.html
 */
/**
 * Will walk the object tree recursively and removes all items which do not satisfy the filterFn
 * @param obj
 * @param {(value: any) => boolean} filterFn
 * @returns {any}
 * @hidden
 */
function deepFilter(obj, filterFn) {
    if (Array.isArray(obj)) {
        const returnArr = [];
        obj.forEach((i) => {
            const item = deepFilter(i, filterFn);
            if (item !== null) {
                returnArr.push(item);
            }
        });
        return returnArr.length ? returnArr : null;
    }
    else if (obj instanceof Set) {
        const returnArr = [];
        Array.from(obj).forEach((i) => {
            const item = deepFilter(i, filterFn);
            if (item !== null) {
                returnArr.push(item);
            }
        });
        return returnArr.length ? new Set(returnArr) : null;
    }
    else if (is_plain_object_function_1.isPlainObject(obj)) {
        const returnObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                const item = deepFilter(value, filterFn);
                if (item !== null) {
                    returnObj[key] = item;
                }
            }
        }
        return Object.keys(returnObj).length ? returnObj : null;
    }
    else {
        if (filterFn(obj)) {
            return obj;
        }
        else {
            return null;
        }
    }
}
exports.deepFilter = deepFilter;
/**
 * Will create a condition which can be added to a request using the param object.
 * It will create the expression statement and the attribute names and values.
 *
 * @param {string} attributePath
 * @param {ConditionOperator} operator
 * @param {any[]} values Depending on the operator the amount of values differs
 * @param {string[]} existingValueNames If provided the existing names are used to make sure we have a unique name for the current attributePath
 * @param {Metadata<any>} metadata If provided we use the metadata to define the attribute name and use it to map the given value(s) to attributeValue(s)
 * @returns {Expression}
 * @hidden
 */
function buildFilterExpression(attributePath, operator, values, existingValueNames, metadata) {
    // metadata get rid of undefined values
    values = deepFilter(values, (value) => value !== undefined);
    // check if provided values are valid for given operator
    validateForOperator(operator, values);
    // load property metadata if model metadata was provided
    let propertyMetadata;
    if (metadata) {
        propertyMetadata = metadata.forProperty(attributePath);
    }
    /*
     * resolve placeholder and valuePlaceholder names (same as attributePath if it not already exists)
     * myProp -> #myProp for name placeholder and :myProp for value placeholder
     *
     * person[0] -> #person: person
     * person.list[0].age -> #person: person, #attr: attr, #age: age
     * person.age
     */
    const resolvedAttributeNames = attribute_names_function_1.resolveAttributeNames(attributePath, metadata);
    const valuePlaceholder = unique_attribute_value_name_function_1.uniqueAttributeValueName(attributePath, existingValueNames);
    /*
     * build the statement
     */
    let buildFilterFn;
    switch (operator) {
        case 'IN':
            buildFilterFn = buildInConditionExpression;
            break;
        case 'BETWEEN':
            buildFilterFn = buildBetweenConditionExpression;
            break;
        default:
            buildFilterFn = curry_function_1.curry(buildDefaultConditionExpression)(operator);
    }
    return buildFilterFn(attributePath, resolvedAttributeNames.placeholder, valuePlaceholder, resolvedAttributeNames.attributeNames, values, existingValueNames, propertyMetadata);
}
exports.buildFilterExpression = buildFilterExpression;
/**
 * IN expression is unlike all the others property the operand is an array of unwrapped values (not attribute values)
 *
 * @param {string} attributePath
 * @param {string[]} values
 * @param {string[]} existingValueNames
 * @param {PropertyMetadata<any>} propertyMetadata
 * @returns {Expression}
 * @hidden
 */
function buildInConditionExpression(attributePath, namePlaceholder, valuePlaceholder, attributeNames, values, existingValueNames, propertyMetadata) {
    const attributeValues = values[0]
        .map((value) => mapper_1.toDbOne(value, propertyMetadata))
        .reduce((result, mappedValue, index) => {
        if (mappedValue !== null) {
            update_expression_builder_1.validateAttributeType('IN condition', mappedValue, 'S', 'N', 'B');
            result[`${valuePlaceholder}_${index}`] = mappedValue;
        }
        return result;
    }, {});
    const inStatement = values[0].map((value, index) => `${valuePlaceholder}_${index}`).join(', ');
    return {
        statement: `${namePlaceholder} IN (${inStatement})`,
        attributeNames,
        attributeValues,
    };
}
/**
 * @hidden
 */
function buildBetweenConditionExpression(attributePath, namePlaceholder, valuePlaceholder, attributeNames, values, existingValueNames, propertyMetadata) {
    const attributeValues = {};
    const mappedValue1 = mapper_1.toDbOne(values[0], propertyMetadata);
    const mappedValue2 = mapper_1.toDbOne(values[1], propertyMetadata);
    if (mappedValue1 === null || mappedValue2 === null) {
        throw new Error('make sure to provide an actual value for te BETWEEN operator');
    }
    ;
    [mappedValue1, mappedValue2].forEach((mv) => update_expression_builder_1.validateAttributeType('between', mv, 'S', 'N', 'B'));
    const value2Placeholder = unique_attribute_value_name_function_1.uniqueAttributeValueName(attributePath, [valuePlaceholder].concat(existingValueNames || []));
    const statement = `${namePlaceholder} BETWEEN ${valuePlaceholder} AND ${value2Placeholder}`;
    attributeValues[valuePlaceholder] = mappedValue1;
    attributeValues[value2Placeholder] = mappedValue2;
    return {
        statement,
        attributeNames,
        attributeValues,
    };
}
/**
 * @hidden
 */
function buildDefaultConditionExpression(operator, attributePath, namePlaceholder, valuePlaceholder, attributeNames, values, existingValueNames, propertyMetadata) {
    let statement;
    let hasValue = true;
    if (is_function_operator_function_1.isFunctionOperator(operator)) {
        if (is_no_param_function_operator_function_1.isNoParamFunctionOperator(operator)) {
            statement = `${operator} (${namePlaceholder})`;
            hasValue = false;
        }
        else {
            statement = `${operator} (${namePlaceholder}, ${valuePlaceholder})`;
        }
    }
    else {
        statement = [namePlaceholder, operator, valuePlaceholder].join(' ');
    }
    const attributeValues = {};
    if (hasValue) {
        let attribute;
        if (operator === 'contains' || operator === 'not_contains') {
            attribute = mapper_1.toDbOne(values[0], property_metadata_model_1.alterCollectionPropertyMetadataForSingleItem(propertyMetadata));
            update_expression_builder_1.validateAttributeType(`${operator} condition`, attribute, 'N', 'S', 'B');
        }
        else {
            attribute = mapper_1.toDbOne(values[0], propertyMetadata);
            switch (operator) {
                case 'begins_with':
                    update_expression_builder_1.validateAttributeType(`${operator} condition`, attribute, 'S', 'B');
                    break;
                case '<':
                case '<=':
                case '>':
                case '>=':
                    update_expression_builder_1.validateAttributeType(`${operator} condition`, attribute, 'N', 'S', 'B');
                    break;
            }
        }
        if (attribute) {
            attributeValues[valuePlaceholder] = attribute;
        }
    }
    return {
        statement,
        attributeNames,
        attributeValues,
    };
}
/**
 * Every operator requires a predefined arity of parameters, this method checks for the correct arity and throws an Error
 * if not correct
 *
 * @param operator
 * @param values The values which will be applied to the operator function implementation, not every operator requires values
 * @throws {Error} error Throws an error if the amount of values won't match the operator function parameter arity or
 * the given values is not an array
 * @hidden
 */
function validateForOperator(operator, values) {
    validateArity(operator, values);
    /*
     * validate values if operator supports values
     */
    if (!is_function_operator_function_1.isFunctionOperator(operator) || (is_function_operator_function_1.isFunctionOperator(operator) && !is_no_param_function_operator_function_1.isNoParamFunctionOperator(operator))) {
        if (values && Array.isArray(values) && values.length) {
            validateValues(operator, values);
        }
        else {
            throw new Error(util_2.dynamicTemplate(exports.ERR_ARITY_DEFAULT, { parameterArity: operator_parameter_arity_function_1.operatorParameterArity(operator), operator }));
        }
    }
}
// tslint:disable:no-invalid-template-strings
/*
 * error messages for arity issues
 */
/**
 * @hidden
 */
exports.ERR_ARITY_IN = 'expected ${parameterArity} value(s) for operator ${operator}, this is not the right amount of method parameters for this operator (IN operator requires one value of array type)';
/**
 * @hidden
 */
exports.ERR_ARITY_DEFAULT = 'expected ${parameterArity} value(s) for operator ${operator}, this is not the right amount of method parameters for this operator';
// tslint:enable:no-invalid-template-strings
/**
 * @hidden
 */
function validateArity(operator, values) {
    if (values === null || values === undefined) {
        if (is_function_operator_function_1.isFunctionOperator(operator) && !is_no_param_function_operator_function_1.isNoParamFunctionOperator(operator)) {
            // the operator needs some values to work
            throw new Error(util_2.dynamicTemplate(exports.ERR_ARITY_DEFAULT, { parameterArity: operator_parameter_arity_function_1.operatorParameterArity(operator), operator }));
        }
    }
    else if (values && Array.isArray(values)) {
        const parameterArity = operator_parameter_arity_function_1.operatorParameterArity(operator);
        // check for correct amount of values
        if (values.length !== parameterArity) {
            switch (operator) {
                case 'IN':
                    throw new Error(util_2.dynamicTemplate(exports.ERR_ARITY_IN, { parameterArity, operator }));
                default:
                    throw new Error(util_2.dynamicTemplate(exports.ERR_ARITY_DEFAULT, { parameterArity, operator }));
            }
        }
    }
}
/*
 * error message for wrong operator values
 */
// tslint:disable:no-invalid-template-strings
/**
 * @hidden
 */
exports.ERR_VALUES_BETWEEN_TYPE = 'both values for operator BETWEEN must have the same type, got ${value1} and ${value2}';
/**
 * @hidden
 */
exports.ERR_VALUES_IN = 'the provided value for IN operator must be an array';
// tslint:enable:no-invalid-template-strings
/**
 * Every operator has some constraints about the values it supports, this method makes sure everything is fine for given
 * operator and values
 * @hidden
 */
function validateValues(operator, values) {
    // some additional operator dependent validation
    switch (operator) {
        case 'BETWEEN':
            // values must be the same type
            if (util_1.typeOf(values[0]) !== util_1.typeOf(values[1])) {
                throw new Error(util_2.dynamicTemplate(exports.ERR_VALUES_BETWEEN_TYPE, { value1: util_1.typeOf(values[0]), value2: util_1.typeOf(values[1]) }));
            }
            break;
        case 'IN':
            if (!Array.isArray(values[0])) {
                throw new Error(exports.ERR_VALUES_IN);
            }
    }
}
//# sourceMappingURL=condition-expression-builder.js.map