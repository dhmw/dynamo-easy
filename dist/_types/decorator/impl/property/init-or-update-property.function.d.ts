/**
 * @module decorators
 */
import { Attribute } from '../../../mapper/type/attribute.type';
import { PropertyMetadata } from '../../metadata/property-metadata.model';
/**
 * @hidden
 */
export declare function initOrUpdateProperty(propertyMetadata: Partial<PropertyMetadata<any, Attribute>> | undefined, target: any, propertyKey: string): void;
