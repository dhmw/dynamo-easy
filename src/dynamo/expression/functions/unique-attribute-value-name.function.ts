/**
 * Creates a unique attribute value placeholder name to use in the expression
 *
 * @param {string} key
 * @param {string[]} existingValueNames
 * @returns {string} The unique attribute value placeholder name in respect to the given existing value names (no duplicates)
 */
export function uniqAttributeValueName(key: string, existingValueNames?: string[]): string {
  let potentialName = `:${key}`
  let idx = 1

  if (existingValueNames && existingValueNames.length) {
    while (existingValueNames.includes(potentialName)) {
      idx++
      potentialName = `:${key}_${idx}`
    }
  }

  return potentialName
}