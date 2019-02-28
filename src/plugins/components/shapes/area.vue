<template>
    <div></div>
</template>

<script>
import * as d3 from 'd3';
export default {
    props: {
        series: Array,
        columns: Array,
        y0: {
            type: Number,
            default: 0,
        },
        fx: Function,
        fy: Function,
        curve: {
            type: Function,
            default: d3.curveBasis,
        },
        mouse: {
            type: Object,
            default: null,
        },
        formatContent: {
            type: Function,
            default(data, column) {
                return `${column}: ${data}`;
            },
        },
    },
    computed: {
        focus() {
            const {
                fx, fy, series, mouse, columns,
            } = this;
            if (!this.isFocus())
                return {
                    i: undefined,
                    s: null,
                    p: undefined,
                };

            const ym = fy.invert(mouse.y);
            const xm = fx.invert(mouse.x);
            const i1 = d3.bisectLeft(columns, xm, 1);
            const i0 = i1 - 1;
            const i = xm - columns[i0] > columns[i1] - xm ? i1 : i0;
            let p = 0;
            const s = series.reduce((a, b) => {
                const condition = Math.abs(a[i] - ym) < Math.abs(b[i] - ym);
                if (condition)
                    p++;
                return condition ? a : b;
            });
            return {
                i, s, p,
            };
        },
    },
    methods: {
        isFocus() {
            const mouse = this.mouse;
            return mouse && mouse.x && mouse.y;
        },
        drawDataArea(g, data, color) {
            const {
                fx, fy, columns, curve,
            } = this;
            g.beginPath();
            d3.area()
                .x((d, i) => fx(columns[i]))
                .y0(this.y0)
                .y1((d) => fy(d))
                .curve(curve)
                .context(g)(data);
            g.setFillStyle(color)
                .fill();
        },
        drawData(g) {
            const series = this.series;
            if (series) {
                series.forEach((data, i) => {
                    this.drawDataArea(g, data, 'steelblue');
                });
            }
        },
        drawIndicator(g) {
            const {
                fx, fy, columns, formatContent,
            } = this;
            const {
                i, s,
            } = this.focus;
            if (columns[i]) {
                const xx = fx(columns[i]);
                const yy = fy(s[i]);
                g.beginPath()
                    .arc(xx, yy, 2.5, 0, Math.PI * 2)
                    .setFillStyle('#000')
                    .fill()
                    .fillText(formatContent(s[i], columns[i], i), xx, yy + 20);
            }
        },

    },
    draw(g) {
        this.drawData(g);
        if (this.isFocus())
            this.drawIndicator(g);
    },
};
</script>

<style>

</style>
