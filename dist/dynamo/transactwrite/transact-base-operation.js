"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metadata_for_model_function_1 = require("../../decorator/metadata/metadata-for-model.function");
const and_function_1 = require("../expression/logical-operator/and.function");
const param_util_1 = require("../expression/param-util");
const request_expression_builder_1 = require("../expression/request-expression-builder");
const get_table_name_function_1 = require("../get-table-name.function");
/**
 * Abstract base class for all transact items.
 */
class TransactBaseOperation {
    constructor(modelClazz) {
        if (!modelClazz) {
            throw new Error(`please provide the model class`);
        }
        this.modelClazz = modelClazz;
        this.metadata = metadata_for_model_function_1.metadataForModel(this.modelClazz);
        if (!this.metadata.modelOptions) {
            throw new Error('the given model class has no model decorator');
        }
        this.params = {
            TableName: get_table_name_function_1.getTableName(this.metadata),
        };
    }
    onlyIfAttribute(attributePath) {
        return request_expression_builder_1.addCondition('ConditionExpression', attributePath, this, this.metadata);
    }
    /**
     * add a condition necessary for the transaction to succeed
     * @example req.onlyIf(or(attribute('age').lt(10), attribute('age').gt(20)))
     */
    onlyIf(...conditionDefFns) {
        const condition = and_function_1.and(...conditionDefFns)(undefined, this.metadata);
        param_util_1.addExpression('ConditionExpression', condition, this.params);
        return this;
    }
    /**
     * get the item attributes if the condition fails
     */
    returnValuesOnConditionCheckFailure(value) {
        this.params.ReturnValuesOnConditionCheckFailure = value;
        return this;
    }
}
exports.TransactBaseOperation = TransactBaseOperation;
//# sourceMappingURL=transact-base-operation.js.map