/**
 * @module decorators
 */
import { MapperForType } from '../../../mapper/for-type/base.mapper';
/**
 * Option interface for @Property decorator
 */
export interface PropertyData<T> {
    /**
     * the name of property how it is named in dynamoDB
     */
    name: string;
    mapper: MapperForType<T, any>;
    defaultValueProvider: () => T;
}
