import Layer from '../render/Layer';
import hitTest from '../util/hitTest';
// import EventResolver from '../event/EventResolver';
import { MouseEvent } from '../event/Event';
import { findmax } from '../util';
import Graphics from '../render/graphics';

export default class VegoCanvas extends Layer {
    constructor(canvas) {
        super();
        this.canvas = matchDevicePixelRatio(canvas);
        this.ctx = this.canvas.getContext('2d');
        this.ratio = getDevicePixelRatio();
        const graphic = new Graphics();
        Object.defineProperty(this, '$graphic', {
            value: graphic,
        })
    }

    render() {
        const ctx = this.ctx;
        const {
            width, height,
        } = this.canvas;
        const ratio = this.ratio;
        ctx.clearRect(0, 0, width + 1, height + 1);
        ctx.save();
        ctx.scale(ratio, ratio);
        this._render(ctx);
        ctx.restore();
    }

    getTargetsUnderPoint(x, y) {
        const targets = [];
        const ratio = getDevicePixelRatio();
        this._getTargets({
            x, y, targets,
            condition: (x, y, currentLayerMtx, graphic) => hitTest(x, y, currentLayerMtx, graphic, ratio),
        });
        return targets;
    }

    dispatchMouseEvent(target, options) {
        if (!target || !target._dispatch)
            return;
        const event = new MouseEvent(options);
        target._dispatch(event);
    }

    commonHandler(type, x, y) {
        const targets = this.getTargetsUnderPoint(x, y);
        const target = findmax(targets, 'uid');
        if (target) {
            this.dispatchMouseEvent(target, {
                x,
                y,
                type,
                target,
                bubble: false,
            });
        }
        return target;
    }

    moveHandler(x, y){
        const target = this.commonHandler('mousemove', x, y);
        if (this.oldTarget !== target) {
            this.dispatchMouseEvent(this.oldTarget, {
                x,
                y,
                type: 'mouseleave',
                target: this.oldTarget,
            });
            this.dispatchMouseEvent(target, {
                x,
                y,
                type: 'mouseenter',
                target,
            });
        }
        this.oldTarget = target;
    }
}

export function getNewCanvas() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    return {
        canvas,
        ctx,
    };
}

export function getDevicePixelRatio() {
    return window.devicePixelRatio || 1;
}

export function matchDevicePixelRatio(canvas) {
    const ratio = getDevicePixelRatio();
    const { width, height } = canvas;
    if (ratio !== 1) {
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
    } else {
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = '';
        canvas.style.height = '';
    }
    return canvas;
}
