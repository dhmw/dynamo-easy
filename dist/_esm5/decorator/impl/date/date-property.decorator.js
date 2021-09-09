/**
 * @module decorators
 */
import { dynamoEasyConfig } from '../../../config/dynamo-easy-config';
import { initOrUpdateProperty } from '../property/init-or-update-property.function';
export function DateProperty(opts) {
    if (opts === void 0) { opts = {}; }
    return function (target, propertyKey) {
        if (typeof propertyKey === 'string') {
            var propertyOptions = {
                name: propertyKey,
                nameDb: opts.name || propertyKey,
                mapper: function () { return dynamoEasyConfig.dateMapper; },
            };
            initOrUpdateProperty(propertyOptions, target, propertyKey);
        }
    };
}
//# sourceMappingURL=date-property.decorator.js.map