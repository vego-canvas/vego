<template>
<div>
    <vego-canvas class="canvas" :width="canvasWidth" :height="canvasHeight">
        <vego-axis :geox="50" :geoy="50">
            <template slot="header">
                <my-arc
                    :r="20"
                    color="red"></my-arc>
            </template>
            <curve-graph :data="l1" :weight="3" color="red"></curve-graph>
            <curve-graph :data="l2" :weight="3" color="blue"></curve-graph>
        </vego-axis>
        <!-- <my-arc
            :geox="100"
            :geoy="100"
            :r="50"
            color="yellow">
        </my-arc> -->
    </vego-canvas>
</div>
</template>

<script>
import axis from '../components/axis.vue';
import curveGraph from '../components/curveGraph.vue';
import BezierSpline from 'bezier-spline';
import circle from '../components/circle.vue';
export default {
    components: {
        'vego-axis': axis,
        'curve-graph': curveGraph,
        'my-arc': circle,
    },
    data() {
        return {
            canvasWidth: 800,
            canvasHeight: 800,
            data: [
                { a: 150, b: 120 },
                { a: 300, b: 120 },
                { a: 28, b: 100 },
                { a: 200, b: 200 },
                { a: 74, b: 490 },
                { a: 532, b: 234 },
                { a: 420, b: 456 },
            ],
        };
    },
    computed: {
        l1() {
            const source = this.data.map((i, idx) => ([
                (idx + 1) * 50,
                i.a,
            ]));
            return [[0, this.data[0].a]].concat(new BezierSpline(source).curves);
        },
        l2() {
            const source = this.data.map((i, idx) => ([
                (idx + 1) * 50,
                i.b,
            ]));
            return [[0, this.data[0].b]].concat(new BezierSpline(source).curves);
        },
    },
};
</script>
<style>
.canvas{
    border: 3px solid #000;
}
</style>
