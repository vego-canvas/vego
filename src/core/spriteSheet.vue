<template>
    <div :configs="configs" :pattern="pattern"></div>
</template>
<script>
import Ticker from '../proto/ticker';
export default {
    props: {
        configs: Object, pattern: String,
    },
    data() {
        return {
            fr: 0,
            frames: [],
            patterns: {},
            spriteImage: undefined,
            begin: 0,
            span: 0,
            lastDue: 0,
            state: undefined,
        };
    },
    watch: {
        state(val) {
            const p = this.patterns[val].frame;
            this.begin = p[0];
            this.span = p[1] - p[0] + 1;
        },
        pattern(val) {
            this.state = val;
            this.lastDue = this.due;
        },
    },
    draw(ctx) {
        if (this.spriteImage) {
            const nowFr = this.frames[this.fr];
            const {
                sx, sy, sWidth, sHeight,
            } = nowFr;
            ctx.beginPath();
            ctx.save();
            ctx.drawImage(this.spriteImage, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight);
            ctx.restore();
        }
    },
    mounted() {
        const {
            framerate,
            image,
            frames,
            patterns,
        } = this.configs;

        const {
            width,
            height,
            count,
        } = frames;

        this.patterns = patterns;

        const source = new Image();

        source.onload = () => {
            const w = source.width;
            const h = source.height;
            let x = 0;
            let y = 0;
            let idx = 0;
            for (y = 0; y < h - height; y += height) {
                for (x = 0; x < w - width; x += width) {
                    if (idx === count)
                        break;
                    this.frames.push({
                        sx: x,
                        sy: y,
                        sWidth: width,
                        sHeight: height,
                    });
                    idx++;
                }
            }
            this.spriteImage = source;

            if (this.pattern) {
                this.state = this.pattern;
            } else {
                this.begin = 0;
                this.span = count;
            }

            const timespan = 1000 / framerate;
            const allframe = this.frames.length;
            console.log(allframe, w, h, height, width);
            Ticker.regist({
                tick: (due) => {
                    this.due = due;
                    this.fr = this.begin + Math.floor((due - this.lastDue) / timespan) % this.span;
                    if (this.fr === this.begin + this.span - 1) {
                        this.decideNextPattern();
                    }
                },
            });
        };
        source.src = image;
    },
    methods: {
        decideNextPattern() {
            const p = this.patterns[this.state];
            this.state = p.next;
            this.$emit('update:pattern', this.state);
        },
    },

};
</script>
<style>

</style>
