"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module decorators
 */
const init_or_update_property_function_1 = require("../property/init-or-update-property.function");
function SortKey() {
    return (target, propertyKey) => {
        if (typeof propertyKey === 'string') {
            init_or_update_property_function_1.initOrUpdateProperty({ key: { type: 'RANGE' } }, target, propertyKey);
        }
    };
}
exports.SortKey = SortKey;
//# sourceMappingURL=sort-key.decorator.js.map