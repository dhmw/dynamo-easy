/**
 * @module metadata
 */
import { NESTED_ATTR_PATH_CAPTURED_REGEX, NESTED_ATTR_PATH_REGEX, } from '../../dynamo/expression/functions/attribute-names.const';
import { KEY_MODEL } from '../impl/model/key-model.const';
/**
 * Checks if given metadata returns a sort key when calling metadata.getSortKey
 * @hidden
 */
export function hasSortKey(metadata) {
    return metadata.getSortKey() !== null;
}
export class Metadata {
    constructor(modelConstructor) {
        this.modelOptions = Reflect.getMetadata(KEY_MODEL, modelConstructor);
    }
    static findMetaDataForProperty(modelOpts, propertyName) {
        return modelOpts.properties.find((property) => property.name === propertyName || property.nameDb === propertyName);
    }
    forProperty(propertyKey) {
        if (this.modelOptions.properties.length === 0) {
            return;
        }
        if (typeof propertyKey === 'string' && NESTED_ATTR_PATH_REGEX.test(propertyKey)) {
            const regex = new RegExp(NESTED_ATTR_PATH_CAPTURED_REGEX);
            let re;
            let currentMeta = this.modelOptions;
            let lastPropMeta;
            let lastPathPart = '';
            // tslint:disable-next-line:no-conditional-assignment
            while ((re = regex.exec(propertyKey)) !== null) {
                lastPathPart = re[1];
                lastPropMeta = Metadata.findMetaDataForProperty(currentMeta, lastPathPart);
                if (lastPropMeta && lastPropMeta.typeInfo) {
                    currentMeta = new Metadata(lastPropMeta.typeInfo.genericType || lastPropMeta.typeInfo.type).modelOptions;
                }
                else {
                    break;
                }
            }
            if (lastPropMeta && (lastPathPart === lastPropMeta.name || lastPathPart === lastPropMeta.nameDb)) {
                return lastPropMeta;
            }
        }
        else {
            return Metadata.findMetaDataForProperty(this.modelOptions, propertyKey);
        }
        return;
    }
    /**
     *
     * @returns {Array<PropertyMetadata<any>>} Returns all the properties a defaultValueProvider, returns an empty array by default
     */
    getPropertiesWithDefaultValueProvider() {
        return filterBy(this.modelOptions, p => !!p.defaultValueProvider, []);
    }
    /**
     * @param {string} indexName
     * @returns {string} Returns the name of partition key (not the db name if it differs from property name)
     * @throws Throws an error if no partition key was defined for the current model
     * @throws Throws an error if an indexName was delivered but no index was found for given name
     */
    getPartitionKey(indexName) {
        if (indexName) {
            const index = this.getIndex(indexName);
            if (index) {
                if (index.partitionKey) {
                    return index.partitionKey;
                }
                else {
                    throw new Error('the index exists but no partition key for it was defined. use @GSIPartitionKey(indexName)');
                }
            }
            else {
                throw new Error(`there is no index defined for name ${indexName}`);
            }
        }
        else {
            const property = filterByFirst(this.modelOptions, (p) => !!(p.key && p.key.type === 'HASH'));
            if (property) {
                return property.name;
            }
            else {
                throw new Error('could not find any partition key');
            }
        }
    }
    /**
     * @param {string} indexName
     * @returns {keyof T} Returns the name of sort key (not the db name if it differs from property name) or null if none was defined
     * @throws Throws an error if an indexName was delivered but no index was found for given name or the found index has no sort key defined
     */
    getSortKey(indexName) {
        if (indexName) {
            const index = this.getIndex(indexName);
            if (index) {
                if (index.sortKey) {
                    return index.sortKey;
                }
                else {
                    throw new Error(`there is no sort key defined for index ${indexName}`);
                }
            }
            else {
                throw new Error(`there is no index defined for name ${indexName}`);
            }
        }
        else {
            const property = filterByFirst(this.modelOptions, (p) => !!(p.key && p.key.type === 'RANGE'));
            return property ? property.name : null;
        }
    }
    /**
     *
     * @returns {SecondaryIndex[]} Returns all the secondary indexes if exists or an empty array if none is defined
     */
    getIndexes() {
        return Array.from(this.modelOptions.indexes.values());
    }
    /**
     * @param {string} indexName
     * @returns {SecondaryIndex} Returns the index if one with given name exists, null otherwise
     */
    getIndex(indexName) {
        return this.modelOptions.indexes.get(indexName) || null;
    }
}
/**
 * @hidden
 */
function filterBy(modelOptions, predicate, defaultValue) {
    if (modelOptions) {
        const properties = modelOptions.properties.filter(predicate);
        if (properties.length) {
            return properties;
        }
    }
    return defaultValue;
}
/**
 * @hidden
 */
function filterByFirst(modelOptions, predicate) {
    const properties = filterBy(modelOptions, predicate, null);
    return properties && properties.length ? properties[0] : null;
}
//# sourceMappingURL=metadata.js.map