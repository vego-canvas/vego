<template>
    <div v-if="image"
        :image="image"
        :imageWidth="imageWidth"
        :imageHeight="imageHeight"></div>
</template>

<script>
export default {
    data() {
        return {
            image: undefined,
            imageWidth: 0,
            imageHeight: 0,
        };
    },
    draw(g){
        const {
            image,
            imageWidth,
            imageHeight
        }
        g.beginBitmapFill(image, 'no-repeat"')
    }
};
</script>

<style>

</style>
