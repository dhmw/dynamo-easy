"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../../../logger/logger");
const request_expression_builder_1 = require("../../expression/request-expression-builder");
const read_many_request_1 = require("../read-many.request");
/**
 * Request class for the Query operation.
 */
class QueryRequest extends read_many_request_1.ReadManyRequest {
    constructor(dynamoDBWrapper, modelClazz) {
        super(dynamoDBWrapper, modelClazz);
        this.logger = logger_1.createLogger('dynamo.request.QueryRequest', modelClazz);
    }
    wherePartitionKey(partitionKeyValue) {
        let partitionKey;
        if (this.secondaryIndex) {
            if (!this.secondaryIndex.partitionKey) {
                throw new Error(`there is no partition key defined for index '${this.params.IndexName}'`);
            }
            partitionKey = this.secondaryIndex.partitionKey;
        }
        else {
            partitionKey = this.metadata.getPartitionKey();
        }
        return request_expression_builder_1.addSortKeyCondition(partitionKey, this, this.metadata).equals(partitionKeyValue);
    }
    /**
     * used to define some condition for the sort key, use the secondary index to query based on a custom index
     */
    whereSortKey() {
        let sortKey;
        if (this.secondaryIndex) {
            if (!this.secondaryIndex.sortKey) {
                throw new Error(`there is no sort key defined for index '${this.params.IndexName}'`);
            }
            sortKey = this.secondaryIndex.sortKey;
        }
        else {
            sortKey = this.metadata.getSortKey();
        }
        if (!sortKey) {
            throw new Error('There was no sort key defined for current schema');
        }
        return request_expression_builder_1.addSortKeyCondition(sortKey, this, this.metadata);
    }
    ascending() {
        this.params.ScanIndexForward = true;
        return this;
    }
    descending() {
        this.params.ScanIndexForward = false;
        return this;
    }
    doRequest(params) {
        return this.dynamoDBWrapper.query(params);
    }
}
exports.QueryRequest = QueryRequest;
//# sourceMappingURL=query.request.js.map