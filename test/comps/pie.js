import TextTag from './textTag';
import Ease from '../../src/utils/Easing';
import Segments from './segments';
const easeInOutQuad = Ease.easeInOutQuad;

class Tweenlet {
    constructor(from, to) {
        this.from = from;
        this.to = to;
        this.span = to - from; // TODO span in color
        this.value = from;
    }

    tick(t, easing, begin, duration) {
        const expo = easing((t - begin) / duration);
        this.value = this.span * expo + this.from;
        return this.value;
    }
    set(to){
        this.to = to;
        this.from = this.value;
        this.span = to - this.from;
    }
    end() {
        return this.to;
    }
}
export default {
    name: 'pie',
    props: {
        start: Number,
        end: Number,
        color: String,
        data: String
    },
    data: {
        redius: 80,
        margin: 30,
        marginInAction: 30,
        focus: false,
        text: {
            x: 0,
            y: 0,
            angle: 0,
        },
        segments: [],
    },
    children(){
        if(this.$data.focus){
            const t = {
                ...this.$data.text,
                color: this.color,
                text: this.data,
            }
            const s = {
                breaks: this.$data.segments,
                color: this.color,
            }
            return [
                {
                    comp: TextTag,
                    attrs: t
                },
                {
                    comp: Segments,
                    attrs: s
                }
            ]
        }else{
            return [];
        }
    },
    handlers: {
        mouseenter(){
            this.$data.focus = true;
            this.$data.margin = 40;
            this.$dispatch('pieenter', {
                idx: this.idx,
            });
        },
        mouseleave(){
            this.$data.focus = false;
            this.$data.margin = 30;
            this.$dispatch('pieleave', {
                idx: this.idx,
            });
        }
    },
    mounted(){

        let begin, end, tween, lastTween;
        const duration = 500;
        const animate = (t) => {
            if (!begin) {
                begin = t;
                end = t + duration;
            }
            if(t > end){
                begin = null;
                end = null;
                tween.end();
                tween = null;
                return;
            }
            if(lastTween){
                begin = null;
                end = null;
                lastTween = null;
                return;
            }
            const curr = tween.tick(t, easeInOutQuad, begin, duration);
            this.$data.marginInAction = curr;
            window.requestAnimationFrame(animate);
        }
        this.$watch(() => this.$data.margin, (val, oldVal) => {
            if(tween) {
                oldVal = tween.value;
                lastTween = tween;
            }
            tween = new Tweenlet(oldVal, val);
            window.requestAnimationFrame(animate);
        });
        this.getSegments();
        this.$data.text = this.$data.segments[2];
        console.log(this.$data.segments);
    },
    render(g){
        if(this.start === this.end ) {
            g.clear();
            return;
        }
        // const padding = Math.PI/180;
        const radius2 = this.$data.redius;
        const radius = this.$data.redius + this.$data.marginInAction;
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
    },
    methods: {
        getCenter(){
            const startAngle = this.start;
            const endAngle = this.end;
            const r = this.$data.redius;
            var angle = (endAngle-startAngle)/2 + startAngle;
            return {
                x: Math.cos(angle) * (r + 30),
                y: Math.sin(angle) * (r + 30),
                angle,
            }
        },
        getSegments(){
            const begin = this.getCenter();
            const {
                angle, x, y
            } = begin;
            const length = this.$data.redius + 30 + 50;
            const breakY = Math.sin(angle) * length;
            const breakX = Math.cos(angle) * length;
            const l2 = 30;
            const endY = breakY;
            const endX = (begin.angle > Math.PI/2 && begin.angle < Math.PI*1.5) ? breakX - l2: breakX + l2;

            this.$data.segments = [
                {
                   x: x,
                   y: y
                },
                {
                    x: breakX,
                    y: breakY
                },
                {
                    x: endX,
                    y: endY
                }
            ]
        }
    }
};