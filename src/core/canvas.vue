<template>
    <canvas :width="width | toPx" :height="height | toPx"
     @mousemove="onmousemove">
        <slot></slot>
    </canvas>
</template>

<script>
import {
    VegoCanvas,
    MouseEvent
} from 'vegocore';
import VegoWatcher from '../proto/VegoWatcher';
export default {
    filters: {
        toPx(num) {
            return `${num}px`;
        },
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
        const cvs = this.vegoCanvas = new VegoCanvas(this.$el);
        // console.log('mounted')
        VegoWatcher.prototype.update = () => {
            // console.log('update')
            cvs.render();
        };
        this.updateVegoChildren();// this.$children.sort((a, b) => b._uid - a._uid).map(this.getVegoDisplayObject)
        cvs.render();
        this.isVegoCanvas = true;
        console.log(this.$slots.default)
    },
    methods: {
        onmousemove(){
            const {
                offsetX,
                offsetY,
            } = event;
            this.vegoCanvas.moveHandler(offsetX, offsetY);
        },
        dispatchMouseEvent(target, options) {
            if (!target || !target._dispatch)
                return;
            const event = new MouseEvent(options);
            target._dispatch(event);
        },

    }

};
</script>

<style>

</style>
