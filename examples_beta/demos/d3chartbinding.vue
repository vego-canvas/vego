<template>
    <vego-canvas ref="canvas" class="canvas"
        :width="canvasWidth"
        :height="canvasHeight"
        @domMousemove="hover">
        <template v-if="series">
            <axisd3
                :mouse="mouse"
                :series="series"
                :columns="columns"
                :data-y-tag="'Unemployment'"
                :data-x-tag="'Date'"
                :data-x-range="dataXRange"
                :space-x-range="spaceXRange"
                :data-y-range="dataYRange"
                :space-y-range="spaceYRange">
            </axisd3>
        </template>
    </vego-canvas>
</template>

<script>
const d3 = window.d3;

const source = 'https://gist.githubusercontent.com/mbostock/14613fb82f32f40119009c94f5a46d72/raw/d0d70ffb7b749714e4ba1dece761f6502b2bdea2/aapl.csv';
import axisd3 from '../components/axisd3.vue';
export default {
    components: {
        axisd3,
    },
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
        hover(event) {
            this.mouse = event;
        },
        async getData() {
            const data = await d3.csv(source, d3.autoType);
            const rows = data.map(({ date, close }) => ({ date, value: close }));

            // this.data = rows;
            this.series = [rows.map((i) => i.value)];
            this.columns = rows.map((i) => i.date);
            this.dataXRange = d3.extent(rows, (d) => d.date);
            this.spaceXRange = [40, this.canvasWidth - 40];
            this.dataYRange = [0, d3.max(rows, (d) => d.value)];
            this.spaceYRange = [this.canvasHeight - 30, 30];
        },
        async getMultiData() {
            const data = await d3.tsv('https://gist.githubusercontent.com/mbostock/8033015/raw/01e8225d4a65aca6c759fe4b8c77179f446c5815/unemployment.tsv', (d, i, columns) => ({
                name: d.name.replace(/, ([\w-]+).*/, ' $1'),
                values: columns.slice(1).map((k) => +d[k]),
            }));
            this.series = data.map((i) => i.values);
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
