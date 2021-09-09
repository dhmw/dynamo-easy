import { BinaryAttribute, NumberAttribute, StringAttribute } from '../../../mapper/type/attribute.type';
import { CollectionPropertyData } from './collection-property-data.model';
export declare function CollectionProperty<R, T extends StringAttribute | NumberAttribute | BinaryAttribute>(opts?: CollectionPropertyData<R, T>): PropertyDecorator;
