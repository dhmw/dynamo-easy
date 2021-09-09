import * as tslib_1 from "tslib";
import { createLogger } from '../../../logger/logger';
import { createKeyAttributes } from '../../../mapper/mapper';
import { prepareAndAddUpdateExpressions } from '../../expression/prepare-and-add-update-expressions.function';
import { addUpdate } from '../../expression/request-expression-builder';
import { WriteRequest } from '../write.request';
/**
 * Request class for the UpdateItem operation.
 */
var UpdateRequest = /** @class */ (function (_super) {
    tslib_1.__extends(UpdateRequest, _super);
    function UpdateRequest(dynamoDBWrapper, modelClazz, partitionKey, sortKey) {
        var _this = _super.call(this, dynamoDBWrapper, modelClazz) || this;
        _this.logger = createLogger('dynamo.request.UpdateRequest', modelClazz);
        _this.params.Key = createKeyAttributes(_this.metadata, partitionKey, sortKey);
        return _this;
    }
    /**
     * create and add a single update operation
     * @example req.updateAttribute('path.to.attr').set('newVal')
     */
    UpdateRequest.prototype.updateAttribute = function (attributePath) {
        return addUpdate(attributePath, this, this.metadata);
    };
    /**
     * add multiple update operations comma separated
     * @example req.operations(update('path.to.attr).set('newVal'), ... )
     */
    UpdateRequest.prototype.operations = function () {
        var updateDefFns = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            updateDefFns[_i] = arguments[_i];
        }
        prepareAndAddUpdateExpressions(this.metadata, this.params, updateDefFns);
        return this;
    };
    UpdateRequest.prototype.returnValues = function (returnValues) {
        this.params.ReturnValues = returnValues;
        return this;
    };
    UpdateRequest.prototype.doRequest = function (params) {
        return this.dynamoDBWrapper.updateItem(this.params);
    };
    return UpdateRequest;
}(WriteRequest));
export { UpdateRequest };
//# sourceMappingURL=update.request.js.map