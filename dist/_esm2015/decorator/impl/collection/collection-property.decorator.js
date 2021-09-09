import { wrapMapperForDynamoListJsArray, wrapMapperForDynamoListJsSet, wrapMapperForDynamoSetJsArray, wrapMapperForDynamoSetJsSet, } from '../../../mapper/wrap-mapper-for-collection.function';
import { getMetadataType } from '../../util';
import { initOrUpdateProperty } from '../property/init-or-update-property.function';
export function CollectionProperty(opts = {}) {
    return (target, propertyKey) => {
        if (typeof propertyKey === 'string') {
            const type = getMetadataType(target, propertyKey);
            if (type === undefined) {
                throw new Error('make sure you have enabled the typescript compiler options which enable us to work with decorators (see doc)');
            }
            if (type !== Set && type !== Array) {
                throw new Error(`[${target.constructor.name}::${propertyKey}] The CollectionProperty decorator is meant for properties of type Set or Array`);
            }
            const meta = {
                name: propertyKey,
                nameDb: (opts && opts.name) || propertyKey,
                typeInfo: { type },
                isSortedCollection: !!opts.sorted,
            };
            const hasItemType = 'itemType' in opts && !!opts.itemType;
            const hasItemMapper = 'itemMapper' in opts && !!opts.itemMapper;
            if (hasItemMapper && hasItemType) {
                throw new Error(`[${target.constructor.name}::${propertyKey}] provide either itemType or itemMapper, not both`);
            }
            if (hasItemType) {
                meta.typeInfo.genericType = opts.itemType;
            }
            if (hasItemMapper) {
                const itemMapper = opts.itemMapper;
                const wrappedMapper = type === Array
                    ? !!opts.sorted
                        ? wrapMapperForDynamoListJsArray(itemMapper)
                        : wrapMapperForDynamoSetJsArray(itemMapper)
                    : !!opts.sorted
                        ? wrapMapperForDynamoListJsSet(itemMapper)
                        : wrapMapperForDynamoSetJsSet(itemMapper);
                meta.mapper = () => wrappedMapper;
                meta.mapperForSingleItem = () => itemMapper;
            }
            initOrUpdateProperty(meta, target, propertyKey);
        }
    };
}
//# sourceMappingURL=collection-property.decorator.js.map