"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module decorators
 */
const index_type_enum_1 = require("./index-type.enum");
const util_1 = require("./util");
/**
 * decorator to use property as GSI partition key
 */
function GSIPartitionKey(indexName) {
    return (target, propertyKey) => {
        if (typeof propertyKey === 'string') {
            util_1.initOrUpdateIndex(index_type_enum_1.IndexType.GSI, { name: indexName, keyType: 'HASH' }, target, propertyKey);
        }
    };
}
exports.GSIPartitionKey = GSIPartitionKey;
//# sourceMappingURL=gsi-partition-key.decorator.js.map