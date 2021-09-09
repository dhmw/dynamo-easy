"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wrap_mapper_for_collection_function_1 = require("../../../mapper/wrap-mapper-for-collection.function");
const util_1 = require("../../util");
const init_or_update_property_function_1 = require("../property/init-or-update-property.function");
function CollectionProperty(opts = {}) {
    return (target, propertyKey) => {
        if (typeof propertyKey === 'string') {
            const type = util_1.getMetadataType(target, propertyKey);
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
                        ? wrap_mapper_for_collection_function_1.wrapMapperForDynamoListJsArray(itemMapper)
                        : wrap_mapper_for_collection_function_1.wrapMapperForDynamoSetJsArray(itemMapper)
                    : !!opts.sorted
                        ? wrap_mapper_for_collection_function_1.wrapMapperForDynamoListJsSet(itemMapper)
                        : wrap_mapper_for_collection_function_1.wrapMapperForDynamoSetJsSet(itemMapper);
                meta.mapper = () => wrappedMapper;
                meta.mapperForSingleItem = () => itemMapper;
            }
            init_or_update_property_function_1.initOrUpdateProperty(meta, target, propertyKey);
        }
    };
}
exports.CollectionProperty = CollectionProperty;
//# sourceMappingURL=collection-property.decorator.js.map