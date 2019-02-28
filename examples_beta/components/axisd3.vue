<template>
    <div :x="x" :y="y">
    </div>
</template>

<script>
const d3 = window.d3;
// const bisectDate = d3.bisector((d) => d.date).right;
export default {
    props: {
        dataXRange: Array,
        spaceXRange: Array,
        dataYRange: Array,
        spaceYRange: Array,
        columns: Array,
        series: Array,
        mouse: Object,
        dataYTag: {
            type: String,
            default: '',
        },
        dataXTag: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            x: undefined,
            y: undefined,
        };
    },
    computed: {
        xticks() {
            return this.x.ticks(10);
        },
        yticks() {
            return this.y.ticks(10);
        },
        focus() {
            const {
                x, y, series, mouse, columns,
            } = this;
            const ym = y.invert(mouse.y);
            const xm = x.invert(mouse.x);
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
    mounted() {
        const {
            dataXRange,
            spaceXRange,
            dataYRange,
            spaceYRange,
        } = this;
        this.x = d3.scaleTime().range(spaceXRange);
        this.x.domain(dataXRange);

        this.y = d3.scaleLinear().range(spaceYRange);
        this.y.domain(dataYRange).nice();
    },
    methods: {
        drawXAxis(g) {
            const {
                xticks, x,
                spaceYRange,
                spaceXRange,
            } = this;
            const height = spaceYRange[0];
            const tickFormat = x.tickFormat();
            g.beginPath()
                .moveTo(spaceXRange[0], height);
            xticks.forEach((d) => {
                const xd = x(d);
                g.lineTo(xd, height)
                    .lineTo(xd, height + 6)
                    .moveTo(xd, height);
            });
            g.stroke();
            g.setTextAlign('center')
                .setTextBaseline('top');
            xticks.forEach((d) => {
                g.fillText(tickFormat(d), x(d), height + 6);
            });
            if (this.dataXTag)
                g.fillText(this.dataXTag, x(this.xticks[this.xticks.length - 1]) + 50, height);
        },
        drawYAxis(g) {
            const {
                yticks, y,
                spaceYRange,
                spaceXRange,
            } = this;
            const w = spaceXRange[0];
            const height = spaceYRange[0];
            const tickFormat = y.tickFormat();
            g.beginPath()
                .moveTo(w, height);
            yticks.forEach((d) => {
                const yd = y(d);
                g.lineTo(w, yd)
                    .lineTo(w - 6, yd)
                    .moveTo(w, yd);
            });
            g.stroke();
            g.setTextAlign('right')
                .setTextBaseline('middle');
            yticks.forEach((d) => {
                g.fillText(tickFormat(d), w - 9, y(d));
            });
            if (this.dataYTag) {
                g.setTextAlign('left')
                    .fillText(this.dataYTag, w + 10, y(this.yticks[this.yticks.length - 1]));
            }
        },
        drawData(g) {
            const {
                x, y, series, columns,
            } = this;
            const s = this.focus.s;
            let l = 0;
            series.forEach((data, i) => {
                if (s === data) {
                    l = i;
                    return;
                }
                g.beginPath();

                d3.line()
                    .x((d, i) => x(columns[i]))
                    // .y0(this.spaceYRange[0])
                    .y((d) => y(d))
                    // .curve(d3.curveStep)
                    .context(g)(data);
                g.setLineWidth(1.5)
                    .setStrokeStyle('#ddd')
                    // .setFillStyle('#ddd')
                    .stroke();
                // .fill();
            });
            g.beginPath();
            d3.line()
                .x((d, i) => x(columns[i]))
                // .y0(this.spaceYRange[0])
                .y((d) => y(d))
                // .curve(d3.curveStep)
                .context(g)(series[l]);
            g.setLineWidth(1.5)
                .setStrokeStyle('steelblue')
                // .setFillStyle('steelblue')
                .stroke();
            // .fill();
        },
        drawIndicator(g) {
            const {
                x, y, columns,
            } = this;
            const {
                i, s,
            } = this.focus;

            if (columns[i]) {
                const xx = x(columns[i]);
                const yy = y(s[i]);
                g.beginPath()
                    .arc(xx, yy, 2.5, 0, Math.PI * 2)
                    .fill()
                    .fillText(s[i], xx, yy + 20);
            }
        },
    },
    draw(g) {
        this.drawXAxis(g);
        this.drawYAxis(g);
        this.drawData(g);
        this.drawIndicator(g);
    },
};
</script>

<style>

</style>
