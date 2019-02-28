<template>
    <div v-if="img"></div>
</template>

<script>
import VegoComponent from '@/core/VegoComponent.js';
import imageloader from './imageloader.js';
export default {
    mixins: [VegoComponent, imageloader],
    props: {
        width: Number,
        height: Number,
    },
    mounted() {
        this.vegoDisplayObject.$regist('pressd', (payload) => {
            console.log('pressd');
            this.$emit('pressd', payload);
        });
        this.vegoDisplayObject.$regist('unpressed', (payload) => {
            console.log('unpressed');
            this.$emit('unpressed', payload);
        });
        this.vegoDisplayObject.$regist('pressmove', (payload) => {
            console.log('pressmove');
            this.$emit('pressmove', payload);
        });
    },
    draw(g) {
        if (!this.img)
            return;

        const {
            img,
            width,
            height,
        } = this;
        g.beginPath()
            .drawImage(img, 0, 0, width, height);
    },
};
</script>

<style>

</style>
