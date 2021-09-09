import { promiseTap } from '../../helper/promise-tap.function';
import { fromDb } from '../../mapper/mapper';
import { and } from '../expression/logical-operator/public.api';
import { addExpression } from '../expression/param-util';
import { addCondition } from '../expression/request-expression-builder';
import { StandardRequest } from './standard.request';
/**
 * abstract class for all basic write request classes (DeleteItem, PutItem, UpdateItem
 */
export class WriteRequest extends StandardRequest {
    constructor(dynamoDBWrapper, modelClazz) {
        super(dynamoDBWrapper, modelClazz);
    }
    /**
     * return item collection metrics.
     */
    returnItemCollectionMetrics(returnItemCollectionMetrics) {
        this.params.ReturnItemCollectionMetrics = returnItemCollectionMetrics;
        return this;
    }
    onlyIfAttribute(attributePath) {
        return addCondition('ConditionExpression', attributePath, this, this.metadata);
    }
    /**
     * @example writeRequest.onlyIf( attribute('age').eq(23) )
     * @example writeRequest.onlyIf( or( attribute('age').lt(18), attribute('age').gt(65) ) )
     */
    onlyIf(...conditionDefFns) {
        const condition = and(...conditionDefFns)(undefined, this.metadata);
        addExpression('ConditionExpression', condition, this.params);
        return this;
    }
    /**
     * @returns { void } if no ReturnValues are requested, { T } if the requested ReturnValues are ALL_OLD|ALL_NEW or {Partial<T>} if the requested ReturnValues are UPDATED_OLD|UPDATED_NEW
     */
    exec() {
        /*
         * kind a hacky - this is just for typing reasons so Promise<void> is the default return type when not defining a
         * returnValues other than NONE
         */
        return this.execFullResponse().then((r) => r.Item);
    }
    /**
     * execute request and return the full response
     */
    execFullResponse() {
        this.logger.debug('request', this.params);
        return this.doRequest(this.params)
            .then(promiseTap((response) => this.logger.debug('response', response)))
            .then((resp) => {
            const attrs = resp.Attributes;
            delete resp.Attributes; // delete Attributes on response so it will not be on returned value
            const r = resp;
            if (typeof attrs === 'object' && attrs !== null) {
                /*
                 * kind a hacky - this is just for typing reasons so Item is default not defined when not defining a
                 * returnValues other than NONE
                 */
                ;
                r.Item = fromDb(attrs, this.modelClazz);
            }
            return r;
        })
            .then(promiseTap((resp) => this.logger.debug('mapped response', resp)));
    }
    /**
     * execute request without parsing (mapping) the response attributes to js objects
     */
    execNoMap() {
        this.logger.debug('request', this.params);
        return this.doRequest(this.params).then(promiseTap((response) => this.logger.debug('response', response)));
    }
}
//# sourceMappingURL=write.request.js.map