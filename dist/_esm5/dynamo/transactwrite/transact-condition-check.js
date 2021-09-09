import * as tslib_1 from "tslib";
import { createKeyAttributes } from '../../mapper/mapper';
import { TransactBaseOperation } from './transact-base-operation';
/**
 * TransactOperation class for transactional condition checks.
 */
var TransactConditionCheck = /** @class */ (function (_super) {
    tslib_1.__extends(TransactConditionCheck, _super);
    function TransactConditionCheck(modelClazz, partitionKey, sortKey) {
        var _this = _super.call(this, modelClazz) || this;
        _this.params.Key = createKeyAttributes(_this.metadata, partitionKey, sortKey);
        return _this;
    }
    Object.defineProperty(TransactConditionCheck.prototype, "transactItem", {
        get: function () {
            return {
                ConditionCheck: tslib_1.__assign({}, this.params),
            };
        },
        enumerable: true,
        configurable: true
    });
    return TransactConditionCheck;
}(TransactBaseOperation));
export { TransactConditionCheck };
//# sourceMappingURL=transact-condition-check.js.map