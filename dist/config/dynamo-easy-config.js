"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module dynamo-easy
 */
const default_session_validity_ensurer_const_1 = require("../dynamo/default-session-validity-ensurer.const");
const default_table_name_resolver_const_1 = require("../dynamo/default-table-name-resolver.const");
const default_log_receiver_const_1 = require("../logger/default-log-receiver.const");
const date_to_string_mapper_1 = require("../mapper/custom/date-to-string.mapper");
/**
 * to update the config you must do it before importing any model, basically before anything else.
 * the config cannot be changed afterwards
 */
exports.dynamoEasyConfig = {
    dateMapper: date_to_string_mapper_1.dateToStringMapper,
    logReceiver: default_log_receiver_const_1.DEFAULT_LOG_RECEIVER,
    tableNameResolver: default_table_name_resolver_const_1.DEFAULT_TABLE_NAME_RESOLVER,
    sessionValidityEnsurer: default_session_validity_ensurer_const_1.DEFAULT_SESSION_VALIDITY_ENSURER,
};
//# sourceMappingURL=dynamo-easy-config.js.map