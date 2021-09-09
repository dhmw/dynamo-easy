"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module mapper
 */
const metadata_1 = require("../decorator/metadata/metadata");
const metadata_for_model_function_1 = require("../decorator/metadata/metadata-for-model.function");
const property_metadata_model_1 = require("../decorator/metadata/property-metadata.model");
const logger_1 = require("../logger/logger");
const boolean_mapper_1 = require("./for-type/boolean.mapper");
const collection_mapper_1 = require("./for-type/collection.mapper");
const null_mapper_1 = require("./for-type/null.mapper");
const number_mapper_1 = require("./for-type/number.mapper");
const object_mapper_1 = require("./for-type/object.mapper");
const string_mapper_1 = require("./for-type/string.mapper");
const binary_type_1 = require("./type/binary.type");
const null_type_1 = require("./type/null.type");
const undefined_type_1 = require("./type/undefined.type");
const util_1 = require("./util");
/**
 * @hidden
 */
const mapperForType = new Map();
/**
 * @hidden
 */
const logger = logger_1.createOptModelLogger('dynamo.mapper.mapper');
/**
 * mapps an item according to given model constructor [its meta data] to attributes
 */
function toDb(item, modelConstructor) {
    logger.verbose('map toDb', modelConstructor, { item });
    const mapped = {};
    if (modelConstructor) {
        const metadata = metadata_for_model_function_1.metadataForModel(modelConstructor);
        /*
         * initialize possible properties with default value providers
         */
        if (metadata) {
            metadata.getPropertiesWithDefaultValueProvider().forEach(propertyMetadata => {
                const currentVal = Reflect.get(item, propertyMetadata.name);
                if (currentVal === undefined || currentVal === null) {
                    // tslint:disable-next-line:no-non-null-assertion
                    Reflect.set(item, propertyMetadata.name, propertyMetadata.defaultValueProvider());
                }
            });
        }
    }
    const propertyNames = Object.getOwnPropertyNames(item) || [];
    propertyNames.forEach((propertyKey) => {
        /*
         * 1) get the value of the property
         */
        const propertyValue = getPropertyValue(item, propertyKey);
        let attributeValue;
        if (propertyValue === undefined) {
            // noop ignore because we can't map it
        }
        else {
            /*
             * 2) decide how to map the property depending on type or value
             */
            let propertyMetadata;
            if (modelConstructor) {
                propertyMetadata = metadata_for_model_function_1.metadataForModel(modelConstructor).forProperty(propertyKey);
            }
            if (propertyMetadata) {
                if (propertyMetadata.transient) {
                    // 3a_1) skip transient property
                }
                else {
                    // 3a_2) property metadata is defined and property is not marked not transient
                    attributeValue = toDbOne(propertyValue, util_1.getPropertyPath(modelConstructor, propertyKey), propertyMetadata);
                }
            }
            else {
                // 3b) no metadata found
                attributeValue = toDbOne(propertyValue, util_1.getPropertyPath(modelConstructor, propertyKey));
            }
            if (attributeValue === undefined) {
                // no-op transient field, just ignore it
            }
            else if (attributeValue === null) {
                // empty values will be ignored too
            }
            else {
                ;
                mapped[propertyMetadata ? propertyMetadata.nameDb : propertyKey] = attributeValue;
            }
        }
    });
    return mapped;
}
exports.toDb = toDb;
function toDbOne(propertyValue, propertyPathOrMetadata, propertyMetadata) {
    logger.verbose('map toDbOne', null, { propertyValue, propertyPathOrMetadata, propertyMetadata });
    const propertyPath = propertyPathOrMetadata && typeof propertyPathOrMetadata === 'string' ? propertyPathOrMetadata : null;
    propertyMetadata =
        propertyPathOrMetadata && typeof propertyPathOrMetadata !== 'string' ? propertyPathOrMetadata : propertyMetadata;
    const explicitType = property_metadata_model_1.hasType(propertyMetadata) ? propertyMetadata.typeInfo.type : null;
    const type = explicitType || util_1.typeOf(propertyValue, propertyPath);
    const mapper = propertyMetadata && propertyMetadata.mapper ? propertyMetadata.mapper() : forType(type);
    const attrValue = explicitType
        ? mapper.toDb(propertyValue, propertyMetadata)
        : mapper.toDb(propertyValue);
    // some basic validation
    if (propertyMetadata && propertyMetadata.key) {
        if (attrValue === null) {
            throw new Error(`${propertyMetadata.name.toString()} is null but is a ${propertyMetadata.key.type} key`);
        }
        if (!('S' in attrValue) && !('N' in attrValue) && !('B' in attrValue)) {
            throw new Error(`\
DynamoDb only allows string, number or binary type for RANGE and HASH key. \
Make sure to define a custom mapper for '${propertyMetadata.name.toString()}' which returns a string, number or binary value for partition key, \
type ${type} cannot be used as partition key, value = ${JSON.stringify(propertyValue)}`);
        }
    }
    return attrValue;
}
exports.toDbOne = toDbOne;
/**
 * @hidden
 */
function testForKey(p) {
    return !!p.key;
}
/**
 * returns the function for the given ModelConstructor to create the AttributeMap with HASH (and RANGE) Key of a given item.
 * @param modelConstructor
 */
function createToKeyFn(modelConstructor) {
    const metadata = metadata_for_model_function_1.metadataForModel(modelConstructor);
    const properties = metadata.modelOptions.properties;
    if (!properties.length) {
        throw new Error('no properties defined on metadata');
    }
    const keyProperties = properties.filter(testForKey);
    return (item) => {
        logger.verbose('create key', null, { item, propertyMeta: keyProperties });
        return keyProperties.reduce((key, propMeta) => {
            if (item[propMeta.name] === null || item[propMeta.name] === undefined) {
                throw new Error(`there is no value for property ${propMeta.name.toString()} but is ${propMeta.key.type} key`);
            }
            const propertyValue = getPropertyValue(item, propMeta.name);
            key[propMeta.nameDb] = toDbOne(propertyValue, propMeta);
            return key;
        }, {});
    };
}
exports.createToKeyFn = createToKeyFn;
/**
 * creates toKeyFn and applies item to it.
 * @see {@link createToKeyFn}
 */
function toKey(item, modelConstructor) {
    return createToKeyFn(modelConstructor)(item);
}
exports.toKey = toKey;
/**
 * @hidden
 */
function createKeyAttributes(metadata, partitionKey, sortKey) {
    const partitionKeyProp = metadata.getPartitionKey();
    const partitionKeyMetadata = metadata.forProperty(partitionKeyProp);
    if (!partitionKeyMetadata) {
        throw new Error('metadata for partition key must be defined');
    }
    const keyAttributeMap = {
        [partitionKeyMetadata.nameDb]: toDbOne(partitionKey, partitionKeyMetadata),
    };
    if (metadata_1.hasSortKey(metadata)) {
        if (sortKey === null || sortKey === undefined) {
            throw new Error(`please provide the sort key for attribute ${metadata.getSortKey()}`);
        }
        const sortKeyProp = metadata.getSortKey();
        const sortKeyMetadata = metadata.forProperty(sortKeyProp);
        if (!sortKeyMetadata) {
            throw new Error('metadata for sort key must be defined');
        }
        keyAttributeMap[sortKeyMetadata.nameDb] = toDbOne(sortKey, sortKeyMetadata);
    }
    return keyAttributeMap;
}
exports.createKeyAttributes = createKeyAttributes;
/**
 * parses attributes to a js item according to the given model constructor [its meta data]
 */
function fromDb(attributeMap, modelConstructor) {
    logger.verbose('parse fromDb', modelConstructor, { attributeMap });
    const model = {};
    Object.getOwnPropertyNames(attributeMap).forEach((attributeName) => {
        /*
         * 1) get the value of the property
         */
        const attributeValue = attributeMap[attributeName];
        /*
         * 2) decide how to map the property depending on type or value
         */
        let modelValue;
        let propertyMetadata;
        if (modelConstructor) {
            propertyMetadata = metadata_for_model_function_1.metadataForModel(modelConstructor).forProperty(attributeName);
        }
        if (propertyMetadata) {
            if (propertyMetadata.transient) {
                // skip transient property
            }
            else {
                /*
                 * 3a) property metadata is defined
                 */
                if (propertyMetadata && propertyMetadata.mapper) {
                    // custom mapper
                    modelValue = propertyMetadata.mapper().fromDb(attributeValue, propertyMetadata);
                }
                else {
                    modelValue = fromDbOne(attributeValue, propertyMetadata);
                }
            }
        }
        else {
            modelValue = fromDbOne(attributeValue);
        }
        if (modelValue !== undefined) {
            Reflect.set(model, propertyMetadata ? propertyMetadata.name : attributeName, modelValue);
        }
    });
    return model;
}
exports.fromDb = fromDb;
/**
 * parses an attribute to a js value according to the given property metadata
 */
function fromDbOne(attributeValue, propertyMetadata) {
    logger.verbose('parse fromDbOne', null, { attributeValue, propertyMetadata });
    const explicitType = property_metadata_model_1.hasType(propertyMetadata) ? propertyMetadata.typeInfo.type : null;
    const type = explicitType || util_1.typeOfFromDb(attributeValue);
    if (explicitType) {
        return forType(type).fromDb(attributeValue, propertyMetadata);
    }
    else {
        return forType(type).fromDb(attributeValue);
    }
}
exports.fromDbOne = fromDbOne;
/**
 * @hidden
 */
function forType(type) {
    let mapper = mapperForType.get(type);
    if (!mapper) {
        switch (type) {
            case String:
                mapper = string_mapper_1.StringMapper;
                break;
            case Number:
                mapper = number_mapper_1.NumberMapper;
                break;
            case Boolean:
                mapper = boolean_mapper_1.BooleanMapper;
                break;
            case Map:
                // Maps support complex types as keys, we only support String & Number as Keys, otherwise a .toString() method should be implemented,
                // so we now how to save a  key
                // mapperForType = new MapMapper()
                throw new Error('Map is not supported to be mapped for now');
            case Array:
                mapper = collection_mapper_1.CollectionMapper;
                break;
            case Set:
                mapper = collection_mapper_1.CollectionMapper;
                break;
            case null_type_1.NullType:
                mapper = null_mapper_1.NullMapper;
                break;
            case binary_type_1.Binary:
                // The applications must encode binary values in base64-encoded format before sending them to DynamoDB.
                // Upon receipt of these values,
                // DynamoDB decodes the data into an unsigned byte array and uses that as the length of the binary attribute.
                throw new Error('no mapper for binary type implemented yet');
            case undefined_type_1.UndefinedType:
                mapper = object_mapper_1.ObjectMapper;
                break;
            case Object:
            default:
                // return ObjectMapper as default to support nested @Model decorated classes (nested complex classes)
                // just note that the property still needs @Property decoration to get the metadata of the complex type
                mapper = object_mapper_1.ObjectMapper;
        }
        mapperForType.set(type, mapper);
    }
    return mapper;
}
exports.forType = forType;
/**
 * @hidden
 */
function getPropertyValue(item, propertyKey) {
    const propertyDescriptor = Object.getOwnPropertyDescriptor(item, propertyKey);
    // use get accessor if available otherwise use value property of descriptor
    if (propertyDescriptor) {
        if (propertyDescriptor.get) {
            return propertyDescriptor.get();
        }
        else {
            return propertyDescriptor.value;
        }
    }
    else {
        throw new Error(`there is no property descriptor for item ${JSON.stringify(item)} and property key ${propertyKey}`);
    }
}
exports.getPropertyValue = getPropertyValue;
//# sourceMappingURL=mapper.js.map