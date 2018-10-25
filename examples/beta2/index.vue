<template>
<div>
    <vego-canvas @tick="tick">
        <vego-container>
            <my-circle :x="x2" :y="y2" :r="r" :color="color2"></my-circle>
            <vego-container :x="px2" :y="py2">
                <my-circle :x="x" :y="y" :r="r" :color="color"></my-circle>
            </vego-container>
        </vego-container>
    </vego-canvas>
</div>
</template>
<script>
import circle from './circle.vue';
export default {
    components: {
        'my-circle': circle,
    },
    data() {
        return {
            title: 'MVVM Canvas',
            x: 20,
            y: 20,
            r: 30,
            x2: 0,
            y2: 0,
            color: 'red',
            color2: 'green',
            px: 10,
            py: 10,

            px2: 10,
            py2: 10,
        };
    },
    methods: {
        tick(t) {
            const r = 20;
            const v = Math.PI * 2 / 1000;
            const x0 = 50;
            const y0 = 50;
            const theta = v * t % (Math.PI * 2);
            const deltaX = r * Math.sin(theta);
            const deltaY = r * Math.cos(theta);
            const newx = x0 + deltaX;
            const newy = y0 + deltaY;

            const x2 = 100;
            const y2 = 100;
            const r2 = 50;
            const v2 = Math.PI * 2 / 5000;
            const theta2 = v2 * t % (Math.PI * 2);
            const deltaX2 = r2 * Math.sin(theta2);
            const deltaY2 = r2 * Math.cos(theta2);
            const newxp = x2 + deltaX2;
            const newyp = y2 + deltaY2;

            this.x = newx;
            this.y = newy;
            this.px = newxp;
            this.py = newyp;

            const theta3 = -v2 * t % (Math.PI * 2);
            const deltaX3 = r2 * Math.sin(theta2);
            const deltaY3 = r2 * Math.cos(theta2);
            const newxp3 = x2 + deltaX3;
            const newyp3 = y2 + deltaY3;
            this.px2 = newxp;
            this.py2 = newyp;
        },
    },
};
</script>
