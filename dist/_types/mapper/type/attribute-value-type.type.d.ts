/**
 * @module mapper
 */
import { Binary } from './binary.type';
import { NullType } from './null.type';
import { UndefinedType } from './undefined.type';
export declare type AttributeValueType = string | number | boolean | Binary | Set<any> | Map<any, any> | any[] | NullType | UndefinedType | object;
