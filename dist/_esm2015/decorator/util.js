/**
 * @hidden
 */
export const KEY_TYPE = 'design:type';
/**
 * @hidden
 */
export const KEY_PARAMETER = 'design:paramtypes';
/**
 * @hidden
 */
export const KEY_RETURN_TYPE = 'design:returntype';
/**
 * @hidden
 */
export const getMetadataType = makeMetadataGetter(KEY_TYPE);
/**
 * @hidden
 */
export function makeMetadataGetter(metadataKey) {
    return (target, targetKey) => Reflect.getMetadata(metadataKey, target, targetKey);
}
//# sourceMappingURL=util.js.map