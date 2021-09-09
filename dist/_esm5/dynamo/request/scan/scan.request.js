import * as tslib_1 from "tslib";
import { createLogger } from '../../../logger/logger';
import { ReadManyRequest } from '../read-many.request';
/**
 * Request class for the Scan operation.
 */
var ScanRequest = /** @class */ (function (_super) {
    tslib_1.__extends(ScanRequest, _super);
    function ScanRequest(dynamoDBWrapper, modelClazz) {
        var _this = _super.call(this, dynamoDBWrapper, modelClazz) || this;
        _this.logger = createLogger('dynamo.request.ScanRequest', modelClazz);
        return _this;
    }
    ScanRequest.prototype.doRequest = function (params) {
        return this.dynamoDBWrapper.scan(params);
    };
    return ScanRequest;
}(ReadManyRequest));
export { ScanRequest };
//# sourceMappingURL=scan.request.js.map