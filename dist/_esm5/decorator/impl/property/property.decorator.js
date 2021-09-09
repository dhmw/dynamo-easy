import { initOrUpdateProperty } from './init-or-update-property.function';
export function Property(opts) {
    if (opts === void 0) { opts = {}; }
    return function (target, propertyKey) {
        if (typeof propertyKey === 'string') {
            var propertyOptions = {
                name: propertyKey,
                nameDb: opts.name || propertyKey,
                defaultValueProvider: opts.defaultValueProvider,
            };
            if ('mapper' in opts && !!opts.mapper) {
                var m_1 = opts.mapper;
                propertyOptions.mapper = function () { return m_1; };
            }
            initOrUpdateProperty(propertyOptions, target, propertyKey);
        }
    };
}
//# sourceMappingURL=property.decorator.js.map