"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module dynamo-easy
 */
const DynamoDB = require("aws-sdk/clients/dynamodb");
const dynamo_easy_config_1 = require("../config/dynamo-easy-config");
/**
 * Simply calls the sessionValidityEnsurer before each standard dynamoDB operations and returns a promise for each
 * request
 * @hidden
 */
class DynamoDbWrapper {
    constructor(dynamoDB) {
        // create the actual dynamoDB client
        this.dynamoDB = dynamoDB || new DynamoDB();
    }
    /*
     * make all the dynamo requests return an promise
     */
    putItem(params) {
        return dynamo_easy_config_1.dynamoEasyConfig.sessionValidityEnsurer().then(() => this.dynamoDB.putItem(params).promise());
    }
    getItem(params) {
        return dynamo_easy_config_1.dynamoEasyConfig.sessionValidityEnsurer().then(() => this.dynamoDB.getItem(params).promise());
    }
    updateItem(params) {
        return dynamo_easy_config_1.dynamoEasyConfig.sessionValidityEnsurer().then(() => this.dynamoDB.updateItem(params).promise());
    }
    deleteItem(params) {
        return dynamo_easy_config_1.dynamoEasyConfig.sessionValidityEnsurer().then(() => this.dynamoDB.deleteItem(params).promise());
    }
    batchWriteItem(params) {
        return dynamo_easy_config_1.dynamoEasyConfig.sessionValidityEnsurer().then(() => this.dynamoDB.batchWriteItem(params).promise());
    }
    batchGetItems(params) {
        return dynamo_easy_config_1.dynamoEasyConfig.sessionValidityEnsurer().then(() => this.dynamoDB.batchGetItem(params).promise());
    }
    transactWriteItems(params) {
        return dynamo_easy_config_1.dynamoEasyConfig.sessionValidityEnsurer().then(() => this.dynamoDB.transactWriteItems(params).promise());
    }
    transactGetItems(params) {
        return dynamo_easy_config_1.dynamoEasyConfig.sessionValidityEnsurer().then(() => this.dynamoDB.transactGetItems(params).promise());
    }
    scan(params) {
        return dynamo_easy_config_1.dynamoEasyConfig.sessionValidityEnsurer().then(() => this.dynamoDB.scan(params).promise());
    }
    query(params) {
        if (!params.KeyConditionExpression) {
            throw new Error('key condition expression must be defined');
        }
        return dynamo_easy_config_1.dynamoEasyConfig.sessionValidityEnsurer().then(() => this.dynamoDB.query(params).promise());
    }
    makeRequest(operation, params) {
        return dynamo_easy_config_1.dynamoEasyConfig.sessionValidityEnsurer().then(() => this.dynamoDB.makeRequest(operation, params).promise());
    }
}
exports.DynamoDbWrapper = DynamoDbWrapper;
//# sourceMappingURL=dynamo-db-wrapper.js.map