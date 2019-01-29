import {
    VegoCanvas,
} from 'vegocore';
import VegoWatcher from './vegoWatcher';
export default function(options){
    const {
        enableMouseOver
    } = options;
    return {
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
        mounted() {
            const cvs = this.vegoCanvas = new VegoCanvas(this.$el, {
                enableMouseOver
            });
            // console.log('mounted')
            VegoWatcher.prototype.update = () => {
                cvs.render();
            };
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
        }
    }
}