/**
 * @module decorators
 */
import { createOptModelLogger } from '../../../logger/logger';
import { initOrUpdateProperty } from '../property/init-or-update-property.function';
import { KEY_PROPERTY } from '../property/key-property.const';
var logger = createOptModelLogger('@PartitionKey');
export function PartitionKey() {
    return function (target, propertyKey) {
        if (typeof propertyKey === 'string') {
            // check for existing properties marked as partition key
            var properties = Reflect.getMetadata(KEY_PROPERTY, target.constructor) || [];
            if (properties && properties.length) {
                var existingPartitionKeys = properties.filter(function (property) { return property.key && property.key.type === 'HASH'; });
                if (existingPartitionKeys.length) {
                    if (properties.find(function (property) { return property.name === propertyKey; })) {
                        // just ignore this and go on, somehow the partition key gets defined two times
                        logger.warn("this is the second execution to define the partitionKey for property " + propertyKey, target.constructor);
                    }
                    else {
                        throw new Error('only one partition key is allowed per model, if you want to define key for indexes use one of these decorators: ' +
                            '@GSIPartitionKey,  @GSISortKey or @LSISortKey');
                    }
                }
            }
            initOrUpdateProperty({ key: { type: 'HASH' } }, target, propertyKey);
        }
    };
}
//# sourceMappingURL=partition-key.decorator.js.map