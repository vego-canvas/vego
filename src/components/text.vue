<template>
    <div :x="x" :y="y" :text="text" :font="font" :fillColor="fill" :strokeColor="stroke">
    </div>
</template>
<script>

// import Vue from 'vue';
export default {
    name: 'my-text',
    props: { x: Number, y: Number, text: String | Number, font: String, fill: String, stroke: String },
    draw(ctx, p) {
        const {
            x, y, text, font, fill, stroke,
        } = this;

        ctx.beginPath();
        ctx.save();
        if (font)
            ctx.font = font;
        if (fill) {
            ctx.fillStyle = fill;
            ctx.fillText(text, x, y, 100);
        }
        if (stroke) {
            ctx.strokeStyle = stroke;
            ctx.strokeText(text, x, y, 100);
        }
        ctx.restore();
    },
};
</script>
