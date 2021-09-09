/**
 * @module expression
 */
import { OperatorAlias } from './condition-operator-alias.type';
import { ConditionOperator } from './condition-operator.type';
/**
 * mapped type
 * @hidden
 */
export interface AliasedOperatorMapEntry extends Record<ConditionOperator, OperatorAlias | OperatorAlias[]> {
    [key: string]: OperatorAlias | OperatorAlias[];
}
/**
 * @hidden
 */
export declare const OPERATOR_TO_ALIAS_MAP: AliasedOperatorMapEntry;
