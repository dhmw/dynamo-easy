"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kebab_case_function_1 = require("../../../helper/kebab-case.function");
const key_property_const_1 = require("../property/key-property.const");
const errors_const_1 = require("./errors.const");
const key_model_const_1 = require("./key-model.const");
/**
 * decorator to define a model for dynamo easy
 */
function Model(opts = {}) {
    // tslint:disable-next-line:ban-types
    return (constructor) => {
        const type = constructor;
        // get all the properties with @Property() annotation (or @PartitionKey(),...)
        // if given class has own properties, all inherited properties are already set and we can get the properties with 'getOwnMetadata'.
        // otherwise when the given class does not have own properties, there's no 'ownMetadata' but we need to get them from the class it extends with 'getMetadata'
        const properties = (Reflect.hasOwnMetadata(key_property_const_1.KEY_PROPERTY, constructor)
            ? Reflect.getOwnMetadata(key_property_const_1.KEY_PROPERTY, constructor)
            : Reflect.getMetadata(key_property_const_1.KEY_PROPERTY, constructor)) || [];
        // get partition key
        const partitionKeys = properties.filter((property) => property.key && property.key.type === 'HASH');
        const partitionKeyName = partitionKeys.length ? partitionKeys[0].nameDb : null;
        /*
         * get the local and global secondary indexes
         */
        const globalSecondaryIndexes = getGlobalSecondaryIndexes(properties);
        const localSecondaryIndexes = getLocalSecondaryIndexes(partitionKeyName, properties);
        const indexes = new Map([...globalSecondaryIndexes, ...localSecondaryIndexes]);
        const transientProperties = properties.length
            ? properties.filter((property) => property.transient === true).map((property) => property.name)
            : [];
        const metaData = Object.assign({ clazz: constructor, clazzName: type.name, tableName: `${kebab_case_function_1.kebabCase(type.name)}s`, properties,
            transientProperties,
            indexes }, opts);
        // console.log(`Decorating: ${metaData.clazzName}`, metaData);
        Reflect.defineMetadata(key_model_const_1.KEY_MODEL, metaData, constructor);
    };
}
exports.Model = Model;
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
    return properties.filter(testForGSI).reduce((map, property) => {
        let gsi;
        Object.keys(property.keyForGSI).forEach((indexName) => {
            if (map.has(indexName)) {
                gsi = map.get(indexName);
            }
            else {
                gsi = {};
            }
            switch (property.keyForGSI[indexName]) {
                case 'HASH':
                    if (gsi.partitionKey) {
                        throw new Error(errors_const_1.modelErrors.gsiMultiplePk(indexName, property.nameDb));
                    }
                    gsi.partitionKey = property.nameDb;
                    break;
                case 'RANGE':
                    if (gsi.sortKey) {
                        throw new Error(errors_const_1.modelErrors.gsiMultipleSk(indexName, property.nameDb));
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
    return properties.filter(testForLSI).reduce((map, property) => {
        let lsi;
        property.sortKeyForLSI.forEach((indexName) => {
            if (map.has(indexName)) {
                throw new Error(errors_const_1.modelErrors.lsiMultipleSk(indexName, property.nameDb));
            }
            if (!basePartitionKey) {
                throw new Error(errors_const_1.modelErrors.lsiRequiresPk(indexName, property.nameDb));
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