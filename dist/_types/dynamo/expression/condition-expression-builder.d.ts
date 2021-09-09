/**
 * @module expression
 */
import { Metadata } from '../../decorator/metadata/metadata';
import { ConditionOperator } from './type/condition-operator.type';
import { Expression } from './type/expression.type';
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
export declare function deepFilter(obj: any, filterFn: (value: any) => boolean): any;
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
export declare function buildFilterExpression(attributePath: string, operator: ConditionOperator, values: any[], existingValueNames: string[] | undefined, metadata: Metadata<any> | undefined): Expression;
/**
 * @hidden
 */
export declare const ERR_ARITY_IN = "expected ${parameterArity} value(s) for operator ${operator}, this is not the right amount of method parameters for this operator (IN operator requires one value of array type)";
/**
 * @hidden
 */
export declare const ERR_ARITY_DEFAULT = "expected ${parameterArity} value(s) for operator ${operator}, this is not the right amount of method parameters for this operator";
/**
 * @hidden
 */
export declare const ERR_VALUES_BETWEEN_TYPE = "both values for operator BETWEEN must have the same type, got ${value1} and ${value2}";
/**
 * @hidden
 */
export declare const ERR_VALUES_IN = "the provided value for IN operator must be an array";
