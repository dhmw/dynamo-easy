import { OPERATOR_TO_ALIAS_MAP } from '../type/condition-operator-to-alias-map.const';
/**
 * @hidden
 */
export function aliasForOperator(operator) {
    return Array.isArray(OPERATOR_TO_ALIAS_MAP[operator])
        ? OPERATOR_TO_ALIAS_MAP[operator][0]
        : OPERATOR_TO_ALIAS_MAP[operator];
}
//# sourceMappingURL=alias-for-operator.function.js.map