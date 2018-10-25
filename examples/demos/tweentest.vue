<template>
<div class="root">
    <vego-canvas :width="canvasWidth" :height="canvasHeight">
        <my-circle :x="x" :y="y" :r="r" :color="color" :tween="tween"></my-circle>
    </vego-canvas>
    <div class="grid">
        <pre>
            // index.vue
            import circle from '../src/core/tweenCircle.vue';
            export default {
                components: { "my-circle": circle },
                data(){
                    return {
                        canvasWidth: 600,
                        canvasHeight: 400,
                        x: 50,
                        y: 50,
                        r: 40,
                        color: 'red',
                        tween: {
                            duration: 2000,
                            easing: 'easeOutBounce',
                            observe: ['x','y'],
                        }
                    }
                },

                mounted(){
                    setTimeout(() => {
                        this.x = 100;
                        this.y = 150;
                        this.color = 'yellow'
                    }, 1000);
                }
            }
        </pre>
        <pre>
            // tweenCircle.vue
            import tweenMixin from '../proto/tweenMixin.js';
            export default {
                name: 'my-circle',
                mixins: [ tweenMixin ],
                props: ['x', 'y', 'r', 'color'],
                dataKeysInDraw: ['x', 'y', 'r', 'color'],
                draw(ctx){
                    const {
                        x, y, r, color
                    } = this;

                    ctx.beginPath();
                    ctx.save();
                    ctx.fillStyle = color;
                    ctx.arc(x, y, r, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.restore();
                },
            };
        </pre>
    </div>
</div>
</template>
<script>
import circle from '@/components/tweenCircle.vue';
export default {
    components: { 'my-circle': circle },
    data() {
        return {
            canvasWidth: 600,
            canvasHeight: 250,
            x: 50,
            y: 50,
            r: 40,
            color: 'red',
            tween: {
                duration: 2000,
                easing: 'easeOutBounce',
                observe: ['x', 'y'],
            },
        };
    },

    mounted() {
        setTimeout(() => {
            this.x = 100;
            this.y = 150;
            this.color = 'yellow';
        }, 1000);
    },
};
</script>
<style>
.grid{
    display: grid;
    grid-template-columns: repeat(2, 1fr);
}
</style>
