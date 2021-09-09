/**
 * @module helper
 */
/**
 * Will resolve after given duration
 * @hidden
 */
export function promiseDelay(duration) {
    return (arg) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(arg), duration);
        });
    };
}
//# sourceMappingURL=promise-delay.function.js.map