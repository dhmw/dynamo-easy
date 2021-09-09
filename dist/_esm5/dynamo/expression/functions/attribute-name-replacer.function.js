/**
 * @module expression
 */
/**
 * @hidden
 */
export function attributeNameReplacer(substring) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return "_at_" + args[0];
}
//# sourceMappingURL=attribute-name-replacer.function.js.map