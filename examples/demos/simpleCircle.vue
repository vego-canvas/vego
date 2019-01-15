<template>
    <circle :x="x" :y="y" :r="r" :color="color">
    </circle>
</template>
<script>
// import Vue from 'vue';
export default {
    name: 'my-arc',
    props: { x: Number, y: Number, r: Number, color: String },
    watch: {
        x(val) {
            this.vegoDisplayObject.$geometry.x = val;
        },
        y(val) {
            this.vegoDisplayObject.$geometry.y = val;
        },
    },
    mounted() {
        this.vegoDisplayObject.$geometry.x = this.x;
        this.vegoDisplayObject.$geometry.y = this.y;
        this.vegoDisplayObject.$regist('mouseenter', (payload) => {
            console.log('mouseenter');
            this.$emit('mouseenter', payload);
        });
        this.vegoDisplayObject.$regist('mouseleave', (payload) => {
            console.log('mouseleave');
            this.$emit('mouseleave', payload);
        });
    },
    draw(g) {
        const {
            r, color,
        } = this;
        g.clear()
            .beginFill(color)
            .drawCircle(0, 0, r);
    },
};
</script>
