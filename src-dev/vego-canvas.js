import {
    VegoCanvas,
    matchDevicePixelRatioWH,
} from 'vegocore';
import { queueUpdate, VegoWatcher } from './utils/Engine';

export default function (options) {
    const {
        enableMouseOver,
        enableTouch,
    } = options;
    return {
        provide() {
            return {
                vegoRenderWatcher: this.vegoRenderWatcher,
            };
        },
        data() {
            return {
                vegoRenderWatcher: new VegoWatcher(`VegoWatcher${this._uid}`),
            };
        },
        props: {
            width: {
                type: Number,
                default: 400,
            },
            height: {
                type: Number,
                default: 400,
            },
        },
        computed: {
            wAndh() {
                return [this.width, this.height];
            },
        },
        watch: {
            wAndh([width, height]) {
                queueUpdate(this.vegoRenderWatcher);
                matchDevicePixelRatioWH(this.vegoInstance.canvas, width, height);
            },
        },
        updated() {
            this.updateVegoChildren();
            this.clearDom();
        },
        // created() {
        //     this.vegoRenderWatcher =
        // },
        mounted() {
            this.initVegoComponet();
            this.updateVegoChildren();
            this.isVegoCanvas = true;
            this.clearDom();
        },
        render(_c) {
            return _c(
                'canvas',
                this.$slots.default,
            );
        },
        methods: {
            initVegoComponet() {
                this.$el.width = this.width;
                this.$el.height = this.height;
                const cvs = this.vegoInstance = new VegoCanvas(this.$el, {
                    enableMouseOver,
                    enableTouch,
                });
                const canvas = this.vegoInstance.canvas;
                // 不使用原型的原因在于一个页面有多个vegocanvas的情况
                this.vegoRenderWatcher.update = () => {
                    cvs.render();
                };
                canvas.addEventListener('mousemove', this.domMousemove);
                canvas.addEventListener('mouseleave', this.domMouseLeave);
                this.isVegoCanvas = true;
                this.updateVegoChildren();
                this.clearDom();
            },
            getPointFromEvent(e) {
                // DOM implementaion
                return {
                    x: e.offsetX,
                    y: e.offsetY,
                };
            },
            domMousemove(event) {
                this.$emit('domMousemove', this.getPointFromEvent(event));
            },
            domMouseLeave(event) {
                this.$emit('domMouseleave', this.getPointFromEvent(event));
            },
            clearDom() {
                const el = this.$el;
                while (el.firstChild) {
                    el.removeChild(el.firstChild);
                }
            },
        },
    };
}
