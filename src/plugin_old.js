import { isCanvasComponentGen } from './util/common.js';
import canvas from './canvas.vue';
import container from './core/container.vue';
import spritesheet from './core/spriteSheet.vue';
import EventDispatcher from './proto/eventDispatcher.js';
import DrawStack from './proto/drawStack.js';
// import tweenMixin from './proto/tweenMixin.js';
import tweenMixin from './tween';
import { symb } from './util/Matrix2D';
import VegoWatcher from './proto/VegoWatcher';
import { queueUpdate } from './util/Engine';
const VNODE = Symbol('_vCanvasNode');

// 非透明的元素
function _testHit(ctx) {
    return ctx.getImageData(0, 0, 1, 1).data[3] > 1;
}

const plugin = {
    install(Vue, options) {
        Vue.mixin({
            mixins: [EventDispatcher, DrawStack],
            created() {
                this.isCanvasComponent = isCanvasComponentGen();
                if (this.isCanvasComponent(this)) {
                    this[symb] = this.$parent[symb];
                }
                this.vegoWatcher = new VegoWatcher(this._uid);
            },
            mounted() {
                if (this.isCanvasComponent(this)) {
                    const canvas = this._hitTestCanvas = document.createElement('canvas');
                    this._hitTestContext = canvas.getContext('2d');
                    canvas.width = canvas.height = 1;
                }
            },
            destroyed() {
                if (this.isCanvasComponent(this)) {
                    this._hitTestCanvas = null;
                    this._hitTestContext = null;
                }
            },
            methods: {
                _hitTest(x, y) {
                    const ratio = window.devicePixelRatio || 1;

                    const ctx = this._hitTestContext;
                    const m = this.$parent[symb].clone().prepend(1, 0, 0, 1, -x * ratio, -y * ratio);
                    ctx.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                    this.$options.draw.call(this, ctx);

                    const hit = _testHit(ctx);
                    ctx.setTransform();
                    ctx.clearRect(0, 0, 2, 2);

                    return hit;
                },
            },
        });

        const p = Vue.prototype._render;
        Vue.prototype._render = function () {
            if (this.isCanvasComponent(this)) {
                const vnode = this.$options.render.call(this._renderProxy, this.$createElement);
                // just bind draw function to watcher, figure out better method!
                try {
                    this.$options.draw.call(this);
                } catch (error) {

                }
                queueUpdate(this.vegoWatcher);
                this[VNODE] = vnode;
                if (this._e && (vnode.data.attrs && !vnode.data.attrs.hasOwnProperty('canvascontainer'))) {
                    return this._e(); // createEmptyNode
                }
                return vnode;
            } else {
                return p.call(this);
            }
        };
        tweenMixin(Vue);
        Vue.component('vego-canvas', canvas);
        Vue.component('vego-container', container);
        Vue.component('vego-sprite-sheet', spritesheet);
    },
};

export default plugin;
// export {
//     tweenMixin,
// };
