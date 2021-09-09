"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @hidden
 */
exports.KEY_TYPE = 'design:type';
/**
 * @hidden
 */
exports.KEY_PARAMETER = 'design:paramtypes';
/**
 * @hidden
 */
exports.KEY_RETURN_TYPE = 'design:returntype';
/**
 * @hidden
 */
exports.getMetadataType = makeMetadataGetter(exports.KEY_TYPE);
/**
 * @hidden
 */
function makeMetadataGetter(metadataKey) {
    return (target, targetKey) => Reflect.getMetadata(metadataKey, target, targetKey);
}
exports.makeMetadataGetter = makeMetadataGetter;
//# sourceMappingURL=util.js.map