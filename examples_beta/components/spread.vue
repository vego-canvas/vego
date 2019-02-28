<template>
    <div></div>
</template>

<script>
import VegoComponent from '@/core/VegoComponent.js';
const colors = [
    (h) => `rgba(0,184,169, ${h})`,
    (h) => `rgba(248,243,212, ${h})`,
    (h) => `rgba(246,65,108, ${h})`,
    (h) => `rgba(255,222,125, ${h})`];
const PI2 = Math.PI * 2;

export default {
    mixins: [VegoComponent],
    props: {
        borderW: Number,
    },
    data() {
        return {
            count: Math.floor(Math.random() * 40) + 200,
        };
    },
    mounted() {
        const {
            borderW,
        } = this;
        this.vegoDisplayObject.$graphic.cache(-borderW / 2, -borderW / 2, borderW, borderW);
    },
    methods: {
        getAGradient(g) {
            const radius = Math.floor(Math.random() * 10 + 10);
            const colorfunc = colors[Math.floor(Math.random() * 4)];
            const color1 = colorfunc(1);
            const color2 = colorfunc(0);
            const gradient = g.ctx.createRadialGradient(0, 0, radius, 0, 0, 0);
            gradient.addColorStop(0, color1);
            gradient.addColorStop(1, color2);
            return {
                radius,
                gradient,
            };
        },
        getPosition() {
            const radius = Math.random() * this.borderW / 2;
            const angle = PI2 * Math.random();
            return {
                x: Math.floor(radius * Math.cos(angle)),
                y: Math.floor(radius * Math.sin(angle)),
            };
        },
    },
    draw(g) {
        const {
            count,
        } = this;
        let config;
        let pos;
        for (let i = 0; i < count; i++) {
            g.beginPath();
            if (i % 20 === 0) {
                config = this.getAGradient(g);
                g.setFillStyle(config.gradient);
            }
            pos = this.getPosition();
            g.arc(pos.x, pos.y, config.radius, 0, PI2).fill();
        }
    },
};
</script>

<style>

</style>
