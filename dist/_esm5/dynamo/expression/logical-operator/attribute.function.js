import { propertyDefinitionFunction } from '../request-expression-builder';
/**
 * Use this method when accessing a top level attribute of a model with strict typing of the value in chained function
 * @example
 * ```typescript
 *
 * @Model()
 * class Person{
 *
 *   @PartitionKey()
 *   id: string
 *   age: number
 * }
 *
 * store
 *  .scan()
 *  .where(attribute2(Person, 'age').equals(5))
 *  .exec()
 * ```
 *
 * When using the attribute2 we have type support for the equals (and all other condition functions) value,
 * it can only be number, because the type of age is number too, this only works when not using a custom mapper.
 * The downside of the strict typing is the model constructor parameter which is only required for typing reasons
 */
export function attribute2(modelConstructor, attributePath) {
    return propertyDefinitionFunction(attributePath);
}
export function attribute(attributePath) {
    return propertyDefinitionFunction(attributePath);
}
//# sourceMappingURL=attribute.function.js.map