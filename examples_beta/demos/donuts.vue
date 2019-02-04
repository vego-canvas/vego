<template>
    <vego-canvas :width="canvasWidth" :height="canvasHeight">
        <template v-for="don in donuts">
            <donut
                :geox="don.x"
                :geoy="don.y"
                :key="don.key">
            </donut>
        </template>
    </vego-canvas>
</template>

<script>
import Donut from '../components/donut.vue';
const num = 200;
const nextFrame = window.requestAnimationFrame;
export default {
    components: {
        Donut,
    },
    data() {
        return {
            canvasWidth: 960,
            canvasHeight: 380,
            donuts: [],
        };
    },
    mounted() {
        const {
            canvasWidth,
            canvasHeight,
            donuts,
        } = this;
        const radius = 50;
        for (let i = 0; i < num; i++) {
            donuts.push({
                x: Math.random() * canvasWidth,
                y: Math.random() * canvasHeight,
                velX: Math.random() * 10 - 5,
                velY: Math.random() * 10 - 5,
            });
        }
        const w = canvasWidth + radius * 2;
        const h = canvasHeight + radius * 2;
        const tick = () => {
            for (let i = 0; i < num; i++) {
                donuts[i].x = (donuts[i].x + radius + donuts[i].velX + w) % w - radius;
                donuts[i].y = (donuts[i].y + radius + donuts[i].velY + h) % h - radius;
            }
            // console.log('------------ to render -------------');
            nextFrame(tick);
        };
        nextFrame(tick);
    },
};
</script>

<style>

</style>
