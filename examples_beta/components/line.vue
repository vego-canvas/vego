<template>
    <div :length="length" :weight="weight"></div>
</template>

<script>
import VegoComponent from '@/core/VegoComponent.js';
export default {
    mixins: [VegoComponent],
    props: {
        length: Number,
        weight: {
            type: Number,
            default: 1,
        },
        color: String,
        name: String,
    },
    draw(g) {
        const {
            color, length, weight,
        } = this;
        g.clear()
            .setStrokeStyle(weight)
            .beginStroke(color)
            .moveTo(0, 0)
            .lineTo(length, 0)
            .endStroke();
    },
};
</script>

<style>

</style>
