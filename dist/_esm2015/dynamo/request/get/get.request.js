import { promiseTap } from '../../../helper/promise-tap.function';
import { createLogger } from '../../../logger/logger';
import { createKeyAttributes, fromDb } from '../../../mapper/mapper';
import { addProjectionExpressionParam } from '../helper/add-projection-expression-param.function';
import { StandardRequest } from '../standard.request';
/**
 * Request class for the GetItem operation.
 */
export class GetRequest extends StandardRequest {
    constructor(dynamoDBWrapper, modelClazz, partitionKey, sortKey) {
        super(dynamoDBWrapper, modelClazz);
        this.logger = createLogger('dynamo.request.GetRequest', modelClazz);
        this.params.Key = createKeyAttributes(this.metadata, partitionKey, sortKey);
    }
    /**
     * Determines the read consistency model: If set to true, then the operation uses strongly consistent reads; otherwise, the operation uses eventually consistent reads.
     */
    consistentRead(consistentRead = true) {
        this.params.ConsistentRead = consistentRead;
        return this;
    }
    /**
     * Specifies the list of model attributes to be returned from the table instead of returning the entire document
     * @param attributesToGet List of model attributes to be returned
     */
    projectionExpression(...attributesToGet) {
        addProjectionExpressionParam(attributesToGet, this.params, this.metadata);
        return this;
    }
    execFullResponse() {
        this.logger.debug('request', this.params);
        return this.dynamoDBWrapper
            .getItem(this.params)
            .then(promiseTap((response) => this.logger.debug('response', response)))
            .then((getItemResponse) => {
            const response = Object.assign({}, getItemResponse);
            if (getItemResponse.Item) {
                response.Item = fromDb(getItemResponse.Item, this.modelClazz);
            }
            else {
                response.Item = null;
            }
            return response;
        })
            .then(promiseTap((response) => this.logger.debug('mapped item', response.Item)));
    }
    /**
     * execute request and return the parsed item
     */
    exec() {
        this.logger.debug('request', this.params);
        return this.dynamoDBWrapper
            .getItem(this.params)
            .then(promiseTap((response) => this.logger.debug('response', response)))
            .then((response) => {
            if (response.Item) {
                return fromDb(response.Item, this.modelClazz);
            }
            else {
                return null;
            }
        })
            .then(promiseTap((item) => this.logger.debug('mapped item', item)));
    }
}
//# sourceMappingURL=get.request.js.map