/**
 * @module expression
 */
import { Metadata } from '../../decorator/metadata/metadata';
import { AttributeType } from '../../mapper/type/attribute-type.type';
import { Attribute } from '../../mapper/type/attribute.type';
import { UpdateActionDef } from './type/update-action-def';
import { UpdateExpression } from './type/update-expression.type';
/**
 * Will create a condition which can be added to a request using the param object.
 * It will create the expression statement and the attribute names and values.
 *
 * @param {string} attributePath
 * @param {ConditionOperator} operation
 * @param {any[]} values Depending on the operation the amount of values differs
 * @param {string[]} existingValueNames If provided the existing names are used to make sure we have a unique name for the current attributePath
 * @param {Metadata<any>} metadata If provided we use the metadata to define the attribute name and use it to map the given value(s) to attributeValue(s)
 * @returns {Expression}
 * @hidden
 */
export declare function buildUpdateExpression(attributePath: string, operation: UpdateActionDef, values: any[], existingValueNames: string[] | undefined, metadata: Metadata<any> | undefined): UpdateExpression;
/**
 * @hidden
 */
export declare function validateAttributeType(name: string, attribute: Attribute | null, ...allowedTypes: AttributeType[]): void;
