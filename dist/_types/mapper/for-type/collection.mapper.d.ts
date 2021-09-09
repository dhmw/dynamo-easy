import { BinarySetAttribute, ListAttribute, NullAttribute, NumberSetAttribute, StringSetAttribute } from '../type/attribute.type';
import { MapperForType } from './base.mapper';
declare type CollectionAttributeTypes = StringSetAttribute | NumberSetAttribute | BinarySetAttribute | ListAttribute | NullAttribute;
export declare const CollectionMapper: MapperForType<any[] | Set<any>, CollectionAttributeTypes>;
export {};
