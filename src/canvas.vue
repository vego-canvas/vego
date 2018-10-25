<template>
    <canvas :width="width | toPx" :height="height | toPx"
        @click="commonHandler('click', $event)"
        @mousedown="onmousedown"
        @mousemove="onmousemove"
        @mouseup="onmouseup">
        <slot></slot>
    </canvas>
</template>

<script type="text/javascript">
import Vue from 'vue';
import ticker from './proto/ticker';
import Matrix2D from './util/Matrix2D';
// import mouseEventVM from './proto/mouseEvent';
import MouseEvent from './proto/mouseEvent.js';

export default Vue.component('vego-canvas', {
    name: 'vego-canvas',
    filters: {
        toPx(num) {
            return `${num}px`;
        },
    },
    props: {
        width: {
            type: Number,
            default: 400,
        },
        height: {
            type: Number,
            default: 400,
        },
        pause: {
            type: Boolean,
            default: false,
        },
    },
    watch: {
        pause(val) {
            ticker._pause = val;
        },
    },

    created() {
        const { width, height } = this;
        this.tagName = 'CANVAS';
        this.ratio = window.devicePixelRatio || 1;
        this.matrix = new Matrix2D();
        this.matrix.scale(this.ratio, this.ratio);
    },
    mounted() {
        const { width, height } = this;
        const ctx = this.$el.getContext('2d');
        const ratio = this.ratio;
        this.scaleCanvas(this.$el, width, height);

        const widthActual = width * ratio;
        const heightActual = height * ratio;
        // this._updateContext(ctx);
        ticker((t) => {
            ctx.clearRect(0, 0, widthActual, heightActual);

            this.$emit('tick', t);
            this._updateContext(ctx);
        });
    },
    methods: {
        scaleCanvas(canvas, width, height) {
            const context = canvas.getContext('2d');
            const ratio = this.ratio;

            if (devicePixelRatio !== 1) {
                canvas.width = width * ratio;
                canvas.height = height * ratio;
                canvas.style.width = width + 'px';
                canvas.style.height = height + 'px';
            } else {
                canvas.width = width;
                canvas.height = height;
                canvas.style.width = '';
                canvas.style.height = '';
            }
            return ratio;
        },

        commonHandler(type, event) {
            const {
                offsetX,
                offsetY,
            } = event;
            const targets = [];
            this._getTargets(offsetX, offsetY, targets);
            const target = targets.sort((a, b) =>
            // last draw, high layer, bigger uid
                b._uid - a._uid
            )[0];

            if (target) {
                this.dispatchMouseEvent(target, {
                    x: offsetX,
                    y: offsetY,
                    type,
                });
            }
            this.$emit(`dom${type}`, event);
            return target;
        },

        onmousedown(event) {
            const {
                offsetX,
                offsetY,
            } = event;

            const target = this.commonHandler('mousedown', event);
            this.pinedTarget = {
                anchorX: offsetX,
                anchorY: offsetY,
                target,
            };
        },

        onmouseup(event) {
            const {
                offsetX,
                offsetY,
            } = event;

            const target = this.commonHandler('mouseup', event);
            this.pinedTarget = null;
        },

        onmousemove(event) {
            const {
                offsetX,
                offsetY,
            } = event;
            const target = this.commonHandler('mousemove', event);

            if (this.oldTarget !== target) {
                this.dispatchMouseEvent(this.oldTarget, {
                    x: offsetX,
                    y: offsetY,
                    type: 'mouseleave',
                });
                this.dispatchMouseEvent(target, {
                    x: offsetX,
                    y: offsetY,
                    type: 'mouseenter',
                });
            }

            if (this.pinedTarget) {
                const {
                    target,
                    anchorX,
                    anchorY,
                } = this.pinedTarget;
                this.dispatchMouseEvent(target, {
                    x: offsetX,
                    y: offsetY,
                    anchorX, anchorY,
                    type: 'pressmove',
                });
            }
            this.oldTarget = target;
        },

        dispatchMouseEvent(target, options) {
            if (!target || !target._dispatch)
                return;
            const event = new MouseEvent(options);
            target._dispatch(event);
        },

        _dispatch(event) {
            this.$emit(event.type, event);
        },

        _preUpdate(ctx) {
            const m = this.matrix;
            ctx.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
        },

        _afterUpdate(ctx) {
            ctx.setTransform();
        },
    },
});
</script>
<style type="text/css">
</style>
