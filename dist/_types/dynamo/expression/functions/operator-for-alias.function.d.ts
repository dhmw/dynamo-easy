/**
 * @module expression
 */
import { OperatorAlias } from '../type/condition-operator-alias.type';
import { ConditionOperator } from '../type/condition-operator.type';
/**
 * @hidden
 */
export declare function operatorForAlias(alias: OperatorAlias): ConditionOperator | undefined;
