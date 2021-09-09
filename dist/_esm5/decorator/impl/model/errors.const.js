/**
 * @module decorators
 */
/**
 * @hidden
 */
export var modelErrors = {
    gsiMultiplePk: function (indexName, propDbName) {
        return "there is already a partition key defined for global secondary index " + indexName + " (property name: " + propDbName + ")";
    },
    gsiMultipleSk: function (indexName, propDbName) {
        return "there is already a sort key defined for global secondary index " + indexName + " (property name: " + propDbName + ")";
    },
    lsiMultipleSk: function (indexName, propDbName) {
        return "only one sort key can be defined for the same local secondary index, " + propDbName + " is already defined as sort key for index " + indexName;
    },
    lsiRequiresPk: function (indexName, propDbName) {
        return "the  local secondary index " + indexName + " requires the partition key to be defined";
    },
};
//# sourceMappingURL=errors.const.js.map