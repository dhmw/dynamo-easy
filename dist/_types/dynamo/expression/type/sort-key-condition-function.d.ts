/**
 * @module expression
 */
import { ConditionalParamsHost } from '../../operation-params.type';
export interface SortKeyConditionFunction<R extends ConditionalParamsHost> {
    equals: (value: any) => R;
    eq: (value: any) => R;
    lt: (value: any) => R;
    lte: (value: any) => R;
    gt: (value: any) => R;
    gte: (value: any) => R;
    between: (value1: any, value2: any) => R;
    beginsWith: (value: any) => R;
}
