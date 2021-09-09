import { ModelConstructor } from '../model/model-constructor';
/**
 * @hidden
 */
export declare type LogFn = (message: string, data?: any) => void;
export declare type OptModelLogFn = (message: string, modelConstructor: ModelConstructor<any> | undefined | null, data?: any) => void;
/**
 * @hidden
 */
export interface Logger {
    warn: LogFn;
    info: LogFn;
    debug: LogFn;
    verbose: LogFn;
}
/**
 * @hidden
 */
export interface OptModelLogger {
    warn: OptModelLogFn;
    info: OptModelLogFn;
    debug: OptModelLogFn;
    verbose: OptModelLogFn;
}
/**
 * @hidden
 */
export declare function createLogger(className: string, modelConstructor: ModelConstructor<any>): Logger;
/**
 * @hidden
 */
export declare function createOptModelLogger(className: string): OptModelLogger;
