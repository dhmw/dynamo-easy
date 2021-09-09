"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module logger
 * @preferred
 *
 * Logger used in dynamo-easy
 */
const dynamo_easy_config_1 = require("../config/dynamo-easy-config");
const log_level_type_1 = require("./log-level.type");
/**
 * @hidden
 */
function getLogFn(className, modelConstructor, level) {
    return (message, data) => {
        dynamo_easy_config_1.dynamoEasyConfig.logReceiver({
            className,
            modelConstructor,
            level,
            message,
            data,
            timestamp: Date.now(),
        });
    };
}
/**
 * @hidden
 */
function getOptModelLogFn(className, level) {
    return (message, modelConstructor, data) => {
        dynamo_easy_config_1.dynamoEasyConfig.logReceiver({
            className,
            modelConstructor: (modelConstructor && modelConstructor.name) || 'NO_MODEL',
            level,
            message,
            data,
            timestamp: Date.now(),
        });
    };
}
/**
 * @hidden
 */
function createLogger(className, modelConstructor) {
    return {
        warn: getLogFn(className, modelConstructor.name, log_level_type_1.LogLevel.WARNING),
        info: getLogFn(className, modelConstructor.name, log_level_type_1.LogLevel.INFO),
        debug: getLogFn(className, modelConstructor.name, log_level_type_1.LogLevel.DEBUG),
        verbose: getLogFn(className, modelConstructor.name, log_level_type_1.LogLevel.VERBOSE),
    };
}
exports.createLogger = createLogger;
/**
 * @hidden
 */
function createOptModelLogger(className) {
    return {
        warn: getOptModelLogFn(className, log_level_type_1.LogLevel.WARNING),
        info: getOptModelLogFn(className, log_level_type_1.LogLevel.INFO),
        debug: getOptModelLogFn(className, log_level_type_1.LogLevel.DEBUG),
        verbose: getOptModelLogFn(className, log_level_type_1.LogLevel.VERBOSE),
    };
}
exports.createOptModelLogger = createOptModelLogger;
//# sourceMappingURL=logger.js.map