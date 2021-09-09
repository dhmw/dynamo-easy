/**
 * @hidden
 */
export declare const BRACED_INDEX_REGEX: RegExp;
/**
 * Creates a unique attribute value placeholder name to use in the expression
 *
 * @returns {string} The unique attribute value placeholder name in respect to the given existing value names (no duplicates allowed)
 * @hidden
 */
export declare function uniqueAttributeValueName(key: string, existingValueNames?: string[]): string;
