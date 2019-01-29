<template>
    <div :r="r" :color="color">
    </div>
</template>
<script>
import VegoComponent from '@/core/VegoComponent.js';
export default {
    name: 'my-arc',
    mixins: [VegoComponent],
    props: { r: Number, color: String },
    mounted() {
        this.vegoDisplayObject.$regist('mouseenter', (payload) => {
            this.$emit('mouseenter', payload);
        });
        this.vegoDisplayObject.$regist('mouseleave', (payload) => {
            this.$emit('mouseleave', payload);
        });
        this.vegoDisplayObject.$regist('pressd', (payload) => {
            this.$emit('pressd', payload);
        });
        this.vegoDisplayObject.$regist('unpressed', (payload) => {
            this.$emit('unpressed', payload);
        });
        this.vegoDisplayObject.$regist('pressmove', (payload) => {
            this.$emit('pressmove', payload);
        });
    },
    draw(g) {
        const {
            r, color,
        } = this;
        g.clear()
            .beginFill(color)
            .drawCircle(0, 0, r);
        g.beginFill('#000')
            .drawCircle(0, 0, 10);
    },
};
</script>
