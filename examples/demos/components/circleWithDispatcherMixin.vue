<template>
<div :config="config"></div>
</template>
<script>
// import tweenMixin from '@/proto/tweenMixin.js';
export default {
    //  mixins: [tweenMixin],
    props: { config: Object },
    draw(ctx, p) {
        const {
            x, y, r, color,
        } = this.config;

        ctx.beginPath();
        ctx.save();
        ctx.fillStyle = color;
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    },
};
</script>
