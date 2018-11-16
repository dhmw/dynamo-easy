import {
  DeleteItemInput,
  PutItemInput,
  ReturnConsumedCapacity,
  ReturnItemCollectionMetrics,
  UpdateItemInput,
} from 'aws-sdk/clients/dynamodb'
import { ModelConstructor } from '../../model/model-constructor'
import { DynamoRx } from '../dynamo-rx'
import { and } from '../expression/logical-operator/and.function'
import { ParamUtil } from '../expression/param-util'
import { RequestExpressionBuilder } from '../expression/request-expression-builder'
import { ConditionExpressionDefinitionFunction } from '../expression/type/condition-expression-definition-function'
import { RequestConditionFunction } from '../expression/type/request-condition-function'
import { BaseRequest } from './base.request'

export abstract class WriteRequest<
  R extends BaseRequest<T, I>,
  T,
  I extends DeleteItemInput | PutItemInput | UpdateItemInput
> extends BaseRequest<T, I> {
  constructor(dynamoRx: DynamoRx, modelClazz: ModelConstructor<T>, tableName: string) {
    super(dynamoRx, modelClazz, tableName)
  }

  protected abstract getInstance(): R

  returnConsumedCapacity(level: ReturnConsumedCapacity): R {
    this.params.ReturnConsumedCapacity = level
    return this.getInstance()
  }

  returnItemCollectionMetrics(returnItemCollectionMetrics: ReturnItemCollectionMetrics): R {
    this.params.ReturnItemCollectionMetrics = returnItemCollectionMetrics
    return this.getInstance()
  }

  onlyIfAttribute(attributePath: keyof T): RequestConditionFunction<R> {
    return RequestExpressionBuilder.addCondition(
      'ConditionExpression',
      <string>attributePath,
      this.getInstance(),
      this.metaData
    )
  }

  /**
   * @param conditionDefFns
   */
  onlyIf(...conditionDefFns: ConditionExpressionDefinitionFunction[]): R {
    const condition = and(...conditionDefFns)(undefined, this.metaData)
    ParamUtil.addExpression('ConditionExpression', condition, this.params)
    return this.getInstance()
  }

  /*
     * The ReturnValues parameter is used by several DynamoDB operations; however,
     * DeleteItem/PutItem/UpdateItem does not recognize any values other than NONE or ALL_OLD.
     */
  returnValues(returnValues: 'NONE' | 'ALL_OLD'): R {
    this.params.ReturnValues = returnValues
    return this.getInstance()
  }
}
