"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module mapper
 */
const is_number_function_1 = require("../../helper/is-number.function");
function numberFromDb(attributeValue) {
    if (attributeValue.N) {
        const numberValue = Number.parseFloat(attributeValue.N);
        if (isNaN(numberValue)) {
            throw new Error(`value ${attributeValue.N} resolves to NaN when parsing using Number.parseFloat`);
        }
        return numberValue;
    }
    else {
        throw new Error(`there is no N(umber) value defined on given attribute value: ${JSON.stringify(attributeValue)}`);
    }
}
function numberToDb(modelValue) {
    if (!is_number_function_1.isNumber(modelValue)) {
        throw new Error(`this mapper only support values of type number, value given: ${JSON.stringify(modelValue)}`);
    }
    if (isNaN(modelValue)) {
        return null;
    }
    return { N: modelValue.toString() };
}
exports.NumberMapper = {
    fromDb: numberFromDb,
    toDb: numberToDb,
};
//# sourceMappingURL=number.mapper.js.map