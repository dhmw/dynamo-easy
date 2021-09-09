import * as tslib_1 from "tslib";
import { createToKeyFn, fromDb } from '../../../mapper/mapper';
import { BaseRequest } from '../base.request';
/**
 * Request class for TransactGetItems operation which supports a single model class only.
 */
var TransactGetSingleTableRequest = /** @class */ (function (_super) {
    tslib_1.__extends(TransactGetSingleTableRequest, _super);
    function TransactGetSingleTableRequest(dynamoDBWrapper, modelClazz, keys) {
        var _this = _super.call(this, dynamoDBWrapper, modelClazz) || this;
        _this.mapResponse = function (response) {
            return {
                ConsumedCapacity: response.ConsumedCapacity,
                Items: (response.Responses || []).map(function (item) { return fromDb(item.Item, _this.modelClazz); }),
            };
        };
        _this.params.TransactItems = keys.map(function (key) { return ({
            Get: {
                TableName: _this.tableName,
                Key: createToKeyFn(_this.modelClazz)(key),
            },
        }); });
        return _this;
    }
    /**
     * fetch all entries and return the raw response (without parsing the attributes to js objects)
     */
    TransactGetSingleTableRequest.prototype.execNoMap = function () {
        return this.dynamoDBWrapper.transactGetItems(this.params);
    };
    TransactGetSingleTableRequest.prototype.execFullResponse = function () {
        return this.dynamoDBWrapper.transactGetItems(this.params).then(this.mapResponse);
    };
    /**
     * execute request and return the parsed items
     */
    TransactGetSingleTableRequest.prototype.exec = function () {
        return this.dynamoDBWrapper
            .transactGetItems(this.params)
            .then(this.mapResponse)
            .then(function (r) { return r.Items; });
    };
    return TransactGetSingleTableRequest;
}(BaseRequest));
export { TransactGetSingleTableRequest };
//# sourceMappingURL=transact-get-single-table.request.js.map