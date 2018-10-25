<template>
<div>
    <vego-canvas :width="canvasWidth" :height="canvasHeight">
        <my-arc :x="x" :y="y" :r="r" :color="color"></my-arc>
    </vego-canvas>
</div>
</template>

<script>
import circle from './arc.vue';
export default {
    components: { 'my-arc': circle },
    data() {
        return {
            canvasWidth: 200,
            canvasHeight: 200,
            x: 50,
            y: 50,
            r: 40,
            color: 'red',
        };
    },
};
</script>
