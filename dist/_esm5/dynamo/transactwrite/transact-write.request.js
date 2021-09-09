import * as tslib_1 from "tslib";
import { DynamoDbWrapper } from '../dynamo-db-wrapper';
/**
 * Request class for the TransactWriteItems operation. Write up to 25 items to one or many tables in a transaction.
 */
var TransactWriteRequest = /** @class */ (function () {
    function TransactWriteRequest(dynamoDB) {
        this.dynamoDBWrapper = new DynamoDbWrapper(dynamoDB);
        this.params = {
            TransactItems: [],
        };
    }
    Object.defineProperty(TransactWriteRequest.prototype, "dynamoDB", {
        get: function () {
            return this.dynamoDBWrapper.dynamoDB;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * return ConsumedCapacity of the corresponding table(s) in the response
     */
    TransactWriteRequest.prototype.returnConsumedCapacity = function (level) {
        this.params.ReturnConsumedCapacity = level;
        return this;
    };
    /**
     * return item collection metrics.
     */
    TransactWriteRequest.prototype.returnItemCollectionMetrics = function (returnItemCollectionMetrics) {
        this.params.ReturnItemCollectionMetrics = returnItemCollectionMetrics;
        return this;
    };
    /**
     * add up to 25 transaction operations
     * create the operations with:
     * {@link TransactConditionCheck}, {@link TransactDelete}, {@link TransactPut}, {@link TransactUpdate}
     */
    TransactWriteRequest.prototype.transact = function () {
        var _a;
        var writeOperations = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            writeOperations[_i] = arguments[_i];
        }
        if (!writeOperations || writeOperations.length === 0) {
            throw new Error('at least one transaction operation must be added');
        }
        if (this.params.TransactItems.length + writeOperations.length > 25) {
            throw new Error("Each transaction can include up to 25 unique items, including conditions.       Given operations count: " + (this.params.TransactItems.length + writeOperations.length));
        }
        (_a = this.params.TransactItems).push.apply(_a, tslib_1.__spread(writeOperations.map(function (wo) { return wo.transactItem; })));
        return this;
    };
    /**
     * execute the request and return the full reponse.
     */
    TransactWriteRequest.prototype.execFullResponse = function () {
        return this.dynamoDBWrapper.transactWriteItems(this.params);
    };
    /**
     * execute the request.
     */
    TransactWriteRequest.prototype.exec = function () {
        return this.dynamoDBWrapper.transactWriteItems(this.params).then(function (response) {
            return;
        });
    };
    return TransactWriteRequest;
}());
export { TransactWriteRequest };
//# sourceMappingURL=transact-write.request.js.map