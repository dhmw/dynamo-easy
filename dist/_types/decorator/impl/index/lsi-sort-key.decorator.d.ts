/**
 * Marks a property as the sort key attribute of a local secondary index (the partition key must be same as in base table)
 */
export declare function LSISortKey(indexName: string): PropertyDecorator;
