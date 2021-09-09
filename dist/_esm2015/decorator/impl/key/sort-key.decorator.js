/**
 * @module decorators
 */
import { initOrUpdateProperty } from '../property/init-or-update-property.function';
export function SortKey() {
    return (target, propertyKey) => {
        if (typeof propertyKey === 'string') {
            initOrUpdateProperty({ key: { type: 'RANGE' } }, target, propertyKey);
        }
    };
}
//# sourceMappingURL=sort-key.decorator.js.map