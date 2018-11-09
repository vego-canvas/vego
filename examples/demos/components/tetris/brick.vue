<template>
<div :config="config"></div>
</template>
<script>
export default {
    props: { config: Object, idx: String | Number, mtx: Number },
    draw(ctx, p) {
        if (this.mtx === -1)
            return;
        const {
            width, color,
        } = this.config;
        const idx = +this.idx;
        const y = (Math.floor(idx / 12)) * width;
        const x = (idx % 12) * width;

        ctx.beginPath();
        ctx.save();
        ctx.fillStyle = color;
        // ctx.strokeStyle = 'black';
        // ctx.lineWidth = 4;
        ctx.fillRect(x, y, width - 1, width - 1);
        // ctx.strokeRect(x, y, width - 8, width - 8);
        ctx.restore();
    },
};
</script>
