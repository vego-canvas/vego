<template>
<div class="root">
    <vego-canvas :width="canvasWidth" :height="canvasHeight">
        <my-circle :config="config"></my-circle>
    </vego-canvas>
    <div class="grid">
        <pre>
            // index.vue
            import circle from './components/circleWithDispatcherMixin.vue';
            export default {
                components: { 'my-circle': circle },
                data() {
                    return {
                        canvasWidth: 600,
                        canvasHeight: 250,
                        config: {
                            x: 50,
                            y: 50,
                            r: 40,
                            color: 'red',
                        },

                        tween: {
                            duration: 2000,
                            easing: 'easeOutBounce',
                            observe: ['config'],
                        },
                    };
                },

                mounted() {
                    setTimeout(() => {
                        this.config.x = 100;
                        this.config.y = 150;
                        this.color = 'yellow';
                    }, 1000);
                },
            };
        </pre>
        <pre>
            import tweenMixin from '@/proto/tweenMixin.js';
            export default {
                mixins: [tweenMixin],
                props: { config: Object },
                draw(ctx, p) {
                    const {
                        x, y, r, color,
                    } = this.config;

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

import circle from './components/circleWithDispatcherMixin.vue';
import Ease from '@/util/Easing';
export default {
    components: { 'my-circle': circle },
    data() {
        return {
            canvasWidth: 600,
            canvasHeight: 250,
            config: {
                x: 50,
                y: 50,
                r: 40,
                color: '#ffff00',
            },

            tween: {
                duration: 2000,
                easing: 'easeOutBounce',
                observe: ['config'],
            },
            direction: -1,
        };
    },
    watch: {
        // 'config.x'(val) {
        //     console.log(val);
        // },
    },
    mounted() {
        // this.config.x = 100;
        // this.config.y = 150;
        // this.config.color = '#ff00ff';
        this.$to({
            config: {
                x: 100,
                y: 150,
            },
        }, 2000, Ease.easeOutBounce);
    },
    methods: {
        end() {
            this.config.x += this.direction * 100;
            this.config.y += this.direction * 100;
            this.config.color = this.direction > 0 ? '#ff00ff' : '#ffff00';
            this.direction = -this.direction;
        },
    },
};
</script>
<style>
.grid{
    display: grid;
    grid-template-columns: repeat(2, 1fr);
}
</style>
