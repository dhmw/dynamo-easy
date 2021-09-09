import * as tslib_1 from "tslib";
import { fetchAll } from '../../helper/fetch-all.function';
import { promiseTap } from '../../helper/promise-tap.function';
import { fromDb } from '../../mapper/mapper';
import { and } from '../expression/logical-operator/and.function';
import { addExpression } from '../expression/param-util';
import { addCondition } from '../expression/request-expression-builder';
import { addProjectionExpressionParam } from './helper/add-projection-expression-param.function';
import { StandardRequest } from './standard.request';
/**
 * abstract class for query and scan request classes.
 */
var ReadManyRequest = /** @class */ (function (_super) {
    tslib_1.__extends(ReadManyRequest, _super);
    function ReadManyRequest(dynamoDBWrapper, modelClazz) {
        var _this = _super.call(this, dynamoDBWrapper, modelClazz) || this;
        _this.mapFromDb = function (output) {
            var response = tslib_1.__assign({}, output);
            response.Items = (output.Items || []).map(function (item) { return fromDb(item, _this.modelClazz); });
            return response;
        };
        return _this;
    }
    /**
     *
     * @param key A map representing the start id which is included in next call, if null is delivered
     * startKey will be removed from params
     */
    ReadManyRequest.prototype.exclusiveStartKey = function (key) {
        // TODO ENHANCEMENT exclusiveStartKey(item: Partial<T>)
        if (key) {
            this.params.ExclusiveStartKey = key;
        }
        else {
            delete this.params.ExclusiveStartKey;
        }
        return this;
    };
    /**
     * query items on the given index.
     */
    ReadManyRequest.prototype.index = function (indexName) {
        var index = this.metadata.getIndex(indexName);
        if (index) {
            this.secondaryIndex = index;
            this.params.IndexName = indexName;
        }
        else {
            throw new Error("there is no index with name <" + indexName + "> defined for model " + this.modelClazz.name);
        }
        return this;
    };
    /**
     * set Limit to params - The maximum number of items to evaluate (not necessarily the number of matching items)
     */
    ReadManyRequest.prototype.limit = function (limit) {
        if (limit === ReadManyRequest.INFINITE_LIMIT) {
            delete this.params.Limit;
        }
        else {
            if (limit !== null && limit !== undefined && limit > 0) {
                this.params.Limit = limit;
            }
            else {
                throw new Error('limit must be a valid positive number');
            }
        }
        return this;
    };
    /**
     * Determines the read consistency model: If set to true, then the operation uses strongly consistent reads; otherwise, the operation uses eventually consistent reads.
     */
    ReadManyRequest.prototype.consistentRead = function (consistentRead) {
        if (consistentRead === void 0) { consistentRead = true; }
        this.params.ConsistentRead = consistentRead;
        return this;
    };
    /**
     * Specifies the list of model attributes to be returned from the table instead of returning the entire document
     * @param attributesToGet List of model attributes to be returned
     */
    ReadManyRequest.prototype.projectionExpression = function () {
        var attributesToGet = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            attributesToGet[_i] = arguments[_i];
        }
        addProjectionExpressionParam(attributesToGet, this.params, this.metadata);
        return this;
    };
    ReadManyRequest.prototype.whereAttribute = function (attributePath) {
        return addCondition('FilterExpression', attributePath, this, this.metadata);
    };
    /**
     * add one or multiple conditions.
     * @example req.where( attribute('age').eq(23) )
     * @example req.where( or( attribute('age').lt(18), attribute('age').gt(65) ) )
     */
    ReadManyRequest.prototype.where = function () {
        var conditionDefFns = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            conditionDefFns[_i] = arguments[_i];
        }
        var condition = and.apply(void 0, tslib_1.__spread(conditionDefFns))(undefined, this.metadata);
        addExpression('FilterExpression', condition, this.params);
        return this;
    };
    /**
     * execute the request and return the raw response (without parsing the attributes to js objects)
     */
    ReadManyRequest.prototype.execNoMap = function () {
        var _this = this;
        this.logger.debug('request (noMap)', this.params);
        return this.doRequest(this.params).then(promiseTap(function (response) { return _this.logger.debug('response', response); }));
    };
    /**
     * Execute with Limit: 1 to read the first item only
     */
    ReadManyRequest.prototype.execSingle = function () {
        var _this = this;
        // do not alter the params on the instance but add the additional 'Limit' param to a copy.
        // otherwise a follow-up request with the very same request-object would be wrong
        var params = tslib_1.__assign({}, this.params, { Limit: 1 });
        this.logger.debug('single request', params);
        return this.doRequest(params)
            .then(promiseTap(function (response) { return _this.logger.debug('response', response); }))
            .then(this.mapFromDb)
            .then(function (r) { return (r.Items && r.Items.length ? r.Items[0] : null); })
            .then(promiseTap(function (item) { return _this.logger.debug('mapped item', item); }));
    };
    /**
     * Execute with Select: 'Count' to count the items.
     */
    ReadManyRequest.prototype.execCount = function () {
        var _this = this;
        // do not alter the params on the instance but add the additional 'Select' param to a copy.
        // otherwise a follow-up request with the very same request-object would be wrong
        var params = tslib_1.__assign({}, this.params, { Select: 'COUNT' });
        this.logger.debug('count request', params);
        return this.doRequest(params)
            .then(promiseTap(function (response) { return _this.logger.debug('response', response); }))
            .then(function (response) { return response.Count || 0; })
            .then(promiseTap(function (count) { return _this.logger.debug('count', count); }));
    };
    /**
     * execute request and return the parsed items
     */
    ReadManyRequest.prototype.exec = function () {
        var _this = this;
        this.logger.debug('request', this.params);
        return this.doRequest(this.params)
            .then(promiseTap(function (response) { return _this.logger.debug('response', response); }))
            .then(this.mapFromDb)
            .then(function (r) { return r.Items; })
            .then(promiseTap(function (items) { return _this.logger.debug('mapped items', items); }));
    };
    /**
     * execute request and return the full response with the parsed items
     */
    ReadManyRequest.prototype.execFullResponse = function () {
        var _this = this;
        this.logger.debug('request', this.params);
        return this.doRequest(this.params)
            .then(promiseTap(function (response) { return _this.logger.debug('response', response); }))
            .then(this.mapFromDb)
            .then(promiseTap(function (response) { return _this.logger.debug('mapped items', response.Items); }));
    };
    /**
     * fetches all pages. may uses all provisionedOutput, therefore for client side use cases rather use pagedDatasource (exec)
     */
    ReadManyRequest.prototype.execFetchAll = function () {
        return fetchAll(this);
    };
    /** Infinite limit will remove the Limit param from request params when calling ReadManyRequest.limit(ReadManyRequest.INFINITE_LIMIT) */
    ReadManyRequest.INFINITE_LIMIT = -1;
    return ReadManyRequest;
}(StandardRequest));
export { ReadManyRequest };
//# sourceMappingURL=read-many.request.js.map