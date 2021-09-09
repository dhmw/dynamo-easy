import * as tslib_1 from "tslib";
import { kebabCase } from '../../../helper/kebab-case.function';
import { KEY_PROPERTY } from '../property/key-property.const';
import { modelErrors } from './errors.const';
import { KEY_MODEL } from './key-model.const';
/**
 * decorator to define a model for dynamo easy
 */
export function Model(opts) {
    if (opts === void 0) { opts = {}; }
    // tslint:disable-next-line:ban-types
    return function (constructor) {
        var type = constructor;
        // get all the properties with @Property() annotation (or @PartitionKey(),...)
        // if given class has own properties, all inherited properties are already set and we can get the properties with 'getOwnMetadata'.
        // otherwise when the given class does not have own properties, there's no 'ownMetadata' but we need to get them from the class it extends with 'getMetadata'
        var properties = (Reflect.hasOwnMetadata(KEY_PROPERTY, constructor)
            ? Reflect.getOwnMetadata(KEY_PROPERTY, constructor)
            : Reflect.getMetadata(KEY_PROPERTY, constructor)) || [];
        // get partition key
        var partitionKeys = properties.filter(function (property) { return property.key && property.key.type === 'HASH'; });
        var partitionKeyName = partitionKeys.length ? partitionKeys[0].nameDb : null;
        /*
         * get the local and global secondary indexes
         */
        var globalSecondaryIndexes = getGlobalSecondaryIndexes(properties);
        var localSecondaryIndexes = getLocalSecondaryIndexes(partitionKeyName, properties);
        var indexes = new Map(tslib_1.__spread(globalSecondaryIndexes, localSecondaryIndexes));
        var transientProperties = properties.length
            ? properties.filter(function (property) { return property.transient === true; }).map(function (property) { return property.name; })
            : [];
        var metaData = tslib_1.__assign({ clazz: constructor, clazzName: type.name, tableName: kebabCase(type.name) + "s", properties: properties,
            transientProperties: transientProperties,
            indexes: indexes }, opts);
        // console.log(`Decorating: ${metaData.clazzName}`, metaData);
        Reflect.defineMetadata(KEY_MODEL, metaData, constructor);
    };
}
/**
 * @hidden
 */
function testForGSI(property) {
    return !!(property.keyForGSI && Object.keys(property.keyForGSI).length);
}
/**
 * @hidden
 */
function testForLSI(property) {
    return !!(property.sortKeyForLSI && property.sortKeyForLSI.length);
}
/**
 * @hidden
 */
function getGlobalSecondaryIndexes(properties) {
    return properties.filter(testForGSI).reduce(function (map, property) {
        var gsi;
        Object.keys(property.keyForGSI).forEach(function (indexName) {
            if (map.has(indexName)) {
                gsi = map.get(indexName);
            }
            else {
                gsi = {};
            }
            switch (property.keyForGSI[indexName]) {
                case 'HASH':
                    if (gsi.partitionKey) {
                        throw new Error(modelErrors.gsiMultiplePk(indexName, property.nameDb));
                    }
                    gsi.partitionKey = property.nameDb;
                    break;
                case 'RANGE':
                    if (gsi.sortKey) {
                        throw new Error(modelErrors.gsiMultipleSk(indexName, property.nameDb));
                    }
                    gsi.sortKey = property.nameDb;
                    break;
            }
            map.set(indexName, gsi);
        });
        return map;
    }, new Map());
}
/**
 * @hidden
 */
function getLocalSecondaryIndexes(basePartitionKey, properties) {
    return properties.filter(testForLSI).reduce(function (map, property) {
        var lsi;
        property.sortKeyForLSI.forEach(function (indexName) {
            if (map.has(indexName)) {
                throw new Error(modelErrors.lsiMultipleSk(indexName, property.nameDb));
            }
            if (!basePartitionKey) {
                throw new Error(modelErrors.lsiRequiresPk(indexName, property.nameDb));
            }
            lsi = {
                partitionKey: basePartitionKey,
                sortKey: property.nameDb,
            };
            map.set(indexName, lsi);
        });
        return map;
    }, new Map());
}
//# sourceMappingURL=model.decorator.js.map