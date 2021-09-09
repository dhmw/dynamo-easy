function nullFromDb(attributeValue) {
    if (attributeValue.NULL) {
        return null;
    }
    else {
        throw new Error("there is no NULL value defined on given attribute value: " + JSON.stringify(attributeValue));
    }
}
function nullToDb(value) {
    if (value !== null) {
        throw new Error("null mapper only supports null value, got " + JSON.stringify(value));
    }
    return { NULL: true };
}
export var NullMapper = {
    fromDb: nullFromDb,
    toDb: nullToDb,
};
//# sourceMappingURL=null.mapper.js.map