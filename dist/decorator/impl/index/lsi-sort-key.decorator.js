"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module decorators
 */
const index_type_enum_1 = require("./index-type.enum");
const util_1 = require("./util");
/**
 * Marks a property as the sort key attribute of a local secondary index (the partition key must be same as in base table)
 */
function LSISortKey(indexName) {
    return (target, propertyKey) => {
        if (typeof propertyKey === 'string') {
            util_1.initOrUpdateIndex(index_type_enum_1.IndexType.LSI, { name: indexName, keyType: 'RANGE' }, target, propertyKey);
        }
    };
}
exports.LSISortKey = LSISortKey;
//# sourceMappingURL=lsi-sort-key.decorator.js.map