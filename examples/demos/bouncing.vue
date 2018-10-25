<template>
<div>
    <vego-canvas @tick="tick" :width="canvasWidth" :height="canvasHeight">
        <container :key="ball.key" v-for="ball in balls" :x="ball.x" :y="ball.y">
            <ball :x="0" :y="0" :r="ball.radius" :color="ball.color" :scale-y="ball.scaleY" :tween="tweenBall" @tweenend="recover(ball)"></ball>
        </container>
    </vego-canvas>
</div>
</template>
<script>
import ball from './ball.vue';
import container from '@/core/container.vue';

function randomNum(m, n) {
    return Math.floor(Math.random() * (n - m + 1) + m);
}
function randomColor() {
    const r = randomNum(0, 255);
    const g = randomNum(0, 255);
    const b = randomNum(0, 255);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}
export default {
    name: 'bouncingbox',
    components: {
        ball,
        container,
    },
    data() {
        return {
            canvasWidth: 800,
            canvasHeight: 800,

            balls: [],

            lastT: 0,

            tweenBall: {
                duration: 50,
                easing: 'linear',
                observe: ['scaleY'],
            },
        };
    },
    mounted() {
        for (let i = 0; i < 20; i++) {
            this.createBall(i);
        }
    },
    methods: {
        tick(t) {
            const gravity = 0.3;
            const elasticity = 0.6;
            const elasticitx = 0.5;
            const friction = 0.008;
            const bottom = this.canvasHeight;
            const right = this.canvasWidth;

            const angle = 285;
            this.balls.forEach((ball) => {
                ball.vx = ball.vx - (ball.vx * friction);
                ball.vy += gravity;

                if ((ball.y + ball.radius) > bottom) {
                    // about to bounce
                    ball.vy = -(ball.vy) * elasticity;
                    ball.y = bottom - ball.radius;
                    ball.scaleY = 0.8; // maybe scaleY is in proportion to the velocity of the ball.
                }
                if ((ball.x - ball.radius) < 0) {
                    ball.vx = -(ball.vx) * elasticitx;
                    ball.x = ball.radius;
                }
                if ((ball.x + ball.radius) > right) {
                    ball.vx = -(ball.vx) * elasticitx;
                    ball.x = right - ball.radius;
                }
                if (Math.abs(ball.vy) < 0.5 && ball.y > bottom - ball.radius - 1) {
                    ball.vy = 0;
                }

                ball.x += ball.vx;
                ball.y += ball.vy;
            });
        },
        createBall(k) {
            const speed = 12;
            const angle = randomNum(180, 360);
            const radians = angle * Math.PI / 180;
            const x = this.canvasWidth / 2;
            const y = 200;
            const vx = Math.cos(radians) * speed;
            const vy = Math.sin(radians) * speed;
            this.balls.push({
                key: k,
                x, y,
                radius: 50,
                color: randomColor(),
                vx,
                vy,
                scaleY: 1,
            });
        },
        recover(ball) {
            ball.scaleY = 1;
        },
    },
};
</script>
<style>

</style>
