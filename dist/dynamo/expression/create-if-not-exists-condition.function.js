"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module expression
 */
const metadata_1 = require("../../decorator/metadata/metadata");
const public_api_1 = require("./logical-operator/public.api");
/**
 * @hidden
 */
function createIfNotExistsCondition(metadata) {
    const conditionDefFns = [
        public_api_1.attribute(metadata.getPartitionKey()).attributeNotExists(),
    ];
    if (metadata_1.hasSortKey(metadata)) {
        conditionDefFns.push(public_api_1.attribute(metadata.getSortKey()).attributeNotExists());
    }
    return conditionDefFns;
}
exports.createIfNotExistsCondition = createIfNotExistsCondition;
//# sourceMappingURL=create-if-not-exists-condition.function.js.map