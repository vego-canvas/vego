<template>
    <div></div>
</template>
<script>
// import * as d3 from 'd3';
export default {
    props: {
        pie: Object,
        color: String,
        pieFn: Function,
        isFocus: Boolean,
    },
    mounted() {
        this.vegoDisplayObject.$regist('mouseenter', (payload) => {
            this.$emit('mouseenter', payload);
        });
        this.vegoDisplayObject.$regist('mouseleave', (payload) => {
            this.$emit('mouseleave', payload);
        });
        this.vegoDisplayObject.$regist('mousemove', (payload) => {
            this.$emit('mousemove', payload);
        });
    },
    draw(g) {
        g.save()
            .beginPath();
        if (this.isFocus)
            g.setGlobalAlpha(0.5);
        this.pieFn.context(g)(this.pie);
        g.setFillStyle(this.color)
            .fill()
            .restore();
    },
};
</script>
