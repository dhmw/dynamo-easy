"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module helper
 */
/**
 * Will resolve after given duration
 * @hidden
 */
function promiseDelay(duration) {
    return (arg) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(arg), duration);
        });
    };
}
exports.promiseDelay = promiseDelay;
//# sourceMappingURL=promise-delay.function.js.map