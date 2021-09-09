"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promise_delay_function_1 = require("../../helper/promise-delay.function");
/**
 * Function which executes batchGetItem operations until all given items (as params) are processed (fetched).
 * Between each follow-up request (in case of unprocessed items) a delay is interposed calculated by the given backoffTime and throttleTimeSlot.
 * @param dynamoDBWrapper
 * @param params containing the keys per table to create the batchGet operation
 * @param backoffTimer used to determine how many time slots the follow-up request should be delayed
 * @param throttleTimeSlot used to calculate the effective wait time
 * @hidden
 */
function batchGetItemsFetchAll(dynamoDBWrapper, params, backoffTimer, throttleTimeSlot) {
    return dynamoDBWrapper.batchGetItems(params).then((response) => {
        if (hasUnprocessedKeys(response)) {
            // in case of unprocessedKeys do a follow-up requests
            return (Promise.resolve(response.UnprocessedKeys)
                // delay before doing the follow-up request
                .then(promise_delay_function_1.promiseDelay(backoffTimer.next().value * throttleTimeSlot))
                .then((UnprocessedKeys) => {
                const nextParams = Object.assign({}, params, { RequestItems: UnprocessedKeys });
                // call recursively batchGetItemsFetchAll with the returned UnprocessedItems params
                return batchGetItemsFetchAll(dynamoDBWrapper, nextParams, backoffTimer, throttleTimeSlot);
            })
                .then(combineBatchGetResponses(response)));
        }
        // no follow-up request necessary, return result
        return response;
    });
}
exports.batchGetItemsFetchAll = batchGetItemsFetchAll;
/**
 * @hidden
 */
function hasUnprocessedKeys(response) {
    if (!response.UnprocessedKeys) {
        return false;
    }
    return Object.values(response.UnprocessedKeys).some((t) => !!t && t.Keys && t.Keys.length > 0);
}
exports.hasUnprocessedKeys = hasUnprocessedKeys;
/**
 * combines a first with a second response. ConsumedCapacity is always from the latter.
 * @hidden
 */
function combineBatchGetResponses(response1) {
    return (response2) => {
        const tableNames = Object.keys(response1.Responses || {});
        Object.keys(response2.Responses || {})
            .filter((tn) => !tableNames.includes(tn))
            .forEach((tn) => tableNames.push(tn));
        const Responses = tableNames.reduce((u, tableName) => (Object.assign({}, u, { [tableName]: [
                ...((response1.Responses && response1.Responses[tableName]) || []),
                ...((response2.Responses && response2.Responses[tableName]) || []),
            ] })), {});
        return Object.assign({}, response2, { Responses });
    };
}
exports.combineBatchGetResponses = combineBatchGetResponses;
//# sourceMappingURL=batch-get-utils.js.map