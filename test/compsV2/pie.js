// import Ease from '../../src/utils/Easing';
// const easeInOutQuad = Ease.easeInOutQuad;
// class Tweenlet {
//     constructor(from, to) {
//         this.from = from;
//         this.to = to;
//         this.span = to - from; // TODO span in color
//         this.value = from;
//     }

//     tick(t, easing, begin, duration) {
//         const expo = easing((t - begin) / duration);
//         this.value = this.span * expo + this.from;
//         return this.value;
//     }
//     set(to){
//         this.to = to;
//         this.from = this.value;
//         this.span = to - this.from;
//     }
//     end() {
//         return this.to;
//     }
// }
import Ease from '../../src/utils/Easing';
export default {
    name: 'pie',
    props: {
        start: Number,
        end: Number,
        color: String,
        data: String
    },
    data() {
        return{
            redius: 80,
            margin: 30,
            marginInAction: 30,
        }
    },
    handlers: {
        mouseenter(){
            // this.margin = 40;
            this.$to({
                margin: 50
            }, 400, Ease.easeInCubic);
        },
        mouseleave(){
            this.$to({
                margin: 30
            }, 400, Ease.easeInBack);
        }
    },
    mounted(){
        this.$geometry.x = this.$geometry.y = 200;

        // let begin, end, tween, lastTween;
        // const duration = 500;
        // const animate = (t) => {
        //     if (!begin) {
        //         begin = t;
        //         end = t + duration;
        //     }
        //     if(t > end){
        //         begin = null;
        //         end = null;
        //         tween.end();
        //         tween = null;
        //         return;
        //     }
        //     if(lastTween){
        //         begin = null;
        //         end = null;
        //         lastTween = null;
        //         return;
        //     }
        //     const curr = tween.tick(t, easeInOutQuad, begin, duration);
        //     this.marginInAction = curr;
        //     window.requestAnimationFrame(animate);
        // }
        // this.$watch(() => this.margin, (val, oldVal) => {
        //     if(tween) {
        //         oldVal = tween.value;
        //         lastTween = tween;
        //     }
        //     tween = new Tweenlet(oldVal, val);
        //     window.requestAnimationFrame(animate);
        // });
    },
    render(g){
        if(this.start === this.end ) {
            g.clear();
            return;
        }
        // const padding = Math.PI/180;
        const radius2 = this.redius;
        const radius = this.redius + this.margin;
        const startAngle = this.start;
        const endAngle = this.end;
        var cos=Math.cos(startAngle);
        var sin=Math.sin(startAngle);
        var cos2=Math.cos(endAngle);
        var sin2=Math.sin(endAngle);
        // this.$geometry.x = Math.cos(angle) * 5;
        // this.$geometry.y = Math.sin(angle) * 5;
        g.clear().beginFill(this.color).moveTo(radius2*cos,radius2*sin)
            .lineTo(radius*cos,radius*sin)
            .arc(0,0,radius,startAngle,endAngle,0)
            .lineTo(radius2*cos2,radius2*sin2)
            .arc(0,0,radius2,endAngle,startAngle,1)
    }
}