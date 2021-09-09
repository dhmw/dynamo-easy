/**
 * @module logger
 * @preferred
 *
 * Logger used in dynamo-easy
 */
import { dynamoEasyConfig } from '../config/dynamo-easy-config';
import { LogLevel } from './log-level.type';
/**
 * @hidden
 */
function getLogFn(className, modelConstructor, level) {
    return function (message, data) {
        dynamoEasyConfig.logReceiver({
            className: className,
            modelConstructor: modelConstructor,
            level: level,
            message: message,
            data: data,
            timestamp: Date.now(),
        });
    };
}
/**
 * @hidden
 */
function getOptModelLogFn(className, level) {
    return function (message, modelConstructor, data) {
        dynamoEasyConfig.logReceiver({
            className: className,
            modelConstructor: (modelConstructor && modelConstructor.name) || 'NO_MODEL',
            level: level,
            message: message,
            data: data,
            timestamp: Date.now(),
        });
    };
}
/**
 * @hidden
 */
export function createLogger(className, modelConstructor) {
    return {
        warn: getLogFn(className, modelConstructor.name, LogLevel.WARNING),
        info: getLogFn(className, modelConstructor.name, LogLevel.INFO),
        debug: getLogFn(className, modelConstructor.name, LogLevel.DEBUG),
        verbose: getLogFn(className, modelConstructor.name, LogLevel.VERBOSE),
    };
}
/**
 * @hidden
 */
export function createOptModelLogger(className) {
    return {
        warn: getOptModelLogFn(className, LogLevel.WARNING),
        info: getOptModelLogFn(className, LogLevel.INFO),
        debug: getOptModelLogFn(className, LogLevel.DEBUG),
        verbose: getOptModelLogFn(className, LogLevel.VERBOSE),
    };
}
//# sourceMappingURL=logger.js.map