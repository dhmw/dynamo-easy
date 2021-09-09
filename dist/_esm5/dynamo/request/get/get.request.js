import * as tslib_1 from "tslib";
import { promiseTap } from '../../../helper/promise-tap.function';
import { createLogger } from '../../../logger/logger';
import { createKeyAttributes, fromDb } from '../../../mapper/mapper';
import { addProjectionExpressionParam } from '../helper/add-projection-expression-param.function';
import { StandardRequest } from '../standard.request';
/**
 * Request class for the GetItem operation.
 */
var GetRequest = /** @class */ (function (_super) {
    tslib_1.__extends(GetRequest, _super);
    function GetRequest(dynamoDBWrapper, modelClazz, partitionKey, sortKey) {
        var _this = _super.call(this, dynamoDBWrapper, modelClazz) || this;
        _this.logger = createLogger('dynamo.request.GetRequest', modelClazz);
        _this.params.Key = createKeyAttributes(_this.metadata, partitionKey, sortKey);
        return _this;
    }
    /**
     * Determines the read consistency model: If set to true, then the operation uses strongly consistent reads; otherwise, the operation uses eventually consistent reads.
     */
    GetRequest.prototype.consistentRead = function (consistentRead) {
        if (consistentRead === void 0) { consistentRead = true; }
        this.params.ConsistentRead = consistentRead;
        return this;
    };
    /**
     * Specifies the list of model attributes to be returned from the table instead of returning the entire document
     * @param attributesToGet List of model attributes to be returned
     */
    GetRequest.prototype.projectionExpression = function () {
        var attributesToGet = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            attributesToGet[_i] = arguments[_i];
        }
        addProjectionExpressionParam(attributesToGet, this.params, this.metadata);
        return this;
    };
    GetRequest.prototype.execFullResponse = function () {
        var _this = this;
        this.logger.debug('request', this.params);
        return this.dynamoDBWrapper
            .getItem(this.params)
            .then(promiseTap(function (response) { return _this.logger.debug('response', response); }))
            .then(function (getItemResponse) {
            var response = tslib_1.__assign({}, getItemResponse);
            if (getItemResponse.Item) {
                response.Item = fromDb(getItemResponse.Item, _this.modelClazz);
            }
            else {
                response.Item = null;
            }
            return response;
        })
            .then(promiseTap(function (response) { return _this.logger.debug('mapped item', response.Item); }));
    };
    /**
     * execute request and return the parsed item
     */
    GetRequest.prototype.exec = function () {
        var _this = this;
        this.logger.debug('request', this.params);
        return this.dynamoDBWrapper
            .getItem(this.params)
            .then(promiseTap(function (response) { return _this.logger.debug('response', response); }))
            .then(function (response) {
            if (response.Item) {
                return fromDb(response.Item, _this.modelClazz);
            }
            else {
                return null;
            }
        })
            .then(promiseTap(function (item) { return _this.logger.debug('mapped item', item); }));
    };
    return GetRequest;
}(StandardRequest));
export { GetRequest };
//# sourceMappingURL=get.request.js.map