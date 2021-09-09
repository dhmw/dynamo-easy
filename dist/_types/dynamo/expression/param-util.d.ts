/**
 * @module expression
 */
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import { ConditionalParams } from '../operation-params.type';
import { Expression } from './type/expression.type';
/**
 * @hidden
 */
export declare function addUpdateExpression(updateExpression: Expression, params: DynamoDB.UpdateItemInput): void;
/**
 * @hidden
 */
export declare function addExpression(expressionType: 'ConditionExpression' | 'KeyConditionExpression' | 'FilterExpression' | 'UpdateExpression', condition: Expression, params: ConditionalParams): void;
/**
 * Will merge two update expressions into one, one action keyword can only appear once in an update expression
 *
 * ```
 * const merged = mergeUpdateExpressions(
 *                    'SET a, b REMOVE e, f ADD i, j DELETE m, n',
 *                    'SET c, d REMOVE g, h ADD k, l DELETE o, p',
 *                )
 * console.log(merged) -> 'SET a, b, c, d REMOVE e, f, g, h ADD i, j, k, l DELETE m, n, o, p'
 * ```
 *
 * @hidden
 */
export declare function mergeUpdateExpressions(expression1: string, expression2: string): string;
