<template>
    <div>
        <slot :fx="fxy.fx" :fy="fxy.fy"></slot>
    </div>
</template>

<script>
import * as d3 from 'd3';
// const bisectDate = d3.bisector((d) => d.date).right;
export default {
    name: 'axis-d3',
    props: {
        dataXRange: Array,
        spaceXRange: Array,
        dataYRange: Array,
        spaceYRange: Array,
        // columns: Array,
        // series: Array,
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
    // data() {
    //     return {
    //         x: undefined,
    //         y: undefined,
    //     };
    // },
    computed: {

        fxy() {
            const {
                dataXRange,
                spaceXRange,
                dataYRange,
                spaceYRange,
            } = this;
            return {
                fx: d3.scaleTime().domain(dataXRange).range(spaceXRange),
                fy: d3.scaleLinear().domain(dataYRange).nice().range(spaceYRange),
            };
        },
        xticks() {
            return this.fxy.fx.ticks(10);
        },
        yticks() {
            return this.fxy.fy.ticks(10);
        },
    },
    watch: {

    },
    methods: {

        drawXAxis(g) {
            const {
                xticks, fxy,
                spaceYRange,
                spaceXRange,
            } = this;
            const fx = fxy.fx;
            const height = spaceYRange[0];
            const tickFormat = fx.tickFormat();
            g.beginPath()
                .moveTo(spaceXRange[0], height);
            xticks.forEach((d) => {
                const xd = fx(d);
                g.lineTo(xd, height)
                    .lineTo(xd, height + 6)
                    .moveTo(xd, height);
            });
            g.stroke();
            g.setTextAlign('center')
                .setTextBaseline('top');
            xticks.forEach((d) => {
                g.fillText(tickFormat(d), fx(d), height + 6);
            });
            if (this.dataXTag)
                g.fillText(this.dataXTag, fx(this.xticks[this.xticks.length - 1]) + 50, height);
        },
        drawYAxis(g) {
            const {
                yticks, fxy,
                spaceYRange,
                spaceXRange,
            } = this;
            const fy = fxy.fy;
            const w = spaceXRange[0];
            const height = spaceYRange[0];
            const tickFormat = fy.tickFormat();
            g.beginPath()
                .moveTo(w, height);
            yticks.forEach((d) => {
                const yd = fy(d);
                g.lineTo(w, yd)
                    .lineTo(w - 6, yd)
                    .moveTo(w, yd);
            });
            g.stroke();
            g.setTextAlign('right')
                .setTextBaseline('middle');
            yticks.forEach((d) => {
                g.fillText(tickFormat(d), w - 9, fy(d));
            });
            if (this.dataYTag) {
                g.setTextAlign('left')
                    .fillText(this.dataYTag, w + 10, fy(this.yticks[this.yticks.length - 1]));
            }
        },
    },
    draw(g) {
        this.drawXAxis(g);
        this.drawYAxis(g);
    },
};
</script>
