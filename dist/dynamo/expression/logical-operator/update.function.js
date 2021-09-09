"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_expression_builder_1 = require("../request-expression-builder");
/**
 * Use this method when accessing a top level attribute of a model with strict typing of the value in chained function
 * @example
 * ```typescript
 * @Model()
 * class Person {
 *
 *   @PartitionKey()
 *   id: string
 *   age: number
 * }
 *
 * personStore.update('idValue')
 *  .operations(update2(Person, 'age').set(5))
 *  .exec()
 * ```
 *
 * When using the update2 we have type support for the set (and all other update functions) value,
 * it can only be number, because the type of age is number too, this only works when not using a custom mapper.
 * The downside of the strict typing is the model constructor parameter which is only required for typing reasons.
 */
function update2(modelConstructor, attributePath) {
    return request_expression_builder_1.updateDefinitionFunction(attributePath);
}
exports.update2 = update2;
function update(attributePath) {
    return request_expression_builder_1.updateDefinitionFunction(attributePath);
}
exports.update = update;
//# sourceMappingURL=update.function.js.map