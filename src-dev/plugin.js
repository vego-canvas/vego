import { queueUpdate } from './utils/Engine';
import canvasFac from './vego-canvas.js';
export { default as VegoBaseComponent } from './component/VegoBaseComponent';
export { default as VegoTextComponent } from './component/VegoTextComponent';

import { default as VegoTextComponent } from './component/VegoTextComponent';
export default {
    install(Vue, options = {}) {
        options = Object.assign({
            enableMouseOver: 16,
            enableTouch: false,
            plugins: [],
        }, options);

        Vue.mixin({
            // mounted() {
            //     this.canvasParent = isCanvasComponent(this);

            //     this.isCanvasComponent = !!this.canvasParent;
            //     console.log(this.isCanvasComponent);
            // },
            destroyed() {
                this.vegoInstance.destroy();
                this.vegoInstance = null;
            },
            updated() {
                if (this.isCanvasComponent) {
                    this.updateVegoChildren();
                }
            },
            methods: {
                updateVegoChildren() {
                    const target = this.vegoInstance;
                    const vegoChildren = target.$children;
                    // combine children
                    let VueChildren = this.$children; // 其实不需要处理 slots 最后都会被放进$children

                    if (!VueChildren)
                        VueChildren = [];

                    if (VueChildren.length === 0) {
                        target.$children = [];
                    } else {
                        let idx = 0;
                        let p = {};
                        let z;
                        VueChildren
                            .forEach((child) => {
                                const instance = child.vegoInstance;
                                instance.$parent = target;
                                z = child.vegoZIndex;
                                if (z)
                                    p[z] ? p[z].push(instance) : p[z] = [instance];
                                else
                                    vegoChildren[idx++] = instance;
                            });

                        Object.values(p).forEach((z) => {
                            z.forEach((t) => {
                                vegoChildren[idx++] = t;
                            });
                        });
                        p = null;
                        vegoChildren.length = VueChildren.length;
                    }

                    queueUpdate(this.vegoRenderWatcher);
                },
            },
        });
        Vue.component('vego-canvas', canvasFac(options));
        Vue.component('vego-text', VegoTextComponent);
    },
};
