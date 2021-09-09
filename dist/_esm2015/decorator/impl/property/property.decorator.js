import { initOrUpdateProperty } from './init-or-update-property.function';
export function Property(opts = {}) {
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
            initOrUpdateProperty(propertyOptions, target, propertyKey);
        }
    };
}
//# sourceMappingURL=property.decorator.js.map