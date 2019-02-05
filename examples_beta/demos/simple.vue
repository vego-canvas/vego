<template>
<div style="left: 100px;position: absolute;">
    <vego-canvas :width="canvasWidth" :height="canvasHeight">
        <my-arc
            v-for="i in circles"
            :key="i"
            :geox="x"
            :geoy="y + 20*i "
            :reg-x="regX"
            :reg-y="regY"
            :rotation="rotation"
            :r="r"
            :color="color"
            @mouseenter="enterHandler"
            @mouseleave="leaveHandler"
            @pressd="mousedownHandler"
            @pressmove="pressmoveHandler"
            @unpressed="mouseupHandler"></my-arc>
    </vego-canvas>
</div>
</template>

<script>
import circle from '../components/circle.vue';
export default {
    components: { 'my-arc': circle },
    data() {
        return {
            circles: 1,
            canvasWidth: 200,
            canvasHeight: 200,
            x: 50,
            y: 50,
            regX: 0,
            regY: 0,
            rotation: 0,
            r: 40,
            color: 'red',
            lastPos: null,
        };
    },
    watch: {
        circles(val) {
            // console.log(val);
        },
    },
    mounted() {
        // const animate = () => {
        //     this.$to({
        //         x: 200,
        //         color: 'yellow',
        //         regX: 40,
        //         regY: 20,
        //         rotaion: 180,
        //     }, 1000, 'easeInOutQuad').then(() => this.$to({
        //         x: 50,
        //         color: 'red',
        //         regX: 0,
        //         regY: 0,
        //         rotaion: 0,
        //     }, 1000, 'easeInOutQuad')).then(animate);
        // };
        // animate();

        // const nextFrame = (t) => {
        //     this.x = 50 * Math.sin(t / 500) + 100;
        //     this.circles = Math.floor(t / 1000) > 10 ? 10 : Math.floor(t / 1000);
        //     window.requestAnimationFrame(nextFrame);
        // };
        // window.requestAnimationFrame(nextFrame);
    },
    methods: {
        enterHandler() {
            this.color = 'blue';
        },
        leaveHandler() {
            this.color = 'red';
        },
        mousedownHandler() {
            this.lastPos = {
                x: this.x,
                y: this.y,
            };
        },
        pressmoveHandler(payload) {
            const {
                vecX,
                vecY,
            } = payload;
            this.x = this.lastPos.x + vecX;
            this.y = this.lastPos.y + vecY;
        },
        mouseupHandler(payload) {
            this.lastPos = null;
        },
    },
};
</script>
