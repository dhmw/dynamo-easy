"use strict";
// copied from just-curry-it
Object.defineProperty(exports, "__esModule", { value: true });
function curry(fn, arity) {
    return function curried() {
        if (arity == null) {
            arity = fn.length;
        }
        const args = [].slice.call(arguments);
        if (args.length >= arity) {
            // @ts-ignore
            return fn.apply(this, args);
        }
        else {
            return function () {
                // @ts-ignore
                return curried.apply(this, args.concat([].slice.call(arguments)));
            };
        }
    };
}
exports.curry = curry;
//# sourceMappingURL=curry.function.js.map