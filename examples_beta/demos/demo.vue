<template>
<div>
    <vego-canvas ref="canvas" :width="canvasWidth" :height="canvasHeight">
        <my-star
            :geox="50"
            :geoy="50"
            :fill-color="star.fillColor"
            :stroke-color="star.strokeColor"
            :spikes="star.spikes"
            :outer-radius="star.outerRadius"
            :inner-radius="star.innerRadius">
        </my-star>
    </vego-canvas>
</div>
</template>

<script>
import star from '../components/star.vue';
export default {
    components: {
        'my-star': star,
    },
    data() {
        return {
            canvasWidth: 200,
            canvasHeight: 200,
            star: {
                fillColor: 'skyblue',
                strokeColor: 'blue',
                spikes: 5,
                outerRadius: 30,
                innerRadius: 15,
            },
        };
    },
};
</script>
