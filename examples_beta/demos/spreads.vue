<template>
<div style="background: black;">
    <vego-canvas class="canvas" :width="canvasWidth" :height="canvasHeight">
        <spread
            :border-w="canvasWidth"
            :scale-x="scale"
            :scale-y="scale"
            :geox="canvasWidth/2"
            :geoy="canvasHeight/2"
            :rotation="rotation"></spread>
    </vego-canvas>
</div>
</template>

<script>
import spread from '../components/spread.vue';

export default {
    components: { spread },
    data() {
        return {
            canvasWidth: 800,
            canvasHeight: 800,
            scale: 1,
            rotation: 0,
        };
    },
    mounted() {
        this.$to({
            rotation: 180,
        }, 1000, 'linear');
    },
};
</script>
<style>
.canvas{
    border: 3px solid #000;
}
</style>
