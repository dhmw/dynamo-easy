"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module decorators
 */
const dynamo_easy_config_1 = require("../../../config/dynamo-easy-config");
const init_or_update_property_function_1 = require("../property/init-or-update-property.function");
function DateProperty(opts = {}) {
    return (target, propertyKey) => {
        if (typeof propertyKey === 'string') {
            const propertyOptions = {
                name: propertyKey,
                nameDb: opts.name || propertyKey,
                mapper: () => dynamo_easy_config_1.dynamoEasyConfig.dateMapper,
            };
            init_or_update_property_function_1.initOrUpdateProperty(propertyOptions, target, propertyKey);
        }
    };
}
exports.DateProperty = DateProperty;
//# sourceMappingURL=date-property.decorator.js.map