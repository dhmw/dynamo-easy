import * as tslib_1 from "tslib";
import { getTableName } from '../get-table-name.function';
import { BaseRequest } from './base.request';
/**
 * abstract class for all requests types that operate on exactly one dynamo table.
 * basically just sets the TableName info on input params.
 */
var StandardRequest = /** @class */ (function (_super) {
    tslib_1.__extends(StandardRequest, _super);
    function StandardRequest(dynamoDBWrapper, modelClazz) {
        var _this = _super.call(this, dynamoDBWrapper, modelClazz) || this;
        _this.params.TableName = getTableName(_this.metadata);
        return _this;
    }
    return StandardRequest;
}(BaseRequest));
export { StandardRequest };
//# sourceMappingURL=standard.request.js.map