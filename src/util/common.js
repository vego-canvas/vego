export function isFunction(t) {
    return t && Object.prototype.toString.call(t) === '[object Function]';
}

export function findContainer(vm) {
    let t = vm.$parent;
    while (t && !t.stack) {
        t = t.$parent;
    }
    return t;
}
export function findEventDispacher(vm) {
    let t = vm.$parent;
    while (t && !t.eventDispacher) {
        t = t.$parent;
    }
    return t;
}

export function findCanvas(vm) {
    let t = vm.$parent;
    while (t && t.$el.tagName !== 'CANVAS') {
        t = t.$parent;
    }
    return t;
}
export function isCanvasVnode(vm) {
    return vm.$options.draw && isFunction(vm.$options.draw);
}

export function isCanvasComponent(vm) {
    let t = vm.$parent;
    if (!t)
        return false;
    do {
        if ('vegoCanvas' in t)
            return t;
        t = t.$parent;
    } while (t);
    return false;
}
export function isCanvasComponentV2(vm) {
    let t = vm.$parent;
    if (!t)
        return false;
    do {
        if (t.$vnode && /vego-canvas$/.test(t.$vnode.tag))
            return true;
        t = t.$parent;
    } while (t);
    return false;
}
export function isCanvasComponentGen() {
    let result;
    return function (vm) {
        if (result !== undefined)
            return result;

        let t = vm.$parent;

        while (t && t.tagName !== 'CANVAS') {
            t = t.$parent;
        }

        if (!!t && t.tagName === 'CANVAS') {
            result = true;
        } else {
            result = false;
        }

        return result;
    };
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
