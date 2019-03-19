import {
    DisplayObject,
} from 'vegocore';
import { queueUpdate } from './util/Engine';

export default {
    props: {
        geox: {
            type: Number,
            default: 0,
        },
        geoy: {
            type: Number,
            default: 0,
        },
        rotation: {
            type: Number,
            default: 0,
        },
        scaleX: {
            type: Number,
            default: 1,
        },
        scaleY: {
            type: Number,
            default: 1,
        },
        skewX: {
            type: Number,
            default: 0,
        },
        skewY: {
            type: Number,
            default: 0,
        },
        regX: {
            type: Number,
            default: 0,
        },
        regY: {
            type: Number,
            default: 0,
        },
    },
    watch: {
        geox(val) {
            this.vegoDisplayObject.$geometry.x = val;
        },
        geoy(val) {
            this.vegoDisplayObject.$geometry.y = val;
        },
        rotation(val) {
            this.vegoDisplayObject.$geometry.rotation = val;
        },
        scaleX(val) {
            this.vegoDisplayObject.$geometry.scaleX = val;
        },
        scaleY(val) {
            this.vegoDisplayObject.$geometry.scaleY = val;
        },
        skewX(val) {
            this.vegoDisplayObject.$geometry.skewX = val;
        },
        skewY(val) {
            this.vegoDisplayObject.$geometry.skewY = val;
        },
        regX(val) {
            this.vegoDisplayObject.$geometry.regX = val;
        },
        regY(val) {
            this.vegoDisplayObject.$geometry.regY = val;
        },
    },
    mounted() {
        // 定位属性
        this.vegoDisplayObject.$geometry.x = this.geox;
        this.vegoDisplayObject.$geometry.y = this.geoy;
        this.vegoDisplayObject.$geometry.rotation = this.rotation;
        this.vegoDisplayObject.$geometry.scaleX = this.scaleX;
        this.vegoDisplayObject.$geometry.scaleY = this.scaleY;
        this.vegoDisplayObject.$geometry.skewX = this.skewX;
        this.vegoDisplayObject.$geometry.skewY = this.skewY;
        this.vegoDisplayObject.$geometry.regX = this.regX;
        this.vegoDisplayObject.$geometry.regY = this.regY;
        this.initVegoComponent();
    },
    draw(g) {

    },
    render(createElement) {
        // console.log(this);
        return createElement('div', this.$options.propsData, this.$children);
    },
    methods: {
        initVegoComponent() {
            this.canvasWatcher = this.canvasParent.vegoRenderWatcher;
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
        },
    },
};
