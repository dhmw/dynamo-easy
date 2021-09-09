/**
 * @module decorators
 */
/**
 * @hidden
 */
export const modelErrors = {
    gsiMultiplePk: (indexName, propDbName) => `there is already a partition key defined for global secondary index ${indexName} (property name: ${propDbName})`,
    gsiMultipleSk: (indexName, propDbName) => `there is already a sort key defined for global secondary index ${indexName} (property name: ${propDbName})`,
    lsiMultipleSk: (indexName, propDbName) => `only one sort key can be defined for the same local secondary index, ${propDbName} is already defined as sort key for index ${indexName}`,
    lsiRequiresPk: (indexName, propDbName) => `the  local secondary index ${indexName} requires the partition key to be defined`,
};
//# sourceMappingURL=errors.const.js.map