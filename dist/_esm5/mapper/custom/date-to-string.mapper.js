function dateFromDb(attributeValue) {
    if (attributeValue.S) {
        var date = new Date(attributeValue.S);
        if (isNaN(date)) {
            throw new Error('given string is not a valid date string');
        }
        return date;
    }
    else {
        throw new Error('there is no S(tring) value defined on given attribute value');
    }
}
function dateToDb(modelValue) {
    // noinspection SuspiciousInstanceOfGuard
    if (modelValue && modelValue instanceof Date) {
        return { S: "" + modelValue.toISOString() };
    }
    else {
        throw new Error('the given model value must be an instance of Date');
    }
}
export var dateToStringMapper = {
    fromDb: dateFromDb,
    toDb: dateToDb,
};
//# sourceMappingURL=date-to-string.mapper.js.map