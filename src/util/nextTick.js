const callbacks = [];
let pending = false;

function flushCallbacks() {
    pending = false;
    const copies = callbacks.slice(0);
    callbacks.length = 0;
    for (let i = 0; i < copies.length; i++) {
        copies[i]();
    }
    // Vego.Engine.run();
}

let microTimerFunc;
let macroTimerFunc;
let useMacroTask = false;

if (typeof setImmediate !== 'undefined') {
    macroTimerFunc = () => {
        setImmediate(flushCallbacks);
    };
} else {
    /* istanbul ignore next */
    macroTimerFunc = () => {
        setTimeout(flushCallbacks, 0);
    };
}

if (typeof Promise !== 'undefined') {
    const p = Promise.resolve();
    microTimerFunc = () => {
        p.then(flushCallbacks);
    };
} else {
    // fallback to macro
    microTimerFunc = macroTimerFunc;
}

export function withMacroTask(fn) {
    return fn._withTask || (fn._withTask = function () {
        useMacroTask = true;
        const res = fn(...arguments);
        useMacroTask = false;
        return res;
    });
}

export function nextTick(cb, ctx) {
    let _resolve;
    callbacks.push(() => {
        if (cb) {
            cb.call(ctx);
        } else if (_resolve) {
            _resolve(ctx);
        }
    });
    if (!pending) {
        pending = true;
        if (useMacroTask) {
            macroTimerFunc();
        } else {
            microTimerFunc();
        }
    }

    if (!cb && typeof Promise !== 'undefined') {
        return new Promise((resolve) => {
            _resolve = resolve;
        });
    }
}
