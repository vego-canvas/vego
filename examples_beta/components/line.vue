<template>
    <div :length="length"></div>
</template>

<script>
import VegoComponent from '@/core/VegoComponent.js';
export default {
    mixins: [VegoComponent],
    props: {
        length: Number,
    },
    draw(g) {
        const {
            length,
        } = this;
        g.moveTo(0, 0)
            .lineTo(length, 0);
    },
};
</script>

<style>

</style>
