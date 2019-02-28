<template>
    <div>
        <ard-d3 v-for="(pie, i) in pies"
            :key="pie.colors"
            :pie="pie.data"
            :color="pie.color"
            :pie-fn="pieFn"
            :is-focus="i===focus"
            @mouseenter="enterpie(i)"
            @mouseleave="leavepie(i)"
            @mousemove="hoverpie(i, $event)">
        </ard-d3>
    </div>
</template>

<script>
import VegoComponent from '../../../core/VegoComponent.js';
import * as d3 from 'd3';
import arcd3 from './arc.vue';
export default {
    components: {
        'ard-d3': arcd3,
    },
    mixins: [VegoComponent],
    props: {
        data: {
            type: Array,
            default: () => [],
        },
        colors: {
            type: Array,
            default: () => [],
        },
        outerRadius: Number,
        innerRadius: {
            type: Number,
            default: 0,
        },
        cornerRadius: {
            type: Number,
            default: 0,
        },
        padAngle: {
            type: Number,
            default: 0,
        },
        focus: [Object, Number],
    },
    computed: {
        pies() {
            const colors = this.colors;
            return d3.pie()(this.data).map((_, i) => ({
                color: colors[i],
                data: _,
            }));
        },
        pieFn() {
            return d3.arc()
                .outerRadius(this.outerRadius)
                .innerRadius(this.innerRadius)
                .cornerRadius(this.cornerRadius)
                .padAngle(this.padAngle);
        },
    },
    methods: {
        enterpie(i) {
            this.$emit('pieMouseEnter', i);
        },
        leavepie(i) {
            this.$emit('pieMouseLeave', i);
        },
        hoverpie(i, $event) {
            this.$emit('pieMouseHover', {
                $event,
                i,
            });
        },
    },
};
</script>

<style>

</style>
