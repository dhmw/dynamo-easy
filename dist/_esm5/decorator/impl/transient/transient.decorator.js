/**
 * @module decorators
 */
import { initOrUpdateProperty } from '../property/init-or-update-property.function';
export function Transient() {
    return function (target, propertyKey) {
        if (typeof propertyKey === 'string') {
            initOrUpdateProperty({ transient: true }, target, propertyKey);
        }
    };
}
//# sourceMappingURL=transient.decorator.js.map