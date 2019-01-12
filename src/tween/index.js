import { isPureObject, isFunction } from '../util/common';
const nextFrame = window.requestAnimationFrame;
class Tweenlet {
    constructor(start, end, scope, key) {
        this.start = start;
        this.end = end;
        this.span = end - start;
        this.value = start;
        this.setValue = () => {
            scope[key] = this.value;
        };
    }
    reset({
        start, end,
    }) {
        if (start !== undefined) {
            this.start = start;
        }
        if (end !== undefined) {
            this.end = end;
        }
        this.span = end - start;
        this.value = start;
        return this;
    }
    run(step) {
        this.value = this.start + step * this.span;
        this.setValue();
    }
    theEnd() {
        this.value = this.end;
        this.setValue();
    }
}
// Tween 要解决的问题：
// 1、值变化 2、中断动画时
function loop(t) {

}
class Tween {
    constructor(duration, easing) {
        if (!isFunction(easing))
            throw 'easing need to be a function';

        this.tweenlets = new Map();
        this.duration = duration;
        this.easing = easing;

        this._begin = null;
        this._end = null;
        this._pause = false;
        this._next = null;
    }
    addTweenlet(tweenlet, prefix) {
        if (this.tweenlets.has(prefix)) {
            const curr = this.tweenlets.get(prefix).value;
            this.tweenlets.set(prefix, tweenlet.reset({
                start: curr,
            }));
        } else {
            this.tweenlets.set(prefix, tweenlet);
        }
    }
    _animate(t, res) {
        if (!this._begin) {
            this._begin = t;
            this._end = t + this.duration;
        }
        if (t > this._end) {
            this.tweenlets.forEach((i) => i.theEnd());
            res();
            return;
        }
        const ratio = this.easing((t - this._begin) / this.duration);
        this.tweenlets.forEach((i) => i.run(ratio));
        nextFrame((t) => {
            this._animate(t, res);
        });
    }

    run() {
        return new Promise((res, rej) => {
            nextFrame((t) => {
                this._animate(t, res);
            });
        });
    }
}
function isPrimary(obj) {
    return ['number', 'boolean', 'string', 'undefined'].indexOf(typeof obj) !== -1;
}
function walkInProps(props, tw, prefix) {
    // if(Array.isArray(props)){
    //     for (const k in props) {

    //     }
    // }
    if (!isPrimary(props)) {
        // throw 'need a object root from top scope';
        for (const k in props) {
            if (!this.hasOwnProperty(k))
                continue;
            const end = props[k];
            const curr = this[k];
            const endIsPrimary = isPrimary(end);
            const currIsPrimary = isPrimary(curr);

            if (!endIsPrimary && !currIsPrimary)
                walkInProps.call(curr, end, tw, `${k}.`);
            if (endIsPrimary && currIsPrimary && typeof end === typeof curr) {
                tw.addTweenlet(
                    new Tweenlet(curr, end, this, k),
                    `${prefix || ''}.${k}`);
            }
        }
    }
}
export default function TweenMixin(Vego) {
    Vego.prototype.$to = function (props, duration, easing) {
        const tween = new Tween(duration, easing);
        walkInProps.call(this, props, tween);
        return tween.run();
    };
}
