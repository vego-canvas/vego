<template>
    <div :data="data" :color="color" :weight="weight"></div>
</template>

<script>
import VegoComponent from '@/core/VegoComponent.js';
export default {
    mixins: [VegoComponent],
    props: {
        data: Array,
        color: String,
        weight: Number,
    },
    draw(g) {
        const {
            data, weight, color,
        } = this;
        g.clear()
            .setStrokeStyle(weight)
            .beginStroke(color);
        data.forEach((d, idx) => {
            if (idx === 0)
                g.moveTo(d[0], d[1]);
            else
                g.bezierCurveTo(d[1][0], d[1][0], d[2][0], d[2][1], d[3][0], d[3][1]);
        });
        g.endStroke();
    },
    mounted() {
        console.log('curveGraph mounted');
    },
    methods: {

        // calcbeziers() {
        //     const xstart = this.lineStartX + this.xstart;
        //     const yend = this.yend;
        //     const xstep = this.xstep;
        //     const ydata2coord = this.ydata2coord;
        //     return this.series.map((s) => {
        //         // console.log(this.data[s][0].y);
        //         // console.log(this.data[0].a);
        //         const pts = this.data.map((l, i) => {
        //             const dt = l[s];
        //             // console.log(yend, dt * ydata2coord);
        //             return {
        //                 x: xstart + xstep * i,
        //                 y: yend - ydata2coord * dt,
        //             };
        //         });
        //         return this.bzCurve(s, pts);
        //     });
        // },
        // gradient(a, b) {
        //     return (b.y - a.y) / (b.x - a.x);
        // },
        // bzCurve(key, points, f, t) {
        //     if (typeof (f) === 'undefined')
        //         f = 0.3;
        //     if (typeof (t) === 'undefined')
        //         t = 0.6;
        //     let m = 0;
        //     let dx1 = 0;
        //     let dy1 = 0;
        //     let preP = points[0];
        //     let dx2;
        //     let dy2;
        //     const beziers = [];
        //     beziers.push(preP);
        //     for (let i = 1; i < points.length; i++) {
        //         const curP = points[i];
        //         const nexP = points[i + 1];
        //         if (nexP) {
        //             m = this.gradient(preP, nexP);
        //             dx2 = (nexP.x - curP.x) * -f;
        //             dy2 = dx2 * m * t;
        //         } else {
        //             dx2 = 0;
        //             dy2 = 0;
        //         }
        //         beziers.push({
        //             cp1: {
        //                 x: preP.x - dx1,
        //                 y: preP.y - dy1,
        //             },
        //             cp2: {
        //                 x: curP.x + dx2,
        //                 y: curP.y + dy2,
        //             },
        //             end: {
        //                 x: curP.x,
        //                 y: curP.y,
        //             },
        //         });
        //         dx1 = dx2;
        //         dy1 = dy2;
        //         preP = curP;
        //     }
        //     return {
        //         key,
        //         bz: beziers,
        //     };
        // },
    },
};
</script>

<style>

</style>
