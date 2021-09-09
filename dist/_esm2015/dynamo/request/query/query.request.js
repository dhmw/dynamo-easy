import { createLogger } from '../../../logger/logger';
import { addSortKeyCondition } from '../../expression/request-expression-builder';
import { ReadManyRequest } from '../read-many.request';
/**
 * Request class for the Query operation.
 */
export class QueryRequest extends ReadManyRequest {
    constructor(dynamoDBWrapper, modelClazz) {
        super(dynamoDBWrapper, modelClazz);
        this.logger = createLogger('dynamo.request.QueryRequest', modelClazz);
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
        return addSortKeyCondition(partitionKey, this, this.metadata).equals(partitionKeyValue);
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
        return addSortKeyCondition(sortKey, this, this.metadata);
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
//# sourceMappingURL=query.request.js.map