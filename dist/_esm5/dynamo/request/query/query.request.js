import * as tslib_1 from "tslib";
import { createLogger } from '../../../logger/logger';
import { addSortKeyCondition } from '../../expression/request-expression-builder';
import { ReadManyRequest } from '../read-many.request';
/**
 * Request class for the Query operation.
 */
var QueryRequest = /** @class */ (function (_super) {
    tslib_1.__extends(QueryRequest, _super);
    function QueryRequest(dynamoDBWrapper, modelClazz) {
        var _this = _super.call(this, dynamoDBWrapper, modelClazz) || this;
        _this.logger = createLogger('dynamo.request.QueryRequest', modelClazz);
        return _this;
    }
    QueryRequest.prototype.wherePartitionKey = function (partitionKeyValue) {
        var partitionKey;
        if (this.secondaryIndex) {
            if (!this.secondaryIndex.partitionKey) {
                throw new Error("there is no partition key defined for index '" + this.params.IndexName + "'");
            }
            partitionKey = this.secondaryIndex.partitionKey;
        }
        else {
            partitionKey = this.metadata.getPartitionKey();
        }
        return addSortKeyCondition(partitionKey, this, this.metadata).equals(partitionKeyValue);
    };
    /**
     * used to define some condition for the sort key, use the secondary index to query based on a custom index
     */
    QueryRequest.prototype.whereSortKey = function () {
        var sortKey;
        if (this.secondaryIndex) {
            if (!this.secondaryIndex.sortKey) {
                throw new Error("there is no sort key defined for index '" + this.params.IndexName + "'");
            }
            sortKey = this.secondaryIndex.sortKey;
        }
        else {
            sortKey = this.metadata.getSortKey();
        }
        if (!sortKey) {
            throw new Error('There was no sort key defined for current schema');
        }
        return addSortKeyCondition(sortKey, this, this.metadata);
    };
    QueryRequest.prototype.ascending = function () {
        this.params.ScanIndexForward = true;
        return this;
    };
    QueryRequest.prototype.descending = function () {
        this.params.ScanIndexForward = false;
        return this;
    };
    QueryRequest.prototype.doRequest = function (params) {
        return this.dynamoDBWrapper.query(params);
    };
    return QueryRequest;
}(ReadManyRequest));
export { QueryRequest };
//# sourceMappingURL=query.request.js.map