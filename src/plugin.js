import { isCanvasComponent } from './util/common.js';
import { VegoGeoWatcher } from './core/vegoWatcher';
import { queueUpdate } from './util/Engine';
import canvasFac from './core/canvas.js';
import VegoComponent from './core/VegoComponent';
import Easing from './util/Easing';
import SpriteSheet from './core/SpriteSheet.vue';
// import { DisplayObject } from
import {
    DisplayObject,
    TweenMixin,
} from 'vegocore';
export { default as d3Geo } from './plugins/d3.geo.js';
export { default as d3Shape } from './plugins/d3.shape.js';
export default {
    install(Vue, options = {
        enableMouseOver: 16,
        enableTouch: false,
        plugins: [],
    }) {
        Vue.mixin({
            mixins: options.plugins ? options.plugins.map((p) => p.global).filter((p) => !!p) : [],
            data() {
                return {
                    vegoDisplayObject: undefined,
                };
            },
            mounted() {
                const canvas = isCanvasComponent(this);
                this.isCanvasComponent = !!canvas;
                if (this.isCanvasComponent) {
                    this.canvasWatcher = canvas.vegoRenderWatcher;
                    const vegoDisplayObject = new DisplayObject(
                        this._uid,
                        this.$options.draw.bind(this),
                        this.$options.afterDraw && this.$options.afterDraw.bind(this));
                    this.$set(this, 'vegoDisplayObject', vegoDisplayObject);
                    // this.vegoDisplayObject._update();
                    // console.log(this.$vnode.tag, 'draw line?');
                    this.vegoGeoWatcher = new VegoGeoWatcher(`geo_${this._uid}`);
                    this.vegoGeoWatcher.update = () => {
                        // console.log('transform done');
                        this.vegoDisplayObject._appendTransform();
                    };
                    this.updateVegoChildren();
                    this.$watch('vegoDisplayObject.$geometry', () => {
                        // console.log('queueUpdate(this.vegoGeoWatcher);');
                        queueUpdate(this.vegoGeoWatcher);
                        // console.log('queueUpdate(this.vegoWatcher);');
                        queueUpdate(this.canvasWatcher);
                    }, { deep: true });
                }
                // this.vegoWatcher = Object.freeze(new VegoWatcher());
            },

            destroy() {
                this.vegoWatcher = null;
                // this.vegoGeoWatcher = null;
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
                    let VueChildren = this.$children; // 其实不需要处理 slots 最后都会被放进$children
                    // console.log(this.$children);
                    // console.log(target.uid, VueChildren);// VueChildren.map((node) => node.componentInstance));
                    if (!VueChildren)
                        VueChildren = [];
                    // TODO 优化子节点变换方法！
                    if (VueChildren.length === 0) {
                        target.$children = [];
                    } else {
                        let idx = 0;
                        let lastUniqueId;
                        VueChildren
                            // .map((node) => node.componentInstance || node)
                            // .filter((i) => i._uid)
                            .sort((a, b) => a._uid - b._uid)
                            .forEach((child) => {
                                if (lastUniqueId === child._uid || !child.vegoDisplayObject)
                                    return;

                                lastUniqueId = child._uid;
                                child.vegoDisplayObject.$parent = target;
                                vegoChildren[idx++] = child.vegoDisplayObject;
                                // console.log(child.vegoDisplayObject.$parent, child.vegoDisplayObject);
                            });
                        vegoChildren.length = idx;
                    }
                    // console.log(vegoChildren);
                    // console.log('update length');

                    // console.log('updateVegoChildren');
                    // console.log(this.canvasWatcher);
                    queueUpdate(this.vegoRenderWatcher || this.canvasWatcher);
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
                // this.vegoDisplayObject._update();
                queueUpdate(this.canvasWatcher);
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
        options.plugins.forEach((p) => {
            p.install && p.install(Vue);
        });
    },
};

export {
    VegoComponent,
    Easing,
    SpriteSheet,
};
