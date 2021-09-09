"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mapper_1 = require("../../mapper/mapper");
const prepare_and_add_update_expressions_function_1 = require("../expression/prepare-and-add-update-expressions.function");
const request_expression_builder_1 = require("../expression/request-expression-builder");
const transact_base_operation_1 = require("./transact-base-operation");
/**
 * TransactOperation class for transactional update items.
 */
class TransactUpdate extends transact_base_operation_1.TransactBaseOperation {
    constructor(modelClazz, partitionKey, sortKey) {
        super(modelClazz);
        this.params.Key = mapper_1.createKeyAttributes(this.metadata, partitionKey, sortKey);
    }
    /**
     * create and add a single update operation
     * @example updtTrans.updateAttribute('path.to.attr').set('newVal')
     */
    updateAttribute(attributePath) {
        return request_expression_builder_1.addUpdate(attributePath, this, this.metadata);
    }
    /**
     * add multiple update ops
     * @example updtTrans.operations(update('path.to.attr).set('newVal'), ... )
     */
    operations(...updateDefFns) {
        prepare_and_add_update_expressions_function_1.prepareAndAddUpdateExpressions(this.metadata, this.params, updateDefFns);
        return this;
    }
    get transactItem() {
        return {
            Update: Object.assign({}, this.params),
        };
    }
}
exports.TransactUpdate = TransactUpdate;
//# sourceMappingURL=transact-update.js.map