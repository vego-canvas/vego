<template>
    <div :data="data" :color="color" :weight="weight"></div>
</template>

<script>
import VegoComponent from '@/core/VegoComponent.js';
export default {
    mixins: [VegoComponent],
    props: {
        data: Array,
        color: String,
        weight: Number,
    },
    draw(g) {
        const {
            data, weight, color,
        } = this;
        g.beginPath().setStrokeStyle(color)
            .setLineWidth(weight);
        data.forEach((d, idx) => {
            if (idx === 0)
                g.moveTo(d[0], d[1]);
            else
                g.bezierCurveTo(d[1][0], d[1][0], d[2][0], d[2][1], d[3][0], d[3][1]);
        });
        g.stroke();
    },
};
</script>

<style>

</style>
