import Easing from '../util/Easing.js';
import Ticker from '../proto/ticker.js';

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

class Tween extends Map {
    constructor(callback, duration, easing) {
        super();

        this.callback = callback;
        if (typeof easing === 'string') {
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
            const t = new Tweenlet(lastKey, oldval, val);
            vm[TWEEN].set(lastKey, t);
            vm[TWEEN].pause = false;
        });
    }
}

export default {
    props: ['tween'],
    mounted() {
        const {
            duration,
            easing,
            observe,

        } = this.tween;
        this[TWEEN] = new Tween(TickInTweens.bind(this), duration, easing);

        const drawCtx = {};

        this.$options.dataKeysInDraw.forEach((k) => {
            drawCtx[k] = clone(this[k]);
            if (observe.indexOf(k) !== -1) {
                watch(this, drawCtx[k], k);
            } else {
                this.$watch(k, (val, oldval) => {
                    drawCtx[k] = val;
                });
            }
        });
        this[TWEEN].origin = drawCtx;
        Ticker.regist(this[TWEEN]);
        this._renderCtx = drawCtx;
    },

};
