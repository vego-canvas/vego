import {
    DisplayObject,
} from 'vegocore';
import { queueUpdate, VegoGeoWatcher } from '../utils/Engine';

const DEFAULT_GEOMETRY = {
    x: 0,
    y: 0,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    skewX: 0,
    skewY: 0,
    regX: 0,
    regY: 0,
};
export default {
    inject: ['vegoRenderWatcher'],
    props: {
        vegoGeometry: {
            type: Object,
            default() {
                return {};
            },
        },
        vegoZIndex: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            isCanvasComponent: true,
        };
    },
    watch: {
        vegoGeometry(val) {
            const geom = this.vegoInstance.$geometry;
            for (const key in val) {
                if (key in geom)
                    geom[key] = val[key];
            }
            if (this.vegoGeometryWatcher)
                queueUpdate(this.vegoGeometryWatcher);
        },
    },
    mounted() {
        this.initVegoComponet();
        this.initVegoGeoWatcher();
        this.vegoInstance.$geometry = Object.create(DEFAULT_GEOMETRY);
        this.registVegoEvents();
    },
    methods: {
        initVegoComponet() {
            this.vegoInstance = new DisplayObject(
                this._uid,
                this.$options.draw.bind(this),
                this.$options.postDraw && this.$options.postDraw.bind(this));
        },
        initVegoGeoWatcher() {
            this.vegoGeometryWatcher = new VegoGeoWatcher(`geo_${this._uid}`);
            this.vegoGeometryWatcher.update = () => {
                this.vegoInstance._appendTransform();
            };
        },
        registVegoEvents() {
            this.vegoInstance.$regist('mouseenter', (payload) => {
                this.$emit('mouseenter', payload);
            });
            this.vegoInstance.$regist('mouseleave', (payload) => {
                this.$emit('mouseleave', payload);
            });
            this.vegoInstance.$regist('pressed', (payload) => {
                this.$emit('pressed', payload);
            });
            this.vegoInstance.$regist('unpressed', (payload) => {
                this.$emit('unpressed', payload);
            });
            this.vegoInstance.$regist('pressmove', (payload) => {
                this.$emit('pressmove', payload);
            });
        },
    },
    render(createElement) {
        return createElement('div', this.$options.propsData, this.$children);
    },
};
