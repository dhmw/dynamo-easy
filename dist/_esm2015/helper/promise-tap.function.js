/**
 * @module helper
 */
/**
 * mimics the tap operator from rxjs, will execute some side effect and return the input value
 * @hidden
 */
export function promiseTap(tapFunction) {
    return (arg) => {
        tapFunction(arg);
        return Promise.resolve(arg);
    };
}
//# sourceMappingURL=promise-tap.function.js.map