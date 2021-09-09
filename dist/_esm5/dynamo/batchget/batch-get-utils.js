import * as tslib_1 from "tslib";
import { promiseDelay } from '../../helper/promise-delay.function';
/**
 * Function which executes batchGetItem operations until all given items (as params) are processed (fetched).
 * Between each follow-up request (in case of unprocessed items) a delay is interposed calculated by the given backoffTime and throttleTimeSlot.
 * @param dynamoDBWrapper
 * @param params containing the keys per table to create the batchGet operation
 * @param backoffTimer used to determine how many time slots the follow-up request should be delayed
 * @param throttleTimeSlot used to calculate the effective wait time
 * @hidden
 */
export function batchGetItemsFetchAll(dynamoDBWrapper, params, backoffTimer, throttleTimeSlot) {
    return dynamoDBWrapper.batchGetItems(params).then(function (response) {
        if (hasUnprocessedKeys(response)) {
            // in case of unprocessedKeys do a follow-up requests
            return (Promise.resolve(response.UnprocessedKeys)
                // delay before doing the follow-up request
                .then(promiseDelay(backoffTimer.next().value * throttleTimeSlot))
                .then(function (UnprocessedKeys) {
                var nextParams = tslib_1.__assign({}, params, { RequestItems: UnprocessedKeys });
                // call recursively batchGetItemsFetchAll with the returned UnprocessedItems params
                return batchGetItemsFetchAll(dynamoDBWrapper, nextParams, backoffTimer, throttleTimeSlot);
            })
                .then(combineBatchGetResponses(response)));
        }
        // no follow-up request necessary, return result
        return response;
    });
}
/**
 * @hidden
 */
export function hasUnprocessedKeys(response) {
    if (!response.UnprocessedKeys) {
        return false;
    }
    return Object.values(response.UnprocessedKeys).some(function (t) { return !!t && t.Keys && t.Keys.length > 0; });
}
/**
 * combines a first with a second response. ConsumedCapacity is always from the latter.
 * @hidden
 */
export function combineBatchGetResponses(response1) {
    return function (response2) {
        var tableNames = Object.keys(response1.Responses || {});
        Object.keys(response2.Responses || {})
            .filter(function (tn) { return !tableNames.includes(tn); })
            .forEach(function (tn) { return tableNames.push(tn); });
        var Responses = tableNames.reduce(function (u, tableName) {
            var _a;
            return (tslib_1.__assign({}, u, (_a = {}, _a[tableName] = tslib_1.__spread(((response1.Responses && response1.Responses[tableName]) || []), ((response2.Responses && response2.Responses[tableName]) || [])), _a)));
        }, {});
        return tslib_1.__assign({}, response2, { Responses: Responses });
    };
}
//# sourceMappingURL=batch-get-utils.js.map