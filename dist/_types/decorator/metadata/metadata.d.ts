import { ModelConstructor } from '../../model/model-constructor';
import { Omit } from '../../model/omit.type';
import { SecondaryIndex } from '../impl/index/secondary-index';
import { ModelMetadata } from './model-metadata.model';
import { PropertyMetadata } from './property-metadata.model';
/**
 * @hidden
 */
export declare type MetadataWithSortKey<T> = Omit<Metadata<T>, 'getSortKey'> & {
    getSortKey: (indexName?: string) => keyof T;
};
/**
 * Checks if given metadata returns a sort key when calling metadata.getSortKey
 * @hidden
 */
export declare function hasSortKey<T>(metadata: Metadata<T>): metadata is MetadataWithSortKey<T>;
export declare class Metadata<T> {
    readonly modelOptions: ModelMetadata<T>;
    private static findMetaDataForProperty;
    constructor(modelConstructor: ModelConstructor<T>);
    forProperty(propertyKey: keyof T | string): PropertyMetadata<T> | undefined;
    /**
     *
     * @returns {Array<PropertyMetadata<any>>} Returns all the properties a defaultValueProvider, returns an empty array by default
     */
    getPropertiesWithDefaultValueProvider(): Array<PropertyMetadata<any>>;
    /**
     * @param {string} indexName
     * @returns {string} Returns the name of partition key (not the db name if it differs from property name)
     * @throws Throws an error if no partition key was defined for the current model
     * @throws Throws an error if an indexName was delivered but no index was found for given name
     */
    getPartitionKey(indexName?: string): keyof T;
    /**
     * @param {string} indexName
     * @returns {keyof T} Returns the name of sort key (not the db name if it differs from property name) or null if none was defined
     * @throws Throws an error if an indexName was delivered but no index was found for given name or the found index has no sort key defined
     */
    getSortKey(indexName?: string): keyof T | null;
    /**
     *
     * @returns {SecondaryIndex[]} Returns all the secondary indexes if exists or an empty array if none is defined
     */
    getIndexes(): Array<SecondaryIndex<T>>;
    /**
     * @param {string} indexName
     * @returns {SecondaryIndex} Returns the index if one with given name exists, null otherwise
     */
    getIndex(indexName: string): SecondaryIndex<T> | null;
}
