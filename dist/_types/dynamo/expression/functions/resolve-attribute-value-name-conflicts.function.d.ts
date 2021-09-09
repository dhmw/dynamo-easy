import { ConditionalParams } from '../../operation-params.type';
import { Expression } from '../type/expression.type';
/**
 * resolves name conflict when expression uses an attributeValueName that is already used in given *Input
 * @param expression
 * @param params
 * @return safe-to-use Expression
 * @hidden
 */
export declare function resolveAttributeValueNameConflicts(expression: Expression, params: ConditionalParams): Expression;
