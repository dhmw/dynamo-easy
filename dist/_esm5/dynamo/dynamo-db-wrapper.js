/**
 * @module dynamo-easy
 */
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import { dynamoEasyConfig } from '../config/dynamo-easy-config';
/**
 * Simply calls the sessionValidityEnsurer before each standard dynamoDB operations and returns a promise for each
 * request
 * @hidden
 */
var DynamoDbWrapper = /** @class */ (function () {
    function DynamoDbWrapper(dynamoDB) {
        // create the actual dynamoDB client
        this.dynamoDB = dynamoDB || new DynamoDB();
    }
    /*
     * make all the dynamo requests return an promise
     */
    DynamoDbWrapper.prototype.putItem = function (params) {
        var _this = this;
        return dynamoEasyConfig.sessionValidityEnsurer().then(function () { return _this.dynamoDB.putItem(params).promise(); });
    };
    DynamoDbWrapper.prototype.getItem = function (params) {
        var _this = this;
        return dynamoEasyConfig.sessionValidityEnsurer().then(function () { return _this.dynamoDB.getItem(params).promise(); });
    };
    DynamoDbWrapper.prototype.updateItem = function (params) {
        var _this = this;
        return dynamoEasyConfig.sessionValidityEnsurer().then(function () { return _this.dynamoDB.updateItem(params).promise(); });
    };
    DynamoDbWrapper.prototype.deleteItem = function (params) {
        var _this = this;
        return dynamoEasyConfig.sessionValidityEnsurer().then(function () { return _this.dynamoDB.deleteItem(params).promise(); });
    };
    DynamoDbWrapper.prototype.batchWriteItem = function (params) {
        var _this = this;
        return dynamoEasyConfig.sessionValidityEnsurer().then(function () { return _this.dynamoDB.batchWriteItem(params).promise(); });
    };
    DynamoDbWrapper.prototype.batchGetItems = function (params) {
        var _this = this;
        return dynamoEasyConfig.sessionValidityEnsurer().then(function () { return _this.dynamoDB.batchGetItem(params).promise(); });
    };
    DynamoDbWrapper.prototype.transactWriteItems = function (params) {
        var _this = this;
        return dynamoEasyConfig.sessionValidityEnsurer().then(function () { return _this.dynamoDB.transactWriteItems(params).promise(); });
    };
    DynamoDbWrapper.prototype.transactGetItems = function (params) {
        var _this = this;
        return dynamoEasyConfig.sessionValidityEnsurer().then(function () { return _this.dynamoDB.transactGetItems(params).promise(); });
    };
    DynamoDbWrapper.prototype.scan = function (params) {
        var _this = this;
        return dynamoEasyConfig.sessionValidityEnsurer().then(function () { return _this.dynamoDB.scan(params).promise(); });
    };
    DynamoDbWrapper.prototype.query = function (params) {
        var _this = this;
        if (!params.KeyConditionExpression) {
            throw new Error('key condition expression must be defined');
        }
        return dynamoEasyConfig.sessionValidityEnsurer().then(function () { return _this.dynamoDB.query(params).promise(); });
    };
    DynamoDbWrapper.prototype.makeRequest = function (operation, params) {
        var _this = this;
        return dynamoEasyConfig.sessionValidityEnsurer().then(function () { return _this.dynamoDB.makeRequest(operation, params).promise(); });
    };
    return DynamoDbWrapper;
}());
export { DynamoDbWrapper };
//# sourceMappingURL=dynamo-db-wrapper.js.map