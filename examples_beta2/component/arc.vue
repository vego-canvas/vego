<template>
    <vego-canvas :width="canvasWidth" :height="canvasHeight">
        <v-circle v-for="c in circles"
            :key="c.key"
            :r="c.r"
            :color="c.color"
            :vego-geometry="{
                x: c.x,
                y: c.y
            }"></v-circle>
        <vego-text
            color="blue"
            text="fps:"
            font="24px sans-serif"
            :vego-z-index="10"
            :vego-geometry="{
                x: 0,
                y: 50
            }"></vego-text>
        <vego-text
            :text="fps"
            font="24px sans-serif"
            :vego-z-index="9"
            :vego-geometry="{
                x: 50,
                y: 50
            }"></vego-text>
    </vego-canvas>
</template>

<script>
import circle from './circle.js';
const nextFrame = window.requestAnimationFrame;
const colorsP = ['#828b20', '#b0ac31', '#cbc53d', '#fad779', '#f9e4ad', '#faf2db', '#563512', '#9b4a0b', '#d36600', '#fe8a00', '#f9a71f'];
export default {
    components: {
        'v-circle': circle,
    },
    data() {
        return {
            circles: [],
            canvasWidth: 500,
            canvasHeight: 300,
            fps: '',
        };
    },
    mounted() {
        const {
            circles, canvasWidth, canvasHeight,
        } = this;
        const radius = 50;
        const num = 200;
        for (let i = 0; i < num; i++) {
            circles.push({
                x: Math.random() * canvasWidth,
                y: Math.random() * canvasHeight,
                velX: Math.random() * 10 - 5,
                velY: Math.random() * 10 - 5,
                color: colorsP[i % colorsP.length],
                r: ~~(Math.random() * 20 + 10),
                key: i,
            });
        }
        const w = canvasWidth + radius * 2;
        const h = canvasHeight + radius * 2;
        const filterStrength = 20;
        let frameTime = 0;
        let lastLoop = new Date();
        let thisLoop;
        const tick = () => {
            for (let i = 0; i < num; i++) {
                circles[i].x = (circles[i].x + radius + circles[i].velX + w) % w - radius;
                circles[i].y = (circles[i].y + radius + circles[i].velY + h) % h - radius;
            }
            const thisFrameTime = (thisLoop = new Date()) - lastLoop;
            frameTime += (thisFrameTime - frameTime) / filterStrength;
            lastLoop = thisLoop;
            // console.log('------------ to render -------------');
            nextFrame(tick);
        };
        nextFrame(tick);
        setInterval(() => {
            this.fps = (1000 / frameTime).toFixed(1) + ' fps';
        }, 1000);
    },
};
</script>

<style>

</style>
