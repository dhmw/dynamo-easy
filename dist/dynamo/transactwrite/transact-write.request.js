"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dynamo_db_wrapper_1 = require("../dynamo-db-wrapper");
/**
 * Request class for the TransactWriteItems operation. Write up to 25 items to one or many tables in a transaction.
 */
class TransactWriteRequest {
    get dynamoDB() {
        return this.dynamoDBWrapper.dynamoDB;
    }
    constructor(dynamoDB) {
        this.dynamoDBWrapper = new dynamo_db_wrapper_1.DynamoDbWrapper(dynamoDB);
        this.params = {
            TransactItems: [],
        };
    }
    /**
     * return ConsumedCapacity of the corresponding table(s) in the response
     */
    returnConsumedCapacity(level) {
        this.params.ReturnConsumedCapacity = level;
        return this;
    }
    /**
     * return item collection metrics.
     */
    returnItemCollectionMetrics(returnItemCollectionMetrics) {
        this.params.ReturnItemCollectionMetrics = returnItemCollectionMetrics;
        return this;
    }
    /**
     * add up to 25 transaction operations
     * create the operations with:
     * {@link TransactConditionCheck}, {@link TransactDelete}, {@link TransactPut}, {@link TransactUpdate}
     */
    transact(...writeOperations) {
        if (!writeOperations || writeOperations.length === 0) {
            throw new Error('at least one transaction operation must be added');
        }
        if (this.params.TransactItems.length + writeOperations.length > 25) {
            throw new Error(`Each transaction can include up to 25 unique items, including conditions.\
       Given operations count: ${this.params.TransactItems.length + writeOperations.length}`);
        }
        this.params.TransactItems.push(...writeOperations.map((wo) => wo.transactItem));
        return this;
    }
    /**
     * execute the request and return the full reponse.
     */
    execFullResponse() {
        return this.dynamoDBWrapper.transactWriteItems(this.params);
    }
    /**
     * execute the request.
     */
    exec() {
        return this.dynamoDBWrapper.transactWriteItems(this.params).then((response) => {
            return;
        });
    }
}
exports.TransactWriteRequest = TransactWriteRequest;
//# sourceMappingURL=transact-write.request.js.map