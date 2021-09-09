/**
 * @module metadata
 */
import { ModelConstructor } from '../../model/model-constructor';
import { Metadata } from './metadata';
/**
 * create the metadata wrapper instance for a @Model() decorated class.
 */
export declare function metadataForModel<T>(modelConstructor: ModelConstructor<T>): Metadata<T>;
