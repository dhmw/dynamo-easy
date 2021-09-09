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
export class DynamoDbWrapper {
    constructor(dynamoDB) {
        // create the actual dynamoDB client
        this.dynamoDB = dynamoDB || new DynamoDB();
    }
    /*
     * make all the dynamo requests return an promise
     */
    putItem(params) {
        return dynamoEasyConfig.sessionValidityEnsurer().then(() => this.dynamoDB.putItem(params).promise());
    }
    getItem(params) {
        return dynamoEasyConfig.sessionValidityEnsurer().then(() => this.dynamoDB.getItem(params).promise());
    }
    updateItem(params) {
        return dynamoEasyConfig.sessionValidityEnsurer().then(() => this.dynamoDB.updateItem(params).promise());
    }
    deleteItem(params) {
        return dynamoEasyConfig.sessionValidityEnsurer().then(() => this.dynamoDB.deleteItem(params).promise());
    }
    batchWriteItem(params) {
        return dynamoEasyConfig.sessionValidityEnsurer().then(() => this.dynamoDB.batchWriteItem(params).promise());
    }
    batchGetItems(params) {
        return dynamoEasyConfig.sessionValidityEnsurer().then(() => this.dynamoDB.batchGetItem(params).promise());
    }
    transactWriteItems(params) {
        return dynamoEasyConfig.sessionValidityEnsurer().then(() => this.dynamoDB.transactWriteItems(params).promise());
    }
    transactGetItems(params) {
        return dynamoEasyConfig.sessionValidityEnsurer().then(() => this.dynamoDB.transactGetItems(params).promise());
    }
    scan(params) {
        return dynamoEasyConfig.sessionValidityEnsurer().then(() => this.dynamoDB.scan(params).promise());
    }
    query(params) {
        if (!params.KeyConditionExpression) {
            throw new Error('key condition expression must be defined');
        }
        return dynamoEasyConfig.sessionValidityEnsurer().then(() => this.dynamoDB.query(params).promise());
    }
    makeRequest(operation, params) {
        return dynamoEasyConfig.sessionValidityEnsurer().then(() => this.dynamoDB.makeRequest(operation, params).promise());
    }
}
//# sourceMappingURL=dynamo-db-wrapper.js.map