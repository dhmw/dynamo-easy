"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promise_delay_function_1 = require("../../helper/promise-delay.function");
/**
 * Function which executes batchWriteItem operations until all given items (as params) are processed (written).
 * Between each follow-up request (in case of unprocessed items) a delay is interposed calculated by the given backoffTime and throttleTimeSlot.
 * @param dynamoDBWrapper
 * @param params containing the items per table to create the batchWrite operation
 * @param backoffTimer used to determine how many time slots the follow-up request should be delayed
 * @param throttleTimeSlot used to calculate the effective wait time
 * @hidden
 */
function batchWriteItemsWriteAll(dynamoDBWrapper, params, backoffTimer, throttleTimeSlot) {
    return dynamoDBWrapper.batchWriteItem(params).then((response) => {
        if (hasUnprocessedItems(response)) {
            // in case of unprocessedItems do a follow-up requests
            return (Promise.resolve(response.UnprocessedItems)
                // delay before doing the follow-up request
                .then(promise_delay_function_1.promiseDelay(backoffTimer.next().value * throttleTimeSlot))
                .then((unprocessedKeys) => {
                const nextParams = Object.assign({}, params, { RequestItems: unprocessedKeys });
                // call recursively batchWriteItemsWriteAll with the returned UnprocessedItems params
                return batchWriteItemsWriteAll(dynamoDBWrapper, nextParams, backoffTimer, throttleTimeSlot);
            }));
            // no combining of responses necessary, only the last response is returned
        }
        // no follow-up request necessary, return result
        return response;
    });
}
exports.batchWriteItemsWriteAll = batchWriteItemsWriteAll;
/**
 * @hidden
 */
function hasUnprocessedItems(response) {
    if (!response.UnprocessedItems) {
        return false;
    }
    return Object.values(response.UnprocessedItems).some((t) => !!t && t.length > 0);
}
exports.hasUnprocessedItems = hasUnprocessedItems;
//# sourceMappingURL=batch-write-utils.js.map