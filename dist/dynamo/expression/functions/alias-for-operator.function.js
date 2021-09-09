"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const condition_operator_to_alias_map_const_1 = require("../type/condition-operator-to-alias-map.const");
/**
 * @hidden
 */
function aliasForOperator(operator) {
    return Array.isArray(condition_operator_to_alias_map_const_1.OPERATOR_TO_ALIAS_MAP[operator])
        ? condition_operator_to_alias_map_const_1.OPERATOR_TO_ALIAS_MAP[operator][0]
        : condition_operator_to_alias_map_const_1.OPERATOR_TO_ALIAS_MAP[operator];
}
exports.aliasForOperator = aliasForOperator;
//# sourceMappingURL=alias-for-operator.function.js.map