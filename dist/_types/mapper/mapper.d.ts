/**
 * @module mapper
 */
import { Metadata } from '../decorator/metadata/metadata';
import { PropertyMetadata } from '../decorator/metadata/property-metadata.model';
import { ModelConstructor } from '../model/model-constructor';
import { MapperForType } from './for-type/base.mapper';
import { AttributeValueType } from './type/attribute-value-type.type';
import { Attribute, Attributes } from './type/attribute.type';
/**
 * mapps an item according to given model constructor [its meta data] to attributes
 */
export declare function toDb<T>(item: T, modelConstructor?: ModelConstructor<T>): Attributes<T>;
/**
 * maps a js value to its dynamoDB attribute
 * @param propertyValue The value which should be mapped
 * @param propertyMetadata Some optional metadata
 */
export declare function toDbOne(propertyValue: any, propertyMetadata?: PropertyMetadata<any>): Attribute | null;
/**
 * maps a js value to its dynamoDB attribute.
 * You can provide the property path to have a more verbose output
 *
 * @param propertyValue The value which should be mapped
 * @param propertyPath The property path is only used for logging purposes
 * @param propertyMetadata Some optional metadata
 */
export declare function toDbOne(propertyValue: any, propertyPath: string, propertyMetadata?: PropertyMetadata<any>): Attribute | null;
/**
 * returns the function for the given ModelConstructor to create the AttributeMap with HASH (and RANGE) Key of a given item.
 * @param modelConstructor
 */
export declare function createToKeyFn<T>(modelConstructor: ModelConstructor<T>): (item: Partial<T>) => Attributes<T>;
/**
 * creates toKeyFn and applies item to it.
 * @see {@link createToKeyFn}
 */
export declare function toKey<T>(item: T, modelConstructor: ModelConstructor<T>): Attributes<T>;
/**
 * @hidden
 */
export declare function createKeyAttributes<T>(metadata: Metadata<T>, partitionKey: any, sortKey?: any): Attributes<Partial<T>>;
/**
 * parses attributes to a js item according to the given model constructor [its meta data]
 */
export declare function fromDb<T>(attributeMap: Attributes<T>, modelConstructor?: ModelConstructor<T>): T;
/**
 * parses an attribute to a js value according to the given property metadata
 */
export declare function fromDbOne<T>(attributeValue: Attribute, propertyMetadata?: PropertyMetadata<any, any>): T;
/**
 * @hidden
 */
export declare function forType(type: AttributeValueType): MapperForType<any, Attribute>;
/**
 * @hidden
 */
export declare function getPropertyValue(item: any, propertyKey: PropertyKey): any;
