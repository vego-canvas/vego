<template>
    <div canvascontainer :x="x" :y="y" :regX="regX" :regY="regY">
        <slot></slot>
    </div>
</template>

<script>

export default {
    props: {
        x: {
            type: Number,
            default: 0,
        },
        y: {
            type: Number,
            default: 0,
        },
        regX: {
            type: Number,
            default: 0,
        },
        regY: {
            type: Number,
            default: 0,
        },
        rotation: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            hit: false,
            hasUpdated: false,
        };
    },

    updated() {
        this.matrix.copy(this.$parent.matrix.clone().appendTransform(this.x, this.y, 1, 1, this.rotation, 0, 0, this.regX, this.regY));
    },
    created() {
        this.matrix = this.$parent.matrix
            .clone()
            .appendTransform(this.x, this.y, 1, 1, this.rotation, 0, 0, this.regX, this.regY);
    },
    methods: {
        _preUpdate(ctx) {
            const m = this.matrix;
            ctx.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
        },

        _afterUpdate(ctx) {
            const pm = this.$parent.matrix;
            ctx.setTransform(pm.a, pm.b, pm.c, pm.d, pm.tx, pm.ty);
        },
    },
};
</script>
