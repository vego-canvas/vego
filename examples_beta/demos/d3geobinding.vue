<template>
    <div>
        <vego-canvas ref="canvas" class="canvas"
            :width="canvasWidth"
            :height="canvasHeight"
            :projection-d3="projectionD3">
            <polyfill v-for="t in topo" :key="t.id" :topo="t">
            </polyfill>
        </vego-canvas>
    </div>
</template>

<script>
import polyfill from '../components/pathPolyfill.vue';
// import { queueUpdate } from '@/util/Engine';
// const d3 = window.d3;
const topojson = window.topojson;
const zh = require('./zh-cn.json');
// const width = 960;
// const height = 500;
const topo = topojson.feature(zh, zh.objects.provinces).features;
const projection = window.d3.geoMercator()
    .center([116, 39])
    .scale(500);

export default {
    components: {
        polyfill,
    },
    data() {
        return {
            canvasWidth: 960,
            canvasHeight: 500,
            topo,
            projectionD3: projection,
            scale: 500,
            center: {
                x: 116, y: 39,
            },
            // path: null,
            // projection: null,
        };
    },
    watch: {
        scale(val) {
            this.projectionD3.scale(val);
        },
        // center(val) {
        //     console.log(val);
        //     this.projectionD3.center([val.x, val.y]);
        // },
    },
    mounted() {
        // this.$to({
        //     scale: 2000,
        //     // center: {
        //     //     x: 120, y: 40,
        //     // },
        // }, 2000, 'easeInOutQuad');
    },
    // mounted() {
    //     const vegocanvas = this.$refs.canvas;
    //     console.log(vegocanvas);
    //     for (const p in projection) {
    //         const func = projection[p];
    //         projection[p] = (...params) => {
    //             queueUpdate(vegocanvas.vegoRenderWatcher);
    //             return func(...params);
    //             // console.log(vegocanvas.vegoRenderWatcher);
    //         };
    //     }
    //     this.projection = projection;
    //     this.path = d3.geoPath()
    //         .projection(this.projection)
    //         .pointRadius(2);
    //     // console.log(Object.keys(this.projection));

    //     // .context(this.$refs.canvas.vegoCanvas.ctx);
    //     // console.log(projection);
    //     setTimeout(() => {
    //         this.projection.scale(1000);
    //     }, 1000);
    // },
};
</script>

<style>

</style>
