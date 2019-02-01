<template>
    <div>
        <vego-line
            :length="500"
            :geoy="250"
            :rotation="-90"
            :reg-x="250"></vego-line>
        <vego-line v-for="i in lines"
            :key="`vertical${i}`"
            :geoy="i*step"
            :length="length"></vego-line>
        <vego-line
            :length="length"
            :geox="0"
            :geoy="500"></vego-line>
        <vego-line
            v-for="i in xsteps"
            :key="`horizontal${i}`"
            :length="12"
            :geox="i * step"
            :geoy="500"
            :rotation="-90"
            :reg-x="6"></vego-line>
    </div>
</template>

<script>
import line from './line.vue';
import VegoComponent from '@/core/VegoComponent.js';
export default {
    components: {
        'vego-line': line,
    },
    mixins: [VegoComponent],
    props: {
        xsteps: {
            type: Number,
            default: 14,
        },
        lines: {
            type: Number,
            default: 9,
        },
        length: {
            type: Number,
            default: 800,
        },
        step: {
            type: Number,
            default: 50,
        },
    },
    draw(g) {
        g.beginPath()
            .setLineWidth(3);
    },

    afterDraw(g) {
        g.stroke();
    },
};
</script>

<style>

</style>
