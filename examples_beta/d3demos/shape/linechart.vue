<template>
     <vego-canvas ref="canvas" class="canvas"
        :width="canvasWidth"
        :height="canvasHeight"
        @domMousemove="hover"
        @domMouseleave="leave">
        <axis-d3
            :data-y-tag="'Unemployment'"
            :data-x-tag="'Date'"
            :data-x-range="dataXRange"
            :space-x-range="spaceXRange"
            :data-y-range="dataYRange"
            :space-y-range="spaceYRange">
            <template slot-scope="scope">
                <line-d3
                    :columns="columns"
                    :series="series"
                    :mouse="mouse"
                    :fx="scope.fx"
                    :fy="scope.fy">
                </line-d3>
            </template>
        </axis-d3>
    </vego-canvas>
</template>

<script>
import * as d3 from 'd3';
export default {
    data() {
        return {
            canvasWidth: 800,
            canvasHeight: 500,
            columns: null,
            series: null,
            dataXRange: [],
            spaceXRange: [],
            dataYRange: [],
            spaceYRange: [],
            mouse: {},
        };
    },
    mounted() {
        // this.getData();
        this.getMultiData();
    },
    methods: {
        leave() {
            this.mouse = null;
        },
        hover(event) {
            this.mouse = event;
        },
        async getMultiData() {
            const data = await d3.tsv('https://gist.githubusercontent.com/mbostock/8033015/raw/01e8225d4a65aca6c759fe4b8c77179f446c5815/unemployment.tsv', (d, i, columns) => ({
                name: d.name.replace(/, ([\w-]+).*/, ' $1'),
                values: columns.slice(1).map((k) => +d[k]),
            }));
            this.series = data.map((i) => i.values);// [data[0].values];
            this.columns = data.columns.slice(1).map(d3.timeParse('%Y-%m'));
            this.dataXRange = d3.extent(this.columns);
            this.spaceXRange = [40, this.canvasWidth - 40];
            this.dataYRange = [0, d3.max(this.series, (d) => d3.max(d))];
            this.spaceYRange = [this.canvasHeight - 30, 30];
            // return {
            //     y: '% Unemployment',
            //     series: data,
            //     dates: data.columns.slice(1).map(d3.timeParse('%Y-%m')),
            // };
        },
    },
};
</script>

<style>

</style>
