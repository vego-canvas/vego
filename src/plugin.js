import { isCanvasComponent } from './util/common.js';
import { VegoGeoWatcher } from './core/vegoWatcher';
import { queueUpdate } from './util/Engine';
import canvasFac from './core/canvas.js';
import VegoComponent from './core/VegoComponent';
import Easing from './util/Easing';
import SpriteSheet from './core/SpriteSheet.vue';
// import { DisplayObject } from
import {
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
        options = Object.assign({
            enableMouseOver: 16,
            enableTouch: false,
            plugins: [],
        }, options);
        Vue.mixin({
            mixins: options.plugins ? options.plugins.map((p) => p.global).filter((p) => !!p) : [],
            data() {
                return {
                    vegoDisplayObject: undefined,
                };
            },
            mounted() {
                this.canvasParent = isCanvasComponent(this);
                this.isCanvasComponent = !!this.canvasParent;
            },

            destroy() {
                this.vegoWatcher = null;
                this.vegoDisplayObject = null;
            },

            updated() {
                if (this.isCanvasComponent) {
                    this.updateVegoChildren();
                }
            },

            methods: {
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
        Vue.component('vego-canvas', canvasFac(options));
        options.plugins && options.plugins.forEach((p) => {
            p.install && p.install(Vue);
        });
    },
};

export {
    VegoComponent,
    Easing,
    SpriteSheet,
};
