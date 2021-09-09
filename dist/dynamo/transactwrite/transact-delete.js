"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mapper_1 = require("../../mapper/mapper");
const transact_base_operation_1 = require("./transact-base-operation");
/**
 * TransactOperation class for transactional delete items
 */
class TransactDelete extends transact_base_operation_1.TransactBaseOperation {
    constructor(modelClazz, partitionKey, sortKey) {
        super(modelClazz);
        this.params.Key = mapper_1.createKeyAttributes(this.metadata, partitionKey, sortKey);
    }
    get transactItem() {
        return {
            Delete: Object.assign({}, this.params),
        };
    }
}
exports.TransactDelete = TransactDelete;
//# sourceMappingURL=transact-delete.js.map