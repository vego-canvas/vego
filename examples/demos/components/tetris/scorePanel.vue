<template>
    <div :config="config" :score="score"></div>
</template>
<script>
export default {
    props: {
        config: Object,
        score: Number,
    },
    draw(ctx) {
        const {
            x, y,
        } = this.config;
        const text = `得分：${this.score}`;
        ctx.beginPath();
        ctx.save();

        ctx.fillStyle = 'black';
        ctx.fillText(text, x, y, 100);
        ctx.restore();
    },
};
</script>
<style>
    .rootContainer{
        width: 100%;
        height: 100%;
    }

</style>
