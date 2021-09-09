/**
 * @module helper
 */
/**
 * Will resolve after given duration
 * @hidden
 */
export function promiseDelay(duration) {
    return function (arg) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () { return resolve(arg); }, duration);
        });
    };
}
//# sourceMappingURL=promise-delay.function.js.map