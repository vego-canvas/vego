<template>
<div :config="config"></div>
</template>
<script>
export default {
    props: { config: Object },
    draw(ctx, p) {
        const {
            width, height, color,
        } = this.config;

        ctx.beginPath();
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.strokeRect(0, 0, width + 4, height + 4);
        ctx.restore();
    },
};
</script>
