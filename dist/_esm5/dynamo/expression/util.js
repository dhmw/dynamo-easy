/**
 * @module expression
 */
import * as tslib_1 from "tslib";
/**
 * @hidden
 */
export function dynamicTemplate(templateString, templateVariables) {
    var keys = Object.keys(templateVariables);
    var values = Object.values(templateVariables);
    // tslint:disable-next-line:function-constructor
    var templateFunction = new (Function.bind.apply(Function, tslib_1.__spread([void 0], keys, ["return `" + templateString + "`;"])))();
    return templateFunction.apply(void 0, tslib_1.__spread(values));
}
//# sourceMappingURL=util.js.map