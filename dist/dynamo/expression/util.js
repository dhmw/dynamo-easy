"use strict";
/**
 * @module expression
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @hidden
 */
function dynamicTemplate(templateString, templateVariables) {
    const keys = Object.keys(templateVariables);
    const values = Object.values(templateVariables);
    // tslint:disable-next-line:function-constructor
    const templateFunction = new Function(...keys, `return \`${templateString}\`;`);
    return templateFunction(...values);
}
exports.dynamicTemplate = dynamicTemplate;
//# sourceMappingURL=util.js.map