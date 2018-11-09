<template>
    <div canvascontainer :x="x" :y="y" :regX="regX" :regY="regY">
        <slot></slot>
    </div>
</template>

<script>
import { symb } from '../util/Matrix2D';
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
        this[symb].copy(this.$parent[symb].clone().appendTransform(this.x, this.y, 1, 1, this.rotation, 0, 0, this.regX, this.regY));
    },
    created() {
        console.log(this.$parent[symb]);
        this[symb] = this.$parent[symb]
            .clone()
            .appendTransform(this.x, this.y, 1, 1, this.rotation, 0, 0, this.regX, this.regY);
    },
    methods: {
        _preUpdate(ctx) {
            const m = this[symb];
            ctx.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
        },

        _afterUpdate(ctx) {
            const pm = this.$parent[symb];
            ctx.setTransform(pm.a, pm.b, pm.c, pm.d, pm.tx, pm.ty);
        },
    },
};
</script>
