"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module helper
 */
/**
 * returns a random value from an increasing range by each iteration.
 */
function* randomExponentialBackoffTimer() {
    let i = 0;
    while (true) {
        yield (Math.pow(2, Math.round(Math.random() * ++i)) - 1) / 2;
    }
}
exports.randomExponentialBackoffTimer = randomExponentialBackoffTimer;
//# sourceMappingURL=random-exponential-backoff-timer.generator.js.map