"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const read_many_request_1 = require("../dynamo/request/read-many.request");
/**
 * When we cant load all the items of a table with one request, we will fetch as long as there is more data
 * available. This can be used with scan and query requests.
 */
function fetchAll(request, startKey) {
    request.limit(read_many_request_1.ReadManyRequest.INFINITE_LIMIT);
    if (startKey) {
        request.exclusiveStartKey(startKey);
    }
    return request.execFullResponse().then((response) => {
        if (response.LastEvaluatedKey) {
            return fetchAll(request, response.LastEvaluatedKey).then((innerResponse) => [...response.Items, ...innerResponse]);
        }
        else {
            return response.Items;
        }
    });
}
exports.fetchAll = fetchAll;
//# sourceMappingURL=fetch-all.function.js.map