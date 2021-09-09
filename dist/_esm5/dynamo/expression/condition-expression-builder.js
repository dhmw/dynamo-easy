import { alterCollectionPropertyMetadataForSingleItem, } from '../../decorator/metadata/property-metadata.model';
import { curry } from '../../helper/curry.function';
import { isPlainObject } from '../../helper/is-plain-object.function';
import { toDbOne } from '../../mapper/mapper';
import { typeOf } from '../../mapper/util';
import { resolveAttributeNames } from './functions/attribute-names.function';
import { isFunctionOperator } from './functions/is-function-operator.function';
import { isNoParamFunctionOperator } from './functions/is-no-param-function-operator.function';
import { operatorParameterArity } from './functions/operator-parameter-arity.function';
import { uniqueAttributeValueName } from './functions/unique-attribute-value-name.function';
import { validateAttributeType } from './update-expression-builder';
import { dynamicTemplate } from './util';
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
export function deepFilter(obj, filterFn) {
    if (Array.isArray(obj)) {
        var returnArr_1 = [];
        obj.forEach(function (i) {
            var item = deepFilter(i, filterFn);
            if (item !== null) {
                returnArr_1.push(item);
            }
        });
        return returnArr_1.length ? returnArr_1 : null;
    }
    else if (obj instanceof Set) {
        var returnArr_2 = [];
        Array.from(obj).forEach(function (i) {
            var item = deepFilter(i, filterFn);
            if (item !== null) {
                returnArr_2.push(item);
            }
        });
        return returnArr_2.length ? new Set(returnArr_2) : null;
    }
    else if (isPlainObject(obj)) {
        var returnObj = {};
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                var value = obj[key];
                var item = deepFilter(value, filterFn);
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
export function buildFilterExpression(attributePath, operator, values, existingValueNames, metadata) {
    // metadata get rid of undefined values
    values = deepFilter(values, function (value) { return value !== undefined; });
    // check if provided values are valid for given operator
    validateForOperator(operator, values);
    // load property metadata if model metadata was provided
    var propertyMetadata;
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
    var resolvedAttributeNames = resolveAttributeNames(attributePath, metadata);
    var valuePlaceholder = uniqueAttributeValueName(attributePath, existingValueNames);
    /*
     * build the statement
     */
    var buildFilterFn;
    switch (operator) {
        case 'IN':
            buildFilterFn = buildInConditionExpression;
            break;
        case 'BETWEEN':
            buildFilterFn = buildBetweenConditionExpression;
            break;
        default:
            buildFilterFn = curry(buildDefaultConditionExpression)(operator);
    }
    return buildFilterFn(attributePath, resolvedAttributeNames.placeholder, valuePlaceholder, resolvedAttributeNames.attributeNames, values, existingValueNames, propertyMetadata);
}
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
    var attributeValues = values[0]
        .map(function (value) { return toDbOne(value, propertyMetadata); })
        .reduce(function (result, mappedValue, index) {
        if (mappedValue !== null) {
            validateAttributeType('IN condition', mappedValue, 'S', 'N', 'B');
            result[valuePlaceholder + "_" + index] = mappedValue;
        }
        return result;
    }, {});
    var inStatement = values[0].map(function (value, index) { return valuePlaceholder + "_" + index; }).join(', ');
    return {
        statement: namePlaceholder + " IN (" + inStatement + ")",
        attributeNames: attributeNames,
        attributeValues: attributeValues,
    };
}
/**
 * @hidden
 */
function buildBetweenConditionExpression(attributePath, namePlaceholder, valuePlaceholder, attributeNames, values, existingValueNames, propertyMetadata) {
    var attributeValues = {};
    var mappedValue1 = toDbOne(values[0], propertyMetadata);
    var mappedValue2 = toDbOne(values[1], propertyMetadata);
    if (mappedValue1 === null || mappedValue2 === null) {
        throw new Error('make sure to provide an actual value for te BETWEEN operator');
    }
    ;
    [mappedValue1, mappedValue2].forEach(function (mv) { return validateAttributeType('between', mv, 'S', 'N', 'B'); });
    var value2Placeholder = uniqueAttributeValueName(attributePath, [valuePlaceholder].concat(existingValueNames || []));
    var statement = namePlaceholder + " BETWEEN " + valuePlaceholder + " AND " + value2Placeholder;
    attributeValues[valuePlaceholder] = mappedValue1;
    attributeValues[value2Placeholder] = mappedValue2;
    return {
        statement: statement,
        attributeNames: attributeNames,
        attributeValues: attributeValues,
    };
}
/**
 * @hidden
 */
function buildDefaultConditionExpression(operator, attributePath, namePlaceholder, valuePlaceholder, attributeNames, values, existingValueNames, propertyMetadata) {
    var statement;
    var hasValue = true;
    if (isFunctionOperator(operator)) {
        if (isNoParamFunctionOperator(operator)) {
            statement = operator + " (" + namePlaceholder + ")";
            hasValue = false;
        }
        else {
            statement = operator + " (" + namePlaceholder + ", " + valuePlaceholder + ")";
        }
    }
    else {
        statement = [namePlaceholder, operator, valuePlaceholder].join(' ');
    }
    var attributeValues = {};
    if (hasValue) {
        var attribute = void 0;
        if (operator === 'contains' || operator === 'not_contains') {
            attribute = toDbOne(values[0], alterCollectionPropertyMetadataForSingleItem(propertyMetadata));
            validateAttributeType(operator + " condition", attribute, 'N', 'S', 'B');
        }
        else {
            attribute = toDbOne(values[0], propertyMetadata);
            switch (operator) {
                case 'begins_with':
                    validateAttributeType(operator + " condition", attribute, 'S', 'B');
                    break;
                case '<':
                case '<=':
                case '>':
                case '>=':
                    validateAttributeType(operator + " condition", attribute, 'N', 'S', 'B');
                    break;
            }
        }
        if (attribute) {
            attributeValues[valuePlaceholder] = attribute;
        }
    }
    return {
        statement: statement,
        attributeNames: attributeNames,
        attributeValues: attributeValues,
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
    if (!isFunctionOperator(operator) || (isFunctionOperator(operator) && !isNoParamFunctionOperator(operator))) {
        if (values && Array.isArray(values) && values.length) {
            validateValues(operator, values);
        }
        else {
            throw new Error(dynamicTemplate(ERR_ARITY_DEFAULT, { parameterArity: operatorParameterArity(operator), operator: operator }));
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
export var ERR_ARITY_IN = 'expected ${parameterArity} value(s) for operator ${operator}, this is not the right amount of method parameters for this operator (IN operator requires one value of array type)';
/**
 * @hidden
 */
export var ERR_ARITY_DEFAULT = 'expected ${parameterArity} value(s) for operator ${operator}, this is not the right amount of method parameters for this operator';
// tslint:enable:no-invalid-template-strings
/**
 * @hidden
 */
function validateArity(operator, values) {
    if (values === null || values === undefined) {
        if (isFunctionOperator(operator) && !isNoParamFunctionOperator(operator)) {
            // the operator needs some values to work
            throw new Error(dynamicTemplate(ERR_ARITY_DEFAULT, { parameterArity: operatorParameterArity(operator), operator: operator }));
        }
    }
    else if (values && Array.isArray(values)) {
        var parameterArity = operatorParameterArity(operator);
        // check for correct amount of values
        if (values.length !== parameterArity) {
            switch (operator) {
                case 'IN':
                    throw new Error(dynamicTemplate(ERR_ARITY_IN, { parameterArity: parameterArity, operator: operator }));
                default:
                    throw new Error(dynamicTemplate(ERR_ARITY_DEFAULT, { parameterArity: parameterArity, operator: operator }));
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
export var ERR_VALUES_BETWEEN_TYPE = 'both values for operator BETWEEN must have the same type, got ${value1} and ${value2}';
/**
 * @hidden
 */
export var ERR_VALUES_IN = 'the provided value for IN operator must be an array';
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
            if (typeOf(values[0]) !== typeOf(values[1])) {
                throw new Error(dynamicTemplate(ERR_VALUES_BETWEEN_TYPE, { value1: typeOf(values[0]), value2: typeOf(values[1]) }));
            }
            break;
        case 'IN':
            if (!Array.isArray(values[0])) {
                throw new Error(ERR_VALUES_IN);
            }
    }
}
//# sourceMappingURL=condition-expression-builder.js.map