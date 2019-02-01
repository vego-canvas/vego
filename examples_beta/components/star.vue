<template>
    <div></div>
</template>
<script>
import VegoComponent from '@/core/VegoComponent.js';
export default {
    name: 'my-star',
    mixins: [VegoComponent],
    props: {
        fillColor: String,
        strokeColor: String,
        spikes: Number,
        outerRadius: Number,
        innerRadius: Number,
    },
    data() {
        return {
            color: 'red',
        };
    },
    mounted() {
        this.vegoDisplayObject.$regist('mouseenter', (payload) => {
            this.$emit('mouseenter', payload);
        });
        this.vegoDisplayObject.$regist('mouseleave', (payload) => {
            this.$emit('mouseleave', payload);
        });
    },
    draw(g) {
        const {
            color,
            fillColor,
            strokeColor,
            spikes,
            outerRadius,
            innerRadius,
        } = this;
        let rot = Math.PI / 2 * 3;
        const cx = 0;
        const cy = 0;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;
        g.beginPath()
            .moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            g.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            g.lineTo(x, y);
            rot += step;
        }

        g.lineTo(cx, cy - outerRadius)
            .closePath()
            .setLineWidth(5)
            .setStrokeStyle(strokeColor)
            .stroke()
            .setFillStyle(color)
            .fill();
    },
};
</script>
