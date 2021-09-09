/**
 * @module decorators
 */
/**
 * @hidden
 */
export declare const modelErrors: {
    gsiMultiplePk: (indexName: string, propDbName: string) => string;
    gsiMultipleSk: (indexName: string, propDbName: string) => string;
    lsiMultipleSk: (indexName: string, propDbName: string) => string;
    lsiRequiresPk: (indexName: string, propDbName: string) => string;
};
