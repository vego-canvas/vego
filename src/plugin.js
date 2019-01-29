import { isCanvasComponent } from './util/common.js';
import VegoWatcher, { VegoGeoWatcher } from './core/vegoWatcher';
import { queueUpdate } from './util/Engine';
import canvasFac from './core/canvas.js';
import VegoComponent from './core/VegoComponent';
import Easing from './util/Easing';
// import { DisplayObject } from
import {
    DisplayObject,
    TweenMixin,
} from 'vegocore';
export default {
    install(Vue, options = {
        enableMouseOver: 16,
    }) {
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
                    // console.log(this.$vnode.tag, 'draw line?');
                    this.vegoGeoWatcher = new VegoGeoWatcher(this._uid);
                    this.vegoGeoWatcher.update = () => {
                        this.vegoDisplayObject._appendTransform();
                    };
                    this.updateVegoChildren();
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
            updated() {
                if (this.isCanvasComponent) {
                    this.updateVegoChildren();
                }
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
                    // combine children
                    let VueChildren = this.$slots.default ? this.$slots.default.concat(this.$children) : this.$children;
                    // console.log(VueChildren);// VueChildren.map((node) => node.componentInstance));
                    if (!VueChildren)
                        VueChildren = [];
                    // TODO 优化子节点变换方法！
                    let idx = 0;
                    let lastUniqueId;
                    VueChildren.map((node) => node.componentInstance || node)
                        .filter((i) => i._uid)
                        .sort((a, b) => b._uid - a._uid)
                        .forEach((child) => {
                            if (lastUniqueId === child._uid || !child.vegoDisplayObject)
                                return;

                            lastUniqueId = child._uid;
                            child.vegoDisplayObject.$parent = target;
                            vegoChildren[idx++] = child.vegoDisplayObject;
                            // console.log(child.vegoDisplayObject.$parent, child.vegoDisplayObject);
                        });

                    vegoChildren.length = this.$children.length;
                },
                getVegoDisplayObject(comp) {
                    return comp.vegoDisplayObject;
                },
            },
        });
        TweenMixin(Vue.prototype);
        const p = Vue.prototype._render;
        Vue.prototype._render = function () {
            if (this.isCanvasComponent) {
                const vnode = this.$options.render.call(this._renderProxy, this.$createElement);
                // just bind draw function to watcher, figure out better method!
                this.vegoDisplayObject._update();
                queueUpdate(this.vegoWatcher);
                // if (this._e && (vnode.data.attrs && !vnode.data.attrs.hasOwnProperty('canvascontainer'))) {
                //     return this._e(); // createEmptyNode
                // }
                return vnode;
            } else {
                return p.call(this);
            }
        };
        Vue.component('vego-canvas', canvasFac(options));
        // Vue.component('vego-container', container);
        // Vue.component('vego-sprite-sheet', spritesheet);
    },
};

export {
    VegoComponent,
    Easing,
};
