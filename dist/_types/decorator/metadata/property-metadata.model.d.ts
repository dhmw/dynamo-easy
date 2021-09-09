/**
 * @module metadata
 */
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import { MapperForType } from '../../mapper/for-type/base.mapper';
import { Attribute } from '../../mapper/type/attribute.type';
import { ModelConstructor } from '../../model/model-constructor';
export interface TypeInfo {
    type: ModelConstructor<any>;
    genericType?: ModelConstructor<any>;
}
export interface Key {
    type: DynamoDB.KeyType;
}
export interface PropertyMetadata<T, R extends Attribute = Attribute> {
    key?: Key;
    name: keyof T;
    nameDb: string;
    typeInfo?: TypeInfo;
    isSortedCollection?: boolean;
    mapper?: () => MapperForType<any, R>;
    mapperForSingleItem?: () => MapperForType<any, any>;
    keyForGSI?: Record<string, DynamoDB.KeyType>;
    sortKeyForLSI?: string[];
    transient?: boolean;
    defaultValueProvider?: () => any;
}
/**
 * @hidden
 */
export declare function hasGenericType(propertyMetadata?: PropertyMetadata<any, any>): propertyMetadata is PropertyMetadata<any, any> & {
    typeInfo: {
        genericType: ModelConstructor<any>;
    };
};
/**
 * @hidden
 */
export declare function hasType(propertyMetadata?: PropertyMetadata<any, any>): propertyMetadata is PropertyMetadata<any, any> & {
    typeInfo: {
        type: ModelConstructor<any>;
    };
};
/**
 * @hidden
 */
export declare function alterCollectionPropertyMetadataForSingleItem<T>(propertyMeta?: PropertyMetadata<T> | null): PropertyMetadata<T> | undefined;
