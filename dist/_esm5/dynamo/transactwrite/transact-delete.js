import * as tslib_1 from "tslib";
import { createKeyAttributes } from '../../mapper/mapper';
import { TransactBaseOperation } from './transact-base-operation';
/**
 * TransactOperation class for transactional delete items
 */
var TransactDelete = /** @class */ (function (_super) {
    tslib_1.__extends(TransactDelete, _super);
    function TransactDelete(modelClazz, partitionKey, sortKey) {
        var _this = _super.call(this, modelClazz) || this;
        _this.params.Key = createKeyAttributes(_this.metadata, partitionKey, sortKey);
        return _this;
    }
    Object.defineProperty(TransactDelete.prototype, "transactItem", {
        get: function () {
            return {
                Delete: tslib_1.__assign({}, this.params),
            };
        },
        enumerable: true,
        configurable: true
    });
    return TransactDelete;
}(TransactBaseOperation));
export { TransactDelete };
//# sourceMappingURL=transact-delete.js.map