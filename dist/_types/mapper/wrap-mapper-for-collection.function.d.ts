import { MapperForType } from './for-type/base.mapper';
import { BinaryAttribute, BinarySetAttribute, ListAttribute, NumberAttribute, NumberSetAttribute, StringAttribute, StringSetAttribute } from './type/attribute.type';
/**
 * @hidden
 */
export declare type SetAttributeOf<A extends StringAttribute | NumberAttribute | BinaryAttribute> = A extends StringAttribute ? StringSetAttribute : A extends NumberAttribute ? NumberSetAttribute : BinarySetAttribute;
/**
 * @hidden
 */
export declare function arrayToListAttribute<T, A extends StringAttribute | NumberAttribute | BinaryAttribute>(customMapper: MapperForType<T, A>): (values: T[]) => ListAttribute<A> | null;
/**
 * @hidden
 */
export declare function listAttributeToArray<T, A extends StringAttribute | NumberAttribute | BinaryAttribute>(customMapper: MapperForType<T, A>): (attributeValues: ListAttribute<A>) => T[];
/**
 * @hidden
 */
export declare function setAttributeToArray<T, A extends StringAttribute | NumberAttribute | BinaryAttribute>(customMapper: MapperForType<T, A>): (attributeValues: SetAttributeOf<A>) => T[];
/**
 * @hidden
 */
export declare function arrayToSetAttribute<T, A extends StringAttribute | NumberAttribute | BinaryAttribute>(customMapper: MapperForType<T, A>): (values: T[]) => SetAttributeOf<A> | null;
/**
 * @hidden
 */
export declare function wrapMapperForDynamoSetJsArray<T, A extends StringAttribute | NumberAttribute | BinaryAttribute>(customMapper: MapperForType<T, A>): MapperForType<T[], SetAttributeOf<A>>;
/**
 * @hidden
 */
export declare function wrapMapperForDynamoSetJsSet<T, A extends StringAttribute | NumberAttribute | BinaryAttribute>(customMapper: MapperForType<T, A>): MapperForType<Set<T>, SetAttributeOf<A>>;
/**
 * @hidden
 */
export declare function wrapMapperForDynamoListJsArray<T, A extends StringAttribute | NumberAttribute | BinaryAttribute>(customMapper: MapperForType<T, A>): MapperForType<T[], ListAttribute<A>>;
/**
 * @hidden
 */
export declare function wrapMapperForDynamoListJsSet<T, A extends StringAttribute | NumberAttribute | BinaryAttribute>(customMapper: MapperForType<T, A>): MapperForType<Set<T>, ListAttribute<A>>;
