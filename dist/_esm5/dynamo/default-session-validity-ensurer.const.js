/**
 * A simple no-op function which tells that we always have a valid session, which obviously requires some valid
 * session checking and also renewing of a potentially expired (or non existing) session
 */
export var DEFAULT_SESSION_VALIDITY_ENSURER = function () { return Promise.resolve(); };
//# sourceMappingURL=default-session-validity-ensurer.const.js.map