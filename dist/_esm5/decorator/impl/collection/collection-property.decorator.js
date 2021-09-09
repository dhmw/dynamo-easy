import { wrapMapperForDynamoListJsArray, wrapMapperForDynamoListJsSet, wrapMapperForDynamoSetJsArray, wrapMapperForDynamoSetJsSet, } from '../../../mapper/wrap-mapper-for-collection.function';
import { getMetadataType } from '../../util';
import { initOrUpdateProperty } from '../property/init-or-update-property.function';
export function CollectionProperty(opts) {
    if (opts === void 0) { opts = {}; }
    return function (target, propertyKey) {
        if (typeof propertyKey === 'string') {
            var type = getMetadataType(target, propertyKey);
            if (type === undefined) {
                throw new Error('make sure you have enabled the typescript compiler options which enable us to work with decorators (see doc)');
            }
            if (type !== Set && type !== Array) {
                throw new Error("[" + target.constructor.name + "::" + propertyKey + "] The CollectionProperty decorator is meant for properties of type Set or Array");
            }
            var meta = {
                name: propertyKey,
                nameDb: (opts && opts.name) || propertyKey,
                typeInfo: { type: type },
                isSortedCollection: !!opts.sorted,
            };
            var hasItemType = 'itemType' in opts && !!opts.itemType;
            var hasItemMapper = 'itemMapper' in opts && !!opts.itemMapper;
            if (hasItemMapper && hasItemType) {
                throw new Error("[" + target.constructor.name + "::" + propertyKey + "] provide either itemType or itemMapper, not both");
            }
            if (hasItemType) {
                meta.typeInfo.genericType = opts.itemType;
            }
            if (hasItemMapper) {
                var itemMapper_1 = opts.itemMapper;
                var wrappedMapper_1 = type === Array
                    ? !!opts.sorted
                        ? wrapMapperForDynamoListJsArray(itemMapper_1)
                        : wrapMapperForDynamoSetJsArray(itemMapper_1)
                    : !!opts.sorted
                        ? wrapMapperForDynamoListJsSet(itemMapper_1)
                        : wrapMapperForDynamoSetJsSet(itemMapper_1);
                meta.mapper = function () { return wrappedMapper_1; };
                meta.mapperForSingleItem = function () { return itemMapper_1; };
            }
            initOrUpdateProperty(meta, target, propertyKey);
        }
    };
}
//# sourceMappingURL=collection-property.decorator.js.map