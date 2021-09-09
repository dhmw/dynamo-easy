"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module decorators
 */
const init_or_update_property_function_1 = require("../property/init-or-update-property.function");
function Transient() {
    return (target, propertyKey) => {
        if (typeof propertyKey === 'string') {
            init_or_update_property_function_1.initOrUpdateProperty({ transient: true }, target, propertyKey);
        }
    };
}
exports.Transient = Transient;
//# sourceMappingURL=transient.decorator.js.map