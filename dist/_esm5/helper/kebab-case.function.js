// copied from just-kebab-case
// any combination of spaces and punctuation characters
// thanks to http://stackoverflow.com/a/25575009
var wordSeparators = /[\s\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]+/;
var capitals = /[A-Z\u00C0-\u00D6\u00D9-\u00DD]/g;
/**
 * replace capitals with space + lower case equivalent for later parsing
 */
export function kebabCase(str) {
    return str
        .replace(capitals, function (match) { return ' ' + (match.toLowerCase() || match); })
        .trim()
        .split(wordSeparators)
        .join('-');
}
//# sourceMappingURL=kebab-case.function.js.map