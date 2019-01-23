<template>
<div>
    <vego-canvas :class="canvas" :width="canvasWidth" :height="canvasHeight">

    </vego-canvas>
</div>
</template>

<script>
import axis from '../components/axis.vue';
export default {
    components: { 'vego-axis': axis },
    data() {
        return {
            canvasWidth: 800,
            canvasHeight: 800,
        };
    },
};
</script>
<style>
.canvas{
    border: 3px solid #000;
}
</style>
