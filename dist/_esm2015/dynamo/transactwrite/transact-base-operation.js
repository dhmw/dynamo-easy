import { metadataForModel } from '../../decorator/metadata/metadata-for-model.function';
import { and } from '../expression/logical-operator/and.function';
import { addExpression } from '../expression/param-util';
import { addCondition } from '../expression/request-expression-builder';
import { getTableName } from '../get-table-name.function';
/**
 * Abstract base class for all transact items.
 */
export class TransactBaseOperation {
    constructor(modelClazz) {
        if (!modelClazz) {
            throw new Error(`please provide the model class`);
        }
        this.modelClazz = modelClazz;
        this.metadata = metadataForModel(this.modelClazz);
        if (!this.metadata.modelOptions) {
            throw new Error('the given model class has no model decorator');
        }
        this.params = {
            TableName: getTableName(this.metadata),
        };
    }
    onlyIfAttribute(attributePath) {
        return addCondition('ConditionExpression', attributePath, this, this.metadata);
    }
    /**
     * add a condition necessary for the transaction to succeed
     * @example req.onlyIf(or(attribute('age').lt(10), attribute('age').gt(20)))
     */
    onlyIf(...conditionDefFns) {
        const condition = and(...conditionDefFns)(undefined, this.metadata);
        addExpression('ConditionExpression', condition, this.params);
        return this;
    }
    /**
     * get the item attributes if the condition fails
     */
    returnValuesOnConditionCheckFailure(value) {
        this.params.ReturnValuesOnConditionCheckFailure = value;
        return this;
    }
}
//# sourceMappingURL=transact-base-operation.js.map