import { mat2d } from 'gl-matrix';
import hitTest from '../render/hitTest'
import MouseEvent from './mouseEvent'
const eventTypes = [
    'click',
    'mousemove',
    'mouseenter',
    'mouseleave',
    'mousedown',
    'pressmove',
    'mouseup'
]
let ratio = 1;
export default function(Vego){
    Vego.prototype._getTargets = function(x, y, targets, currentLayer, mtx){
        currentLayer = currentLayer || 0;
        mtx = mtx ? mat2d.multiply(mtx, mtx, this.$matrix): mat2d.clone(this.$matrix);
        const children = this.$children;
        if(hitTest(x, y, mtx, this.$graphic, ratio)){
            targets.push(this);
        }
        children.forEach(({comp, key}) => {
            comp._getTargets(x, y, targets, currentLayer + 1, mtx);
        })
    //     for (let i = l - 1; i >= 0; i--) {
    //         console.log(this);
    //       const child = children[i];

    //       if (child.$children.length > 0) {
    //         child._getTargets(x, y, targets, currentLayer + 1, mtx);
    //       }
    //       if(hitTest(x, y, mtx, this.$graphic)){
    //         targets.push(child);
    //       }
    //   }
    }

    Vego.prototype._dispatch = function(event) {
        this.$emit(event.type, event);
        if (event.bubble && !event.propagationStopped && this.$parent) {
            this.$parent._dispatch(event);
        }
    }
    Vego.prototype.$emit = function(type, event){
        if(this._listeners[type].length)
            this._listeners[type].forEach(f => f(event));
    }
    Vego.prototype.$regist = function(type, cb){
        if(eventTypes.indexOf(type)){
            this._listeners[type].push(cb);
        }
    }
}

export function initEvent(vm){

    const {
        handlers
    } = vm.$options;

    vm._listeners = {};
    eventTypes.forEach(t => vm._listeners[t] = []);

    const h = Object.keys(handlers);
    if(h.length > 0){

        h.forEach(k => {
            vm.$regist(k, handlers[k].bind(vm));
        })
    }

}
function dispatchMouseEvent(target, options) {
    if (!target || !target._dispatch)
        return;
    const event = new MouseEvent(options);
    target._dispatch(event);
}

function commonHandler(vm, type, offsetX, offsetY, event) {
    const targets = [];
    vm._getTargets(offsetX, offsetY, targets);
    const target = targets.sort((a, b) =>
    // last draw, high layer, bigger uid
        a._uid - b._uid
    )[0];
    if (target) {
        dispatchMouseEvent(target, {
            x: offsetX,
            y: offsetY,
            type,
            target,
            bubble: false
        });
    }
    // vm.$emit(`dom${type}`, event);
    return target;
}
export function injectEvent(canvas, vm, ratio){
    ratio = ratio;
    let _oldTarget = null;
    let _pinedTarget = null;
    canvas.addEventListener('mousedown', function(event) {
        const {
            offsetX,
            offsetY,
        } = event;

        const target = commonHandler(vm, 'mousedown', offsetX, offsetY, event);
        _pinedTarget = {
            anchorX: offsetX,
            anchorY: offsetY,
            target,
        };
    });
    canvas.addEventListener('mousemove', function(event){
        const {
            offsetX,
            offsetY,
        } = event;
        const target = commonHandler(vm, 'mousemove', offsetX, offsetY, event);

        if (_oldTarget !== target) {
            dispatchMouseEvent(_oldTarget, {
                x: offsetX,
                y: offsetY,
                type: 'mouseleave',
                target: _oldTarget,
            });
            dispatchMouseEvent(target, {
                x: offsetX,
                y: offsetY,
                type: 'mouseenter',
                target,
            });
        }

        if (_pinedTarget) {
            const {
                target,
                anchorX,
                anchorY,
            } = _pinedTarget;
            dispatchMouseEvent(target, {
                x: offsetX,
                y: offsetY,
                anchorX, anchorY,
                type: 'pressmove',
                target,
            });
        }
        _oldTarget = target;
    });
    canvas.addEventListener('mouseup', function(){
        vm._pinedTarget = null;
    })

}
