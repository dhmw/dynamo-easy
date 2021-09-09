import * as tslib_1 from "tslib";
import { createLogger } from '../../../logger/logger';
import { createKeyAttributes } from '../../../mapper/mapper';
import { WriteRequest } from '../write.request';
/**
 * Request class for the DeleteItem operation.
 */
var DeleteRequest = /** @class */ (function (_super) {
    tslib_1.__extends(DeleteRequest, _super);
    function DeleteRequest(dynamoDBWrapper, modelClazz, partitionKey, sortKey) {
        var _this = _super.call(this, dynamoDBWrapper, modelClazz) || this;
        _this.logger = createLogger('dynamo.request.DeleteRequest', modelClazz);
        _this.params.Key = createKeyAttributes(_this.metadata, partitionKey, sortKey);
        return _this;
    }
    DeleteRequest.prototype.returnValues = function (returnValues) {
        this.params.ReturnValues = returnValues;
        return this;
    };
    DeleteRequest.prototype.doRequest = function (params) {
        return this.dynamoDBWrapper.deleteItem(params);
    };
    return DeleteRequest;
}(WriteRequest));
export { DeleteRequest };
//# sourceMappingURL=delete.request.js.map