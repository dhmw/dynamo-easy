/**
 * @module logger
 */
/**
 * LogLevel
 */
export var LogLevel;
(function (LogLevel) {
    // ERROR = 1, // currently not used, since errors are thrown
    LogLevel[LogLevel["WARNING"] = 2] = "WARNING";
    LogLevel[LogLevel["INFO"] = 3] = "INFO";
    LogLevel[LogLevel["DEBUG"] = 4] = "DEBUG";
    LogLevel[LogLevel["VERBOSE"] = 5] = "VERBOSE";
})(LogLevel || (LogLevel = {}));
//# sourceMappingURL=log-level.type.js.map