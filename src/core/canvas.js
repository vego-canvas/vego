import {
    VegoCanvas,
} from 'vegocore';
import VegoWatcher from './vegoWatcher';
export default function(options){
    const {
        enableMouseOver,
        enableTouch,
        plugins
    } = options;
    return {
        mixins: plugins ? plugins.map((p) => p.canvas).filter((p) => !!p) : [],
        props: {
            width: {
                type: Number,
                default: 400,
            },
            height: {
                type: Number,
                default: 400,
            },
            pause: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                vegoCanvas: null,
            };
        },
        updated(){
            this.updateVegoChildren();
        },
        created(){
            this.vegoRenderWatcher = new VegoWatcher(`VegoWatcher${this._uid}`)
        },
        mounted() {
            const cvs = this.vegoCanvas = new VegoCanvas(this.$el, {
                enableMouseOver,
                enableTouch
            });
            // console.log('mounted')
            // VegoWatcher.prototype.update = () => {
            // console.log('vegoRenderWatcher mounted', this.vegoRenderWatcher)
            this.vegoRenderWatcher.update = () => {
                cvs.render();
                // console.log('render done');
            };
            this.vegoCanvas.canvas.addEventListener('mousemove', this.domMousemove)
            this.vegoCanvas.canvas.addEventListener('mouseleave', this.domMouseLeave)
            this.updateVegoChildren();
            this.isVegoCanvas = true;
        },
        render(_c){
            return _c(
                'canvas',
                {
                    attrs: {
                        width: `${this.width}px`,
                        height: `${this.height}px`,
                    }
                },
                this.$slots.default,
            )
        },
        methods: {
            getPointFromEvent(e) {
                // DOM implementaion
                return {
                    x: e.offsetX,
                    y: e.offsetY,
                };
            },
            domMousemove(event){
                this.$emit('domMousemove', this.getPointFromEvent(event));
            },
            domMouseLeave(event){
                this.$emit('domMouseleave', this.getPointFromEvent(event));
            }
        }
    }
}