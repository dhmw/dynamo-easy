import * as tslib_1 from "tslib";
import { createKeyAttributes } from '../../mapper/mapper';
import { prepareAndAddUpdateExpressions } from '../expression/prepare-and-add-update-expressions.function';
import { addUpdate } from '../expression/request-expression-builder';
import { TransactBaseOperation } from './transact-base-operation';
/**
 * TransactOperation class for transactional update items.
 */
var TransactUpdate = /** @class */ (function (_super) {
    tslib_1.__extends(TransactUpdate, _super);
    function TransactUpdate(modelClazz, partitionKey, sortKey) {
        var _this = _super.call(this, modelClazz) || this;
        _this.params.Key = createKeyAttributes(_this.metadata, partitionKey, sortKey);
        return _this;
    }
    /**
     * create and add a single update operation
     * @example updtTrans.updateAttribute('path.to.attr').set('newVal')
     */
    TransactUpdate.prototype.updateAttribute = function (attributePath) {
        return addUpdate(attributePath, this, this.metadata);
    };
    /**
     * add multiple update ops
     * @example updtTrans.operations(update('path.to.attr).set('newVal'), ... )
     */
    TransactUpdate.prototype.operations = function () {
        var updateDefFns = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            updateDefFns[_i] = arguments[_i];
        }
        prepareAndAddUpdateExpressions(this.metadata, this.params, updateDefFns);
        return this;
    };
    Object.defineProperty(TransactUpdate.prototype, "transactItem", {
        get: function () {
            return {
                Update: tslib_1.__assign({}, this.params),
            };
        },
        enumerable: true,
        configurable: true
    });
    return TransactUpdate;
}(TransactBaseOperation));
export { TransactUpdate };
//# sourceMappingURL=transact-update.js.map