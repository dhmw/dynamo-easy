import * as tslib_1 from "tslib";
/**
 * @module helper
 */
/**
 * returns a random value from an increasing range by each iteration.
 */
export function randomExponentialBackoffTimer() {
    var i;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                i = 0;
                _a.label = 1;
            case 1:
                if (!true) return [3 /*break*/, 3];
                return [4 /*yield*/, (Math.pow(2, Math.round(Math.random() * ++i)) - 1) / 2];
            case 2:
                _a.sent();
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/];
        }
    });
}
//# sourceMappingURL=random-exponential-backoff-timer.generator.js.map