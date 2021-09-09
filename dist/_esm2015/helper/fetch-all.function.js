import { ReadManyRequest } from '../dynamo/request/read-many.request';
/**
 * When we cant load all the items of a table with one request, we will fetch as long as there is more data
 * available. This can be used with scan and query requests.
 */
export function fetchAll(request, startKey) {
    request.limit(ReadManyRequest.INFINITE_LIMIT);
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
//# sourceMappingURL=fetch-all.function.js.map