function stringFromDb(attributeValue) {
    if (attributeValue.S || attributeValue.S === '') {
        return attributeValue.S;
    }
    else {
        throw new Error(`there is no S(tring) value defined on given attribute value: ${JSON.stringify(attributeValue)}`);
    }
}
function stringToDb(modelValue) {
    // an empty string is valid for a string attribute
    if (modelValue === null || modelValue === undefined) {
        return null;
    }
    else {
        return { S: modelValue };
    }
}
export const StringMapper = {
    fromDb: stringFromDb,
    toDb: stringToDb,
};
//# sourceMappingURL=string.mapper.js.map