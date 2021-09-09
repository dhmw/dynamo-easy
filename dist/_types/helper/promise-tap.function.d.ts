/**
 * @module helper
 */
/**
 * mimics the tap operator from rxjs, will execute some side effect and return the input value
 * @hidden
 */
export declare function promiseTap<T>(tapFunction: (arg: T) => void): (arg: T) => Promise<T>;
