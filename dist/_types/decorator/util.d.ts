/**
 * @module decorators
 */
import { ModelConstructor } from '../model/model-constructor';
/**
 * @hidden
 */
export declare const KEY_TYPE = "design:type";
/**
 * @hidden
 */
export declare const KEY_PARAMETER = "design:paramtypes";
/**
 * @hidden
 */
export declare const KEY_RETURN_TYPE = "design:returntype";
/**
 * @hidden
 */
export declare const getMetadataType: (target: any, targetKey: string) => ModelConstructor<any>;
/**
 * @hidden
 */
export declare function makeMetadataGetter<T>(metadataKey: string): (target: any, targetKey: string) => T;
