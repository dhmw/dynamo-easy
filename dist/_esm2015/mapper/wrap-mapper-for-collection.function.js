/**
 * @module mapper
 */
import { notNull } from '../helper/not-null.function';
import { isSet } from './util';
/**
 * @hidden
 */
export function arrayToListAttribute(customMapper) {
    return (values) => {
        const mapped = values.map((v) => customMapper.toDb(v)).filter(notNull);
        return { L: mapped };
    };
}
/**
 * @hidden
 */
export function listAttributeToArray(customMapper) {
    return (attributeValues) => attributeValues.L.map((i) => customMapper.fromDb(i));
}
/**
 * @hidden
 */
export function setAttributeToArray(customMapper) {
    return (attributeValues) => {
        switch (Object.keys(attributeValues)[0]) {
            case 'SS':
                return attributeValues.SS.map((v) => customMapper.fromDb({ S: v }));
            case 'NS':
                return attributeValues.NS.map((v) => customMapper.fromDb({ N: v }));
            case 'BS':
                return attributeValues.BS.map((v) => customMapper.fromDb({ B: v }));
            default:
                throw new Error(`given attribute (${JSON.stringify(attributeValues)}) value is not a SetAttribute`);
        }
    };
}
/**
 * @hidden
 */
export function arrayToSetAttribute(customMapper) {
    return (values) => {
        const mapped = values.map((v) => customMapper.toDb(v)).filter(notNull);
        if (mapped.length === 0) {
            return null;
        }
        switch (Object.keys(mapped[0])[0]) {
            case 'S':
                return { SS: mapped.map((sa) => sa.S) };
            case 'N':
                return { NS: mapped.map((na) => na.N) };
            case 'B':
                return { BS: mapped.map((ba) => ba.B) };
            default:
                throw new Error('values given are not of type string, number or binary after applying the custom mapper');
        }
    };
}
/**
 * returns a function which takes a Set which will be spread when applied to the given function
 * @hidden
 */
function spreadSetAndApplyToFn(fn) {
    return (values) => {
        if (!isSet(values)) {
            throw new Error(`provided argument (${JSON.stringify(values)}) is neither a Set nor an Array`);
        }
        return fn([...values]);
    };
}
/**
 * returns a function which will execute the given function and wraps its return value in a Set
 * @hidden
 */
function applyFnWrapWithSet(fn) {
    return (arg) => new Set(fn(arg));
}
/**
 * @hidden
 */
export function wrapMapperForDynamoSetJsArray(customMapper) {
    return {
        fromDb: setAttributeToArray(customMapper),
        toDb: arrayToSetAttribute(customMapper),
    };
}
/**
 * @hidden
 */
export function wrapMapperForDynamoSetJsSet(customMapper) {
    return {
        fromDb: applyFnWrapWithSet(setAttributeToArray(customMapper)),
        toDb: spreadSetAndApplyToFn(arrayToSetAttribute(customMapper)),
    };
}
/**
 * @hidden
 */
export function wrapMapperForDynamoListJsArray(customMapper) {
    return {
        fromDb: listAttributeToArray(customMapper),
        toDb: arrayToListAttribute(customMapper),
    };
}
/**
 * @hidden
 */
export function wrapMapperForDynamoListJsSet(customMapper) {
    return {
        fromDb: applyFnWrapWithSet(listAttributeToArray(customMapper)),
        toDb: spreadSetAndApplyToFn(arrayToListAttribute(customMapper)),
    };
}
//# sourceMappingURL=wrap-mapper-for-collection.function.js.map