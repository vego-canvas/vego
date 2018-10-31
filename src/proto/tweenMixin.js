import Easing from '../util/Easing.js';
import Ticker from '../proto/ticker.js';
import { hexToRGB } from '../util/common';

class Tweenlet {
    constructor(ob, from, to) {
        this.from = from;
        this.to = to;
        this.ob = ob;
        this.span = to - from; // TODO span in color
    }

    tick(t, easing, begin, duration) {
        const expo = easing((t - begin) / duration);
        return this.span * expo + this.from;
    }
    end() {
        return this.to;
    }
}

class TweenletColor {
    constructor(ob, from, to) {
        this.from = this.translateColor(from);
        this.to = this.translateColor(to);
        this.ob = ob;
        this.span = this.calculateDistance(this.to, this.from);
    }
    calculateDistance(colorArray1, colorArray2) {
        return colorArray1.map((c, i) => c - colorArray2[i]);
    }
    translateColor(color) {
        if (/rgb/.test(color)) {
            const result = /rgb\(([\d,\s]+)\)/.exec(color);
            if (result) {
                return result[1].split(',').map((p) => +p);
            }
        }
        if (/#[0-9a-fA-F]{3,6}/.test(color)) {
            let hex = /#([0-9a-fA-F]{3,6})/.exec(color)[1];
            if (hex.length === 3) {
                hex = hex.split('').map((c) => `${c}${c}`).join('');
            }
            if (hex.length !== 6) {
                throw new Error('Wrong color format!');
            }
            return hexToRGB(`0x${hex}`);
        }
    }

    formatRGB([r, g, b]) {
        return `rgb(${r},${g},${b})`;
    }

    tick(t, easing, begin, duration) {
        const expo = easing((t - begin) / duration);

        return this.formatRGB(this.span.map((c, i) => c * expo + this.from[i]));
    }
    end() {
        return this.formatRGB(this.to);
    }
}

class Tween extends Map {
    constructor(callback, duration, easing) {
        super();

        this.callback = callback;
        if (typeof easing === 'string') {
            if (!Easing[easing])
                throw new Error(`${easing} function not founded!`);
            this.easing = Easing[easing];
        } else {
            this.easing = easing;
        }

        this.duration = duration;

        this.begin = undefined;
        this.end = undefined;
        this.pause = true;
        this.origin = undefined;
    }

    tick(t) {
        if (this.pause)
            return;

        if (!this.begin) {
            this.begin = t;
            this.end = t + this.duration;
        }
        if (t > this.end) {
            this.reset();
            const newCtx = this.origin;
            this.forEach((tw) => {
                // same
                const newV = tw.end();
                walkInTween(tw, newCtx, newV);
            });
            this.callback(newCtx, true);
            return;
        }
        const newCtx = this.origin;
        this.forEach((tw) => {
            // same
            const newV = tw.tick(t, this.easing, this.begin, this.duration);
            walkInTween(tw, newCtx, newV);
        });
        this.callback(newCtx);
    }
    reset() {
        this.begin = undefined;
        this.end = undefined;
        this.pause = true;
    }
}

function walkInTween(tweenlet, ctx, newV) {
    const keychain = tweenlet.ob.split('.');
    let i = 0;
    const l = keychain.length - 1;
    let k;
    let accu = ctx;
    let knext;
    // go down to the property
    for (;i < l; i++) {
        k = keychain[i];
        knext = keychain[i + 1];

        if (/^\d+$/.test(knext)) {
            if (!accu[k])
                accu[k] = [];
            accu = accu[k];
            continue;
        }
        if (!accu[k])
            accu[k] = {};
        accu = accu[k];
    }
    // set new value to property
    accu[keychain[i]] = newV;
}

const TickInTweens = function (newCtx, flag) {
    Object.keys(newCtx).forEach((k) => this._renderCtx[k] = newCtx[k]);
    if (flag) {
        this.$emit('tweenend');
    }
};

const TWEEN = Symbol('_tween');

const clone = function (a) {
    if (typeof a === 'object') {
        return JSON.parse(JSON.stringify(a));
    } else {
        return a;
    }
};

function watch(vm, target, lastKey) {
    if (typeof target === 'object') {
        if (Array.isArray(target)) {
            target.forEach((k, i) => {
                watch(vm, k, `${lastKey}.${i}`);
            });
        } else {
            for (const k of Object.keys(target)) {
                watch(vm, target[k], `${lastKey}.${k}`);
            }
        }
    } else {
        vm.$watch(lastKey, (val, oldval) => {
            let t = null;
            if (/rgb/.test(val) || /#[0-9a-fA-F]{3,6}/.test(val)) {
                t = new TweenletColor(lastKey, oldval, val);
            } else {
                t = new Tweenlet(lastKey, oldval, val);
            }
            vm[TWEEN].set(lastKey, t);
            vm[TWEEN].pause = false;
        });
    }
}

export default {
    props: {
        tween: Object,
    },
    mounted() {
        if (!this.tween)
            return;
        const {
            duration,
            easing,
            observe,
        } = this.tween;

        this[TWEEN] = new Tween(TickInTweens.bind(this), duration, easing);

        const drawCtx = {};
        console.log(this.$options.propsData);
        const keys = Object.keys(this.$options.propsData);
        const propsData = this.$options.propsData;
        keys.filter((k) => k !== 'tween').forEach((k) => {
            drawCtx[k] = clone(propsData[k]);
            if (observe.indexOf(k) !== -1) {
                watch(this, drawCtx[k], k);
            } else {
                this.$watch(k, (val) => {
                    drawCtx[k] = val;
                });
            }
        });
        this[TWEEN].origin = drawCtx;
        Ticker.regist(this[TWEEN]);
        this._renderCtx = drawCtx;
    },

};
