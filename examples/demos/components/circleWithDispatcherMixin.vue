<template>
<div :config="config"></div>
</template>
<script>
export default {
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
