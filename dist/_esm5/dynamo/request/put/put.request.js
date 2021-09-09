import * as tslib_1 from "tslib";
import { createLogger } from '../../../logger/logger';
import { toDb } from '../../../mapper/mapper';
import { createIfNotExistsCondition } from '../../expression/create-if-not-exists-condition.function';
import { WriteRequest } from '../write.request';
/**
 * Request class for the PutItem operation.
 */
var PutRequest = /** @class */ (function (_super) {
    tslib_1.__extends(PutRequest, _super);
    function PutRequest(dynamoDBWrapper, modelClazz, item) {
        var _this = _super.call(this, dynamoDBWrapper, modelClazz) || this;
        _this.logger = createLogger('dynamo.request.PutRequest', modelClazz);
        _this.params.Item = toDb(item, _this.modelClazz);
        return _this;
    }
    /**
     * Adds a condition expression to the request, which makes sure the item will only be saved if the id does not exist
     * @param predicate if false is provided nothing happens (it does NOT remove the condition)
     */
    PutRequest.prototype.ifNotExists = function (predicate) {
        if (predicate === void 0) { predicate = true; }
        if (predicate) {
            this.onlyIf.apply(this, tslib_1.__spread(createIfNotExistsCondition(this.metadata)));
        }
        return this;
    };
    PutRequest.prototype.returnValues = function (returnValues) {
        this.params.ReturnValues = returnValues;
        return this;
    };
    PutRequest.prototype.doRequest = function (params) {
        return this.dynamoDBWrapper.putItem(params);
    };
    return PutRequest;
}(WriteRequest));
export { PutRequest };
//# sourceMappingURL=put.request.js.map