"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const init_or_update_property_function_1 = require("./init-or-update-property.function");
function Property(opts = {}) {
    return (target, propertyKey) => {
        if (typeof propertyKey === 'string') {
            const propertyOptions = {
                name: propertyKey,
                nameDb: opts.name || propertyKey,
                defaultValueProvider: opts.defaultValueProvider,
            };
            if ('mapper' in opts && !!opts.mapper) {
                const m = opts.mapper;
                propertyOptions.mapper = () => m;
            }
            init_or_update_property_function_1.initOrUpdateProperty(propertyOptions, target, propertyKey);
        }
    };
}
exports.Property = Property;
//# sourceMappingURL=property.decorator.js.map