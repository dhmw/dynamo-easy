"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module logger
 */
/**
 * LogLevel
 */
var LogLevel;
(function (LogLevel) {
    // ERROR = 1, // currently not used, since errors are thrown
    LogLevel[LogLevel["WARNING"] = 2] = "WARNING";
    LogLevel[LogLevel["INFO"] = 3] = "INFO";
    LogLevel[LogLevel["DEBUG"] = 4] = "DEBUG";
    LogLevel[LogLevel["VERBOSE"] = 5] = "VERBOSE";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
//# sourceMappingURL=log-level.type.js.map