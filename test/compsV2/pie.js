import TextTag from './textTag';
import Ease from '../../src/utils/Easing';
import Segments from './segments';

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
            focus: false,
            text: {
                x: 0,
                y: 0,
                angle: 0,
            },
            segments: [],
        }
    },
    children(){
        if(this.focus){
            const t = Object.assign({}, this.text, {
                color: this.color,
                text: this.data,
            });

            const s = {
                breaks: this.segments,
                color: this.color,
            }
            return [
                {
                    comp: TextTag,
                    scope: t
                },
                {
                    comp: Segments,
                    scope: s
                }
            ]
        }else{
            return [];
        }
    },
    handlers: {
        mouseenter(){
            this.focus = true;
            this.$to({
                margin: 40
            }, 400, Ease.easeInCubic);
        },
        mouseleave(){
            this.focus = false;
            this.$to({
                margin: 30
            }, 400, Ease.easeInBack);
        }
    },
    mounted(){
        this.$geometry.x = this.$geometry.y = 200;
        this.getSegments();
        this.text = this.segments[2];
    },
    render(g){
        if(this.start === this.end ) {
            g.clear();
            return;
        }
        const radius2 = this.redius;
        const radius = this.redius + this.margin;
        const startAngle = this.start;
        const endAngle = this.end;
        var cos=Math.cos(startAngle);
        var sin=Math.sin(startAngle);
        var cos2=Math.cos(endAngle);
        var sin2=Math.sin(endAngle);
        g.clear().beginFill(this.color).moveTo(radius2*cos,radius2*sin)
            .lineTo(radius*cos,radius*sin)
            .arc(0,0,radius,startAngle,endAngle,0)
            .lineTo(radius2*cos2,radius2*sin2)
            .arc(0,0,radius2,endAngle,startAngle,1)
    },
    methods:{
        getCenter(){
            const startAngle = this.start;
            const endAngle = this.end;
            const r = this.redius;
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
            const length = this.redius + 30 + 50;
            const breakY = Math.sin(angle) * length;
            const breakX = Math.cos(angle) * length;
            const l2 = 30;
            const endY = breakY;
            const endX = (begin.angle > Math.PI/2 && begin.angle < Math.PI*1.5) ? breakX - l2: breakX + l2;

            this.segments = [
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
}