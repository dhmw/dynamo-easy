function booleanFromDb(attributeValue) {
    if (attributeValue.BOOL === undefined) {
        throw new Error(`there is no BOOL(ean) value defined on given attribute value: ${JSON.stringify(attributeValue)}`);
    }
    return attributeValue.BOOL === true;
}
function booleanToDb(modelValue) {
    if (!(modelValue === true || modelValue === false)) {
        throw new Error(`only boolean values are mapped to a BOOl attribute, given: ${JSON.stringify(modelValue)}`);
    }
    return { BOOL: modelValue };
}
export const BooleanMapper = {
    fromDb: booleanFromDb,
    toDb: booleanToDb,
};
//# sourceMappingURL=boolean.mapper.js.map