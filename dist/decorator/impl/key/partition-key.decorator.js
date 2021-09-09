"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module decorators
 */
const logger_1 = require("../../../logger/logger");
const init_or_update_property_function_1 = require("../property/init-or-update-property.function");
const key_property_const_1 = require("../property/key-property.const");
const logger = logger_1.createOptModelLogger('@PartitionKey');
function PartitionKey() {
    return (target, propertyKey) => {
        if (typeof propertyKey === 'string') {
            // check for existing properties marked as partition key
            const properties = Reflect.getMetadata(key_property_const_1.KEY_PROPERTY, target.constructor) || [];
            if (properties && properties.length) {
                const existingPartitionKeys = properties.filter((property) => property.key && property.key.type === 'HASH');
                if (existingPartitionKeys.length) {
                    if (properties.find((property) => property.name === propertyKey)) {
                        // just ignore this and go on, somehow the partition key gets defined two times
                        logger.warn(`this is the second execution to define the partitionKey for property ${propertyKey}`, target.constructor);
                    }
                    else {
                        throw new Error('only one partition key is allowed per model, if you want to define key for indexes use one of these decorators: ' +
                            '@GSIPartitionKey,  @GSISortKey or @LSISortKey');
                    }
                }
            }
            init_or_update_property_function_1.initOrUpdateProperty({ key: { type: 'HASH' } }, target, propertyKey);
        }
    };
}
exports.PartitionKey = PartitionKey;
//# sourceMappingURL=partition-key.decorator.js.map