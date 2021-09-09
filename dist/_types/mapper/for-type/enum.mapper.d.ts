import { NumberAttribute } from '../type/attribute.type';
import { MapperForType } from './base.mapper';
/**
 * Enums are mapped to numbers by default.
 * ensures given value is from enum, if enum was specified as generic type
 */
export declare const EnumMapper: MapperForType<string | number, NumberAttribute>;
