/**
 * @module expression
 */
import { Metadata } from '../../../decorator/metadata/metadata';
/**
 * @hidden
 */
export declare function resolveAttributeNames(attributePath: string, metadata?: Metadata<any> | undefined): {
    placeholder: string;
    attributeNames: Record<string, string>;
};
