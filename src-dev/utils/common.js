export function isFunction(t) {
    return t && Object.prototype.toString.call(t) === '[object Function]';
}

export function isCanvasComponent(vm) {
    let t = vm.$parent;
    if (!t)
        return false;
    do {
        if (t.isVegoCanvas)
            return t;
        t = t.$parent;
    } while (t);
    return false;
}

export function hexToRGB(hex) {
    const r = hex >> 16;
    const g = hex >> 8 & 0xFF;
    const b = hex & 0xFF;
    return [r, g, b];
}

export function isPureObject(obj) {
    return (obj.constructor && obj.constructor === Object);
}
