const colorsP = ['#828b20', '#b0ac31', '#cbc53d', '#fad779', '#f9e4ad', '#faf2db', '#563512', '#9b4a0b', '#d36600', '#fe8a00', '#f9a71f'];
const rings = 40;
const radius = 50;
import VegoComponent from '@/core/VegoComponent.js';
export default {
    mixins: [VegoComponent],
    data() {
        const colors = [];
        for (let j = rings; j > 0; j--) {
            colors.push(colorsP[~~(Math.random() * 10) | 0]);
        }
        return {
            colors,
        };
    },
    mounted() {
        this.vegoDisplayObject.$graphic.cache(-radius, -radius, radius * 2, radius * 2);
    },
    draw(g) {
        const {
            colors,
        } = this;
        const PI2 = Math.PI * 2;
        for (let j = rings; j > 0; j--) {
            g.beginPath()
                .setFillStyle(colors[j])
                .arc(0, 0, radius * j / rings, 0, PI2)
                .fill();
        }
    },
};
