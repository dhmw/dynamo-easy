"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is_boolean_function_1 = require("../helper/is-boolean.function");
const is_number_function_1 = require("../helper/is-number.function");
const is_string_function_1 = require("../helper/is-string.function");
const binary_type_1 = require("./type/binary.type");
const null_type_1 = require("./type/null.type");
const undefined_type_1 = require("./type/undefined.type");
/**
 * @hidden
 */
function getPropertyPath(modelConstructorOrPropertyMetadata, propertyKey) {
    if (modelConstructorOrPropertyMetadata && modelConstructorOrPropertyMetadata.name) {
        return `[${modelConstructorOrPropertyMetadata.name}::${propertyKey}]`;
    }
    else {
        return `[unknown::${propertyKey}]`;
    }
}
exports.getPropertyPath = getPropertyPath;
/**
 * @hidden
 */
function messageWithPath(propertyPath, message) {
    if (!!propertyPath) {
        return `${propertyPath} ${message}`;
    }
    else {
        return `${message}`;
    }
}
exports.messageWithPath = messageWithPath;
/**
 * @hidden
 */
const BUFFER_TYPES = [
    'Buffer',
    'File',
    'Blob',
    'ArrayBuffer',
    'DataView',
    'Int8Array',
    'Uint8Array',
    'Uint8ClampedArray',
    'Int16Array',
    'Uint16Array',
    'Int32Array',
    'Uint32Array',
    'Float32Array',
    'Float64Array',
];
/**
 * Detects the dynamoDB type to which an collection value should be mapped. Empty collections will be mapped to L(ist).
 * Collections of type array where all the values are either String | Number | Binary will be mapped to the corresponding S(et)
 * type. If the item types are heterogeneous or it is a non supported set type the returned type will be L(ist).
 * The logic for collection fo type Set is the same.
 *
 * @param {any[] | Set<any>} collection
 * @returns {AttributeCollectionType}
 * @hidden
 */
function detectCollectionTypeFromValue(collection) {
    if (Array.isArray(collection)) {
        return 'L';
    }
    else if (isSet(collection)) {
        if (collection.size) {
            const { homogeneous, type } = isHomogeneous(collection);
            if (homogeneous) {
                switch (type) {
                    case 'S':
                        return 'SS';
                    case 'N':
                        return 'NS';
                    case 'B':
                        return 'BS';
                    default:
                        throw new Error(`"Set<CustomType>" without decorator is not supported. Add the @CollectionProperty() decorator (optionally with {itemType:CustomType}) for a Set<->[L]ist mapping)`);
                }
            }
            else {
                // sets can not contain items with different types (heterogeneous)
                throw new Error(`"Set with values of different types without decorator is not supported. Use an array instead.`);
            }
        }
        else {
            /*
             * an empty Set will not be persisted so we just return an arbitrary Set type, it is only important that it is one of
             * S(et)
             */
            return 'SS';
        }
    }
    else {
        // basically can't happen since collectionmapper already checks for arr/set or throws
        throw new Error('given collection was neither array nor Set -> type could not be detected');
    }
}
exports.detectCollectionTypeFromValue = detectCollectionTypeFromValue;
/**
 * @hidden
 */
function isHomogeneous(collection) {
    const collectionAsArray = isSet(collection) ? Array.from(collection) : collection;
    const firstValueType = collectionAsArray.length ? detectType(collectionAsArray[0]) : null;
    let homogeneous = true;
    for (const item of collectionAsArray) {
        const type = detectType(item);
        if (type !== firstValueType) {
            homogeneous = false;
            break;
        }
    }
    if (homogeneous) {
        return { homogeneous: true, type: firstValueType };
    }
    else {
        return { homogeneous: false };
    }
}
exports.isHomogeneous = isHomogeneous;
/**
 * @hidden
 */
function isCollection(value) {
    return value && (Array.isArray(value) || isSet(value));
}
exports.isCollection = isCollection;
/**
 * @hidden
 */
function isSet(value) {
    return ((value !== null && value !== undefined && value.hasOwnProperty('name') && value.name === 'Set') ||
        value instanceof Set);
}
exports.isSet = isSet;
/**
 * @hidden
 */
function detectType(value) {
    if (is_string_function_1.isString(value)) {
        return 'S';
    }
    else if (is_number_function_1.isNumber(value)) {
        // TODO LOW: we should probably use _.isFinite --> otherwise Infinity & NaN are numbers as well
        return 'N';
    }
    else if (isBinary(value)) {
        return 'B';
    }
    else if (value === null) {
        return 'NULL';
    }
    else if (is_boolean_function_1.isBoolean(value)) {
        return 'BOOL';
    }
    else if (isCollection(value)) {
        return detectCollectionTypeFromValue(value);
    }
    else if (typeof value === 'object') {
        return 'M';
    }
    throw new Error(`the type for value ${value} could not be detected.`);
}
exports.detectType = detectType;
/**
 * Will resolve the type based on given property value
 * @hidden
 */
function typeOf(propertyValue, propertyPath) {
    if (propertyValue === null) {
        return null_type_1.NullType;
    }
    else if (Array.isArray(propertyValue)) {
        return Array;
    }
    else if (isSet(propertyValue)) {
        return Set;
    }
    else if (propertyValue instanceof Map) {
        return Map;
    }
    else if (isBinary(propertyValue)) {
        return binary_type_1.Binary;
    }
    else if (is_string_function_1.isString(propertyValue)) {
        return String;
    }
    else if (is_number_function_1.isNumber(propertyValue)) {
        return Number;
    }
    else if (is_boolean_function_1.isBoolean(propertyValue)) {
        return Boolean;
    }
    else if (typeof propertyValue === 'undefined') {
        return undefined_type_1.UndefinedType;
    }
    else if (typeof propertyValue === 'object') {
        return Object;
    }
    throw new Error(messageWithPath(propertyPath, `typeof data ${propertyValue} could not be detected`));
}
exports.typeOf = typeOf;
/**
 * copied from https://github.com/aws/aws-sdk-js/blob/0c974a7ff6749a541594de584b43a040978d4b72/lib/dynamodb/types.js
 * should we work with string match
 * @hidden
 */
function typeOfFromDb(attributeValue) {
    if (attributeValue) {
        const dynamoType = Object.keys(attributeValue)[0];
        switch (dynamoType) {
            case 'S':
                return String;
            case 'N':
                return Number;
            case 'B':
                return binary_type_1.Binary;
            case 'BOOL':
                return Boolean;
            case 'SS':
            case 'NS':
            case 'BS':
                return Set;
            case 'L':
                return Array;
            case 'M':
                return Object;
            case 'NULL':
                return null_type_1.NullType;
        }
    }
    throw new Error(`could not resolve the dynamo db type for attribute value ${attributeValue}`);
}
exports.typeOfFromDb = typeOfFromDb;
/**
 * @hidden
 */
function isBinary(data) {
    if (isNode()) {
        // TODO LOW:ENHANCEMENT should add || data instanceof Stream
        return Buffer.isBuffer(data);
    }
    else {
        return BUFFER_TYPES.some((type) => data !== undefined && data.constructor && (isType(data, type) || typeName(data.constructor) === type));
    }
}
exports.isBinary = isBinary;
/**
 * @hidden
 */
function isBufferType(type) {
    return BUFFER_TYPES.includes(type);
}
exports.isBufferType = isBufferType;
/**
 * copied from https://github.com/aws/aws-sdk-js/blob/0c974a7ff6749a541594de584b43a040978d4b72/lib/js
 * @hidden
 */
function isType(obj, type) {
    // handle cross-"frame" objects
    if (typeof type === 'function') {
        type = typeName(type);
    }
    return Object.prototype.toString.call(obj) === `[object ${type}]`;
}
exports.isType = isType;
/**
 * @hidden
 */
// tslint:disable-next-line:function-constructor
const isGlobalScopeWindow = new Function('try {return this===window;}catch(e){ return false;}')();
/**
 * @hidden
 */
function isBrowser() {
    return isGlobalScopeWindow;
}
exports.isBrowser = isBrowser;
/**
 * @hidden
 */
function isNode() {
    return !isGlobalScopeWindow;
}
exports.isNode = isNode;
/**
 * Returns the name of the given Type. null and undefined are special cases were we return 'Null' vs. 'Undefined'
 * @hidden
 */
function typeName(type) {
    if (type !== null && type !== undefined) {
        if (Object.prototype.hasOwnProperty.call(type, 'name')) {
            return type.name;
        }
        else {
            const str = type.toString();
            const match = str.match(/^\s*function (.+)\(/);
            return match ? match[1] : str;
        }
    }
    else {
        if (type === null) {
            return 'Null';
        }
        else if (type === undefined) {
            return 'Undefined';
        }
    }
    throw new Error(`was not able to resolve type name for type ${type}`);
}
exports.typeName = typeName;
//# sourceMappingURL=util.js.map