"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mapper_1 = require("../../mapper/mapper");
const create_if_not_exists_condition_function_1 = require("../expression/create-if-not-exists-condition.function");
const transact_base_operation_1 = require("./transact-base-operation");
/**
 * TransactOperation class for transactional put items.
 */
class TransactPut extends transact_base_operation_1.TransactBaseOperation {
    constructor(modelClazz, item) {
        super(modelClazz);
        this.params.Item = mapper_1.toDb(item, this.modelClazz);
    }
    /**
     * Adds a condition expression to the request, which makes sure the item will only be saved if the id does not exist
     */
    ifNotExists(predicate = true) {
        if (predicate) {
            this.onlyIf(...create_if_not_exists_condition_function_1.createIfNotExistsCondition(this.metadata));
        }
        return this;
    }
    get transactItem() {
        return {
            Put: Object.assign({}, this.params),
        };
    }
}
exports.TransactPut = TransactPut;
//# sourceMappingURL=transact-put.js.map