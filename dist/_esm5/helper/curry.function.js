// copied from just-curry-it
export function curry(fn, arity) {
    return function curried() {
        if (arity == null) {
            arity = fn.length;
        }
        var args = [].slice.call(arguments);
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
//# sourceMappingURL=curry.function.js.map