function dateFromDb(attributeValue) {
    if (attributeValue.N) {
        return new Date(parseInt(attributeValue.N, 10));
    }
    else {
        throw new Error('there is no N(umber) value defined on given attribute value');
    }
}
function dateToDb(modelValue) {
    // noinspection SuspiciousInstanceOfGuard
    if (modelValue && modelValue instanceof Date) {
        return { N: `${modelValue.getTime()}` };
    }
    else {
        throw new Error('the given model value must be an instance of Date');
    }
}
export const dateToNumberMapper = {
    fromDb: dateFromDb,
    toDb: dateToDb,
};
//# sourceMappingURL=date-to-number.mapper.js.map