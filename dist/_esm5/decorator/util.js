/**
 * @hidden
 */
export var KEY_TYPE = 'design:type';
/**
 * @hidden
 */
export var KEY_PARAMETER = 'design:paramtypes';
/**
 * @hidden
 */
export var KEY_RETURN_TYPE = 'design:returntype';
/**
 * @hidden
 */
export var getMetadataType = makeMetadataGetter(KEY_TYPE);
/**
 * @hidden
 */
export function makeMetadataGetter(metadataKey) {
    return function (target, targetKey) { return Reflect.getMetadata(metadataKey, target, targetKey); };
}
//# sourceMappingURL=util.js.map