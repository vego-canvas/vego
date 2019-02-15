<template>
    <div>
        <slot name="header"></slot>
        <axis-back
            :xsteps="xsteps"
            :lines="lines"
            :length="length"
            :step="step"></axis-back>
        <slot></slot>
    </div>
</template>

<script>
import axisBack from './axisBack.vue';
import VegoComponent from '@/core/VegoComponent.js';
export default {
    components: {
        'axis-back': axisBack,
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
};
</script>

<style>

</style>
