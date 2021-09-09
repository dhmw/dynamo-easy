/**
 * @module helper
 */
/**
 * Will resolve after given duration
 * @hidden
 */
export declare function promiseDelay<T>(duration: number): (arg: T) => Promise<T>;
