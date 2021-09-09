import * as tslib_1 from "tslib";
import { promiseTap } from '../../helper/promise-tap.function';
import { fromDb } from '../../mapper/mapper';
import { and } from '../expression/logical-operator/public.api';
import { addExpression } from '../expression/param-util';
import { addCondition } from '../expression/request-expression-builder';
import { StandardRequest } from './standard.request';
/**
 * abstract class for all basic write request classes (DeleteItem, PutItem, UpdateItem
 */
var WriteRequest = /** @class */ (function (_super) {
    tslib_1.__extends(WriteRequest, _super);
    function WriteRequest(dynamoDBWrapper, modelClazz) {
        return _super.call(this, dynamoDBWrapper, modelClazz) || this;
    }
    /**
     * return item collection metrics.
     */
    WriteRequest.prototype.returnItemCollectionMetrics = function (returnItemCollectionMetrics) {
        this.params.ReturnItemCollectionMetrics = returnItemCollectionMetrics;
        return this;
    };
    WriteRequest.prototype.onlyIfAttribute = function (attributePath) {
        return addCondition('ConditionExpression', attributePath, this, this.metadata);
    };
    /**
     * @example writeRequest.onlyIf( attribute('age').eq(23) )
     * @example writeRequest.onlyIf( or( attribute('age').lt(18), attribute('age').gt(65) ) )
     */
    WriteRequest.prototype.onlyIf = function () {
        var conditionDefFns = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            conditionDefFns[_i] = arguments[_i];
        }
        var condition = and.apply(void 0, tslib_1.__spread(conditionDefFns))(undefined, this.metadata);
        addExpression('ConditionExpression', condition, this.params);
        return this;
    };
    /**
     * @returns { void } if no ReturnValues are requested, { T } if the requested ReturnValues are ALL_OLD|ALL_NEW or {Partial<T>} if the requested ReturnValues are UPDATED_OLD|UPDATED_NEW
     */
    WriteRequest.prototype.exec = function () {
        /*
         * kind a hacky - this is just for typing reasons so Promise<void> is the default return type when not defining a
         * returnValues other than NONE
         */
        return this.execFullResponse().then(function (r) { return r.Item; });
    };
    /**
     * execute request and return the full response
     */
    WriteRequest.prototype.execFullResponse = function () {
        var _this = this;
        this.logger.debug('request', this.params);
        return this.doRequest(this.params)
            .then(promiseTap(function (response) { return _this.logger.debug('response', response); }))
            .then(function (resp) {
            var attrs = resp.Attributes;
            delete resp.Attributes; // delete Attributes on response so it will not be on returned value
            var r = resp;
            if (typeof attrs === 'object' && attrs !== null) {
                /*
                 * kind a hacky - this is just for typing reasons so Item is default not defined when not defining a
                 * returnValues other than NONE
                 */
                ;
                r.Item = fromDb(attrs, _this.modelClazz);
            }
            return r;
        })
            .then(promiseTap(function (resp) { return _this.logger.debug('mapped response', resp); }));
    };
    /**
     * execute request without parsing (mapping) the response attributes to js objects
     */
    WriteRequest.prototype.execNoMap = function () {
        var _this = this;
        this.logger.debug('request', this.params);
        return this.doRequest(this.params).then(promiseTap(function (response) { return _this.logger.debug('response', response); }));
    };
    return WriteRequest;
}(StandardRequest));
export { WriteRequest };
//# sourceMappingURL=write.request.js.map