import * as tslib_1 from "tslib";
import { toDb } from '../../mapper/mapper';
import { createIfNotExistsCondition } from '../expression/create-if-not-exists-condition.function';
import { TransactBaseOperation } from './transact-base-operation';
/**
 * TransactOperation class for transactional put items.
 */
var TransactPut = /** @class */ (function (_super) {
    tslib_1.__extends(TransactPut, _super);
    function TransactPut(modelClazz, item) {
        var _this = _super.call(this, modelClazz) || this;
        _this.params.Item = toDb(item, _this.modelClazz);
        return _this;
    }
    /**
     * Adds a condition expression to the request, which makes sure the item will only be saved if the id does not exist
     */
    TransactPut.prototype.ifNotExists = function (predicate) {
        if (predicate === void 0) { predicate = true; }
        if (predicate) {
            this.onlyIf.apply(this, tslib_1.__spread(createIfNotExistsCondition(this.metadata)));
        }
        return this;
    };
    Object.defineProperty(TransactPut.prototype, "transactItem", {
        get: function () {
            return {
                Put: tslib_1.__assign({}, this.params),
            };
        },
        enumerable: true,
        configurable: true
    });
    return TransactPut;
}(TransactBaseOperation));
export { TransactPut };
//# sourceMappingURL=transact-put.js.map