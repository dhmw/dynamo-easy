/**
 * @module decorators
 */
import { dynamoEasyConfig } from '../../../config/dynamo-easy-config';
import { initOrUpdateProperty } from '../property/init-or-update-property.function';
export function DateProperty(opts = {}) {
    return (target, propertyKey) => {
        if (typeof propertyKey === 'string') {
            const propertyOptions = {
                name: propertyKey,
                nameDb: opts.name || propertyKey,
                mapper: () => dynamoEasyConfig.dateMapper,
            };
            initOrUpdateProperty(propertyOptions, target, propertyKey);
        }
    };
}
//# sourceMappingURL=date-property.decorator.js.map