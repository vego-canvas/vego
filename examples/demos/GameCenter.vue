<template>
    <div class="rootContainer" ref="container">
        <vego-canvas :width="canvasWidth" :height="canvasHeight">
            <game-panel :brick-w="brickW" @scorechange="scorechangeHandler"></game-panel>
            <score-panel :config="scoreConfig" :score="score"></score-panel>
        </vego-canvas>
    </div>
</template>
<script>
import gamePanel from './components/tetris/gamePanel.vue';
import scorePanel from './components/tetris/scorePanel.vue';
const brickW = 15;
export default {
    components: {
        'game-panel': gamePanel,
        'score-panel': scorePanel,
    },
    data() {
        return {
            brickW,
            canvasWidth: 600,
            canvasHeight: 900,
            scoreConfig: {
                x: brickW * 12 + 50,
                y: brickW * 21,
            },
            score: 0,
        };
    },
    mounted() {
        const { width, height } = this.$refs.container.getBoundingClientRect();
        this.canvasWidth = width;
        this.canvasHeight = height;
    },
    methods: {
        scorechangeHandler(evt) {
            this.score = evt.score;
        },
    },
};
</script>
<style>
    .rootContainer{
        width: 100%;
        height: 100%;
    }

</style>
