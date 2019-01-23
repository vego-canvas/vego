<template>
    <div>
        <vego-line
            :length="500"
            :geoy="250"
            :rotation="-90"
            :reg-x="250"
            :weight="10"
            name="first line"
            :color="'#000'"></vego-line>
        <vego-line v-for="i in lines"
            :key="`vertical${i}`"
            :geoy="i*step"
            :length="length"
            :color="'#000'"></vego-line>
        <vego-line
            :length="length"
            :geox="0"
            :geoy="500"
            :weight="3"
            :color="'#000'"></vego-line>
        <vego-line
            v-for="i in xsteps"
            :key="`horizontal${i}`"
            :length="12"
            :geox="i * step"
            :geoy="500"
            :rotation="-90"
            :reg-x="6"
            :weight="3"
            :color="'#000'"></vego-line>

        <slot></slot>
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
    data() {
        return {
            xsteps: 14,
            lines: 9,
            length: 800,
            step: 50,
        };
    },
    mounted() {
        console.log(this.vegoDisplayObject);
    },
};
</script>

<style>

</style>
