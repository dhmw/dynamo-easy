"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const condition_operator_to_alias_map_const_1 = require("../type/condition-operator-to-alias-map.const");
/**
 * @hidden
 */
function operatorForAlias(alias) {
    let operator;
    Object.keys(condition_operator_to_alias_map_const_1.OPERATOR_TO_ALIAS_MAP).forEach((key) => {
        const a = condition_operator_to_alias_map_const_1.OPERATOR_TO_ALIAS_MAP[key];
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
exports.operatorForAlias = operatorForAlias;
//# sourceMappingURL=operator-for-alias.function.js.map