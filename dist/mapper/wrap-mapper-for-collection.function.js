"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module mapper
 */
const not_null_function_1 = require("../helper/not-null.function");
const util_1 = require("./util");
/**
 * @hidden
 */
function arrayToListAttribute(customMapper) {
    return (values) => {
        const mapped = values.map((v) => customMapper.toDb(v)).filter(not_null_function_1.notNull);
        return { L: mapped };
    };
}
exports.arrayToListAttribute = arrayToListAttribute;
/**
 * @hidden
 */
function listAttributeToArray(customMapper) {
    return (attributeValues) => attributeValues.L.map((i) => customMapper.fromDb(i));
}
exports.listAttributeToArray = listAttributeToArray;
/**
 * @hidden
 */
function setAttributeToArray(customMapper) {
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
exports.setAttributeToArray = setAttributeToArray;
/**
 * @hidden
 */
function arrayToSetAttribute(customMapper) {
    return (values) => {
        const mapped = values.map((v) => customMapper.toDb(v)).filter(not_null_function_1.notNull);
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
exports.arrayToSetAttribute = arrayToSetAttribute;
/**
 * returns a function which takes a Set which will be spread when applied to the given function
 * @hidden
 */
function spreadSetAndApplyToFn(fn) {
    return (values) => {
        if (!util_1.isSet(values)) {
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
function wrapMapperForDynamoSetJsArray(customMapper) {
    return {
        fromDb: setAttributeToArray(customMapper),
        toDb: arrayToSetAttribute(customMapper),
    };
}
exports.wrapMapperForDynamoSetJsArray = wrapMapperForDynamoSetJsArray;
/**
 * @hidden
 */
function wrapMapperForDynamoSetJsSet(customMapper) {
    return {
        fromDb: applyFnWrapWithSet(setAttributeToArray(customMapper)),
        toDb: spreadSetAndApplyToFn(arrayToSetAttribute(customMapper)),
    };
}
exports.wrapMapperForDynamoSetJsSet = wrapMapperForDynamoSetJsSet;
/**
 * @hidden
 */
function wrapMapperForDynamoListJsArray(customMapper) {
    return {
        fromDb: listAttributeToArray(customMapper),
        toDb: arrayToListAttribute(customMapper),
    };
}
exports.wrapMapperForDynamoListJsArray = wrapMapperForDynamoListJsArray;
/**
 * @hidden
 */
function wrapMapperForDynamoListJsSet(customMapper) {
    return {
        fromDb: applyFnWrapWithSet(listAttributeToArray(customMapper)),
        toDb: spreadSetAndApplyToFn(arrayToListAttribute(customMapper)),
    };
}
exports.wrapMapperForDynamoListJsSet = wrapMapperForDynamoListJsSet;
//# sourceMappingURL=wrap-mapper-for-collection.function.js.map