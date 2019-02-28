<template>
     <vego-canvas ref="canvas" class="canvas"
        :width="canvasWidth"
        :height="canvasHeight">
        <pie-d3
            :data="data"
            :colors="colors"
            :geox="400"
            :geoy="250"
            :outer-radius="140"
            :inner-radius="100"
            :pad-angle="0.03"
            :focus="focus && focus.piece"
            @pieMouseLeave="pieMouseLeave"
            @pieMouseHover="pieMouseHover">
        </pie-d3>
        <billboard
            v-if="focus"
            :geox="focus.x"
            :geoy="focus.y"
            :content="focus.content"></billboard>
    </vego-canvas>
</template>

<script>
import billboard from './billboard.vue';
export default {
    components: {
        billboard,
    },
    data() {
        return {
            canvasWidth: 800,
            canvasHeight: 500,
            data: [1, 1, 2, 3, 5, 8, 13],
            colors: [
                '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
                '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf',
            ],
            mouse: {},
            focus: null,
        };
    },
    methods: {
        pieMouseHover({ i, $event }) {
            this.focus = {
                x: $event.x,
                y: $event.y,
                content: this.data[i] + '',
                piece: i,
            };
        },
        pieMouseLeave(i) {
            this.focus = null;
        },
    },
};
</script>

<style>

</style>
