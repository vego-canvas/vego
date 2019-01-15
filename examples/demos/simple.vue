<template>
<div>
    <vego-canvas :width="canvasWidth" :height="canvasHeight">
        <my-arc
            v-for="i in circles"
            :key="i" :x="x" :y="y + 20*i " :r="r" :color="color"
            @mouseenter="enterHandler"
            @mouseleave="leaveHandler"></my-arc>
    </vego-canvas>
</div>
</template>

<script>
import circle from './simpleCircle.vue';
export default {
    components: { 'my-arc': circle },
    data() {
        return {
            circles: 1,
            canvasWidth: 200,
            canvasHeight: 200,
            x: 50,
            y: 50,
            r: 40,
            color: 'red',
        };
    },
    watch: {
        circles(val) {
            // console.log(val);
        },
    },
    mounted() {
        const nextFrame = (t) => {
            this.x = 50 * Math.sin(t / 500) + 100;
            this.circles = Math.floor(t / 1000) > 10 ? 10 : Math.floor(t / 1000);
            window.requestAnimationFrame(nextFrame);
        };
        window.requestAnimationFrame(nextFrame);
    },
    methods: {
        enterHandler() {
            this.color = 'blue';
        },
        leaveHandler() {
            this.color = 'red';
        },
    },
};
</script>
