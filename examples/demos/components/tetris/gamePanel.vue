<template>
    <vego-container>
        <panel :config="panelConfig"></panel>
        <brick v-for="(mtx, idx) in brickMatrix" :key="`${idx}`" :config="config" :idx="idx" :mtx="mtx">
        </brick>
    </vego-container>
</template>
<script>
import brickView from './brick.vue';
import panelView from './panel.vue';
import Blocks from './brick.js';
Blocks.init();

export default {
    name: 'game-center',
    components: {
        brick: brickView,
        panel: panelView,
    },
    props: { brickW: Number },
    data() {
        return {
            panelConfig: {
                width: this.brickW * 12,
                height: this.brickW * 21,
                color: 'black',
            },
            config: {
                width: this.brickW,
                color: 'black',
            },
            brickMatrix: new Array(220).fill(-1),
        };
    },
    mounted() {
        Blocks.registListener(this, () => {
            this.brickMatrix = Blocks.matrix.reduce((accu, cur) => accu.concat(cur), []);
        });
        Blocks.registScoreListener(this, (score) => {
            this.$emit('scorechange', { score });
        });
        Blocks.start();
    },
    methods: {
    },
};
</script>
<style>
    .rootContainer{
        width: 100%;
        height: 100%;
    }

</style>
