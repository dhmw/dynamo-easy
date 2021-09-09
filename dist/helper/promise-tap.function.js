"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module helper
 */
/**
 * mimics the tap operator from rxjs, will execute some side effect and return the input value
 * @hidden
 */
function promiseTap(tapFunction) {
    return (arg) => {
        tapFunction(arg);
        return Promise.resolve(arg);
    };
}
exports.promiseTap = promiseTap;
//# sourceMappingURL=promise-tap.function.js.map