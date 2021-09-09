import { OPERATOR_TO_ALIAS_MAP } from '../type/condition-operator-to-alias-map.const';
/**
 * @hidden
 */
export function operatorForAlias(alias) {
    var operator;
    Object.keys(OPERATOR_TO_ALIAS_MAP).forEach(function (key) {
        var a = OPERATOR_TO_ALIAS_MAP[key];
        if (Array.isArray(a)) {
            if (a.includes(alias)) {
                operator = key;
            }
        }
        else {
            if (a === alias) {
                operator = key;
            }
        }
    });
    return operator;
}
//# sourceMappingURL=operator-for-alias.function.js.map