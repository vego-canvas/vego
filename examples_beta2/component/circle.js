import VegoBaseComponent from '@/component/VegoBaseComponent';
// const nextFrame = window.requestAnimationFrame;
export default {
    props: {
        r: Number,
        color: String,
    },
    data() {
        return {
            angle: Math.PI * 2,
        };
    },
    extends: VegoBaseComponent,
    mounted() {
        console.log(this._uid);
        // const tick = () => {
        //     // this.angle = Math.PI * 2 * Math.random();
        //     nextFrame(tick);
        // };
        // nextFrame(tick);
    },
    draw(g) {
        const {
            r, color,
        } = this;
        g.beginPath()
            .setFillStyle(color)
            .arc(0, 0, r, 0, this.angle)
            .fill();
    },
};
