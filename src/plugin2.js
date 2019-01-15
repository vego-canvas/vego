import { isCanvasComponent } from './util/common.js';
import VegoWatcher, { VegoGeoWatcher } from './proto/VegoWatcher';
import { queueUpdate } from './util/Engine';
import canvas from './core/canvas.vue';
// import { DisplayObject } from
import {
    DisplayObject,
} from 'vegocore';
export default {
    install(Vue) {
        Vue.mixin({
            data() {
                return {
                    vegoDisplayObject: undefined,
                };
            },
            mounted() {
                this.isCanvasComponent = isCanvasComponent(this);
                if (this.isCanvasComponent) {
                    const vegoDisplayObject = new DisplayObject(this._uid, this.$options.draw.bind(this));
                    this.$set(this, 'vegoDisplayObject', vegoDisplayObject);
                    this.vegoDisplayObject._update();
                    this.vegoGeoWatcher = new VegoGeoWatcher(this._uid);
                    this.vegoGeoWatcher.update = () => {
                        this.vegoDisplayObject._appendTransform();
                    };
                    this.$watch('vegoDisplayObject.$geometry', () => {
                        queueUpdate(this.vegoGeoWatcher);
                        queueUpdate(this.vegoWatcher);
                    }, { deep: true });
                }
                this.vegoWatcher = Object.freeze(new VegoWatcher(`geo_${this._uid}`));
            },
            destroy() {
                this.vegoWatcher = null;
                this.vegoGeoWatcher = null;
                this.vegoDisplayObject = null;
            },
            methods: {
                // updateVegoParent() {
                //     const VueParent = this.$parent;
                //     const VegoParent = VueParent.vegoCanvas || VueParent.vegoDisplayObject;
                //     VegoParent.$children = VueParent.$children.map(this.getVegoDisplayObject);
                // },
                updateVegoChildren() {
                    const target = this.vegoCanvas || this.vegoDisplayObject;
                    const vegoChildren = target.$children;
                    let VueChildren = this.$slots.default;
                    // console.log(VueChildren.map((node) => node.componentInstance));
                    if (!VueChildren)
                        VueChildren = [];
                    // TODO 优化子节点变换方法！
                    VueChildren.map((node) => node.componentInstance)
                        .sort((a, b) => b._uid - a._uid)
                        .forEach((child, idx) => {
                            child.vegoDisplayObject.$parent = target;
                            // console.log(child.vegoDisplayObject.$parent, child.vegoDisplayObject);
                            vegoChildren[idx] = child.vegoDisplayObject;
                        });
                    vegoChildren.length = this.$children.length;
                },
                getVegoDisplayObject(comp) {
                    return comp.vegoDisplayObject;
                },
            },
        });
        const p = Vue.prototype._render;
        Vue.prototype._render = function () {
            if (this.isCanvasComponent) {
                const vnode = this.$options.render.call(this._renderProxy, this.$createElement);
                // just bind draw function to watcher, figure out better method!
                this.vegoDisplayObject._update();
                queueUpdate(this.vegoWatcher);
                if (this._e && (vnode.data.attrs && !vnode.data.attrs.hasOwnProperty('canvascontainer'))) {
                    return this._e(); // createEmptyNode
                }
                return vnode;
            } else {
                return p.call(this);
            }
        };
        Vue.component('vego-canvas', canvas);
        // Vue.component('vego-container', container);
        // Vue.component('vego-sprite-sheet', spritesheet);
    },
};
