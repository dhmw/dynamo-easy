/**
 * @module mapper
 */
import { PropertyMetadata } from '../decorator/metadata/property-metadata.model';
import { ModelConstructor } from '../model/model-constructor';
import { AttributeCollectionType, AttributeType } from './type/attribute-type.type';
import { AttributeValueType } from './type/attribute-value-type.type';
import { Attribute } from './type/attribute.type';
/**
 * @hidden
 */
export declare function getPropertyPath<T>(modelConstructorOrPropertyMetadata: ModelConstructor<T> | PropertyMetadata<T> | undefined, propertyKey: keyof T): string;
/**
 * @hidden
 */
export declare function messageWithPath(propertyPath: string | null | undefined, message: string): string;
/**
 * Detects the dynamoDB type to which an collection value should be mapped. Empty collections will be mapped to L(ist).
 * Collections of type array where all the values are either String | Number | Binary will be mapped to the corresponding S(et)
 * type. If the item types are heterogeneous or it is a non supported set type the returned type will be L(ist).
 * The logic for collection fo type Set is the same.
 *
 * @param {any[] | Set<any>} collection
 * @returns {AttributeCollectionType}
 * @hidden
 */
export declare function detectCollectionTypeFromValue(collection: any[] | Set<any>): AttributeCollectionType;
/**
 * @hidden
 */
export declare function isHomogeneous(collection: Set<any> | any[]): {
    homogeneous: boolean;
    type?: AttributeType | null;
};
/**
 * @hidden
 */
export declare function isCollection(value: any): boolean;
/**
 * @hidden
 */
export declare function isSet(value: any): value is Set<any>;
/**
 * @hidden
 */
export declare function detectType(value: any): AttributeType;
/**
 * Will resolve the type based on given property value
 * @hidden
 */
export declare function typeOf(propertyValue: any, propertyPath?: string | null): AttributeValueType;
/**
 * copied from https://github.com/aws/aws-sdk-js/blob/0c974a7ff6749a541594de584b43a040978d4b72/lib/dynamodb/types.js
 * should we work with string match
 * @hidden
 */
export declare function typeOfFromDb(attributeValue?: Attribute): AttributeValueType;
/**
 * @hidden
 */
export declare function isBinary(data: any): boolean;
/**
 * @hidden
 */
export declare function isBufferType(type: any): boolean;
/**
 * copied from https://github.com/aws/aws-sdk-js/blob/0c974a7ff6749a541594de584b43a040978d4b72/lib/js
 * @hidden
 */
export declare function isType(obj: any, type: any): boolean;
/**
 * @hidden
 */
export declare function isBrowser(): any;
/**
 * @hidden
 */
export declare function isNode(): boolean;
/**
 * Returns the name of the given Type. null and undefined are special cases were we return 'Null' vs. 'Undefined'
 * @hidden
 */
export declare function typeName(type: any): 'Null' | 'Undefined' | string;
