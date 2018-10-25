<template>
    <div :x="x" :y="y" :tx="tx" :ty="ty" :color="color">
    </div>
</template>
<script>

export default {
    name: 'my-line',
    props: { x: Number, y: Number, tx: Number, ty: Number, color: String },
    draw(ctx, p) {
        const {
            x, y, tx, ty, color,
        } = this;

        ctx.beginPath();
        ctx.save();
        ctx.strokeStyle = color;
        ctx.moveTo(x, y);
        ctx.lineTo(tx, ty);
        ctx.stroke();
        ctx.restore();
    },
};
</script>
