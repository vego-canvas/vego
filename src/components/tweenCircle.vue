<template>
    <div :x="x" :y="y" :r="r" :color="color">
    </div>
</template>
<script>
import tweenMixin from '../proto/tweenMixin.js';
// import Vue from 'vue';
export default {
    name: 'my-circle',
    mixins: [tweenMixin],
    props: { x: Number, y: Number, r: Number, color: String },
    dataKeysInDraw: ['x', 'y', 'r', 'color'],
    draw(ctx) {
        const {
            x, y, r, color,
        } = this;

        ctx.beginPath();
        ctx.save();
        ctx.fillStyle = color;
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    },
};
</script>
