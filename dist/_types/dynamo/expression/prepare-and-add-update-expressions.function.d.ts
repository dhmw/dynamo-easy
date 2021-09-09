/**
 * @module expression
 */
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import { Metadata } from '../../decorator/metadata/metadata';
import { UpdateExpressionDefinitionFunction } from './type/update-expression-definition-function';
/**
 * @hidden
 */
export declare function prepareAndAddUpdateExpressions(metadata: Metadata<any>, params: DynamoDB.UpdateItemInput | DynamoDB.Update, updateDefFns: UpdateExpressionDefinitionFunction[]): void;
