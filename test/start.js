import Vego from '../index';
import Ease from '../src/utils/Easing';
const easeInOutQuad = Ease.easeInOutQuad;
class Tweenlet {
    constructor(from, to) {
        this.from = from;
        this.to = to;
        this.span = to - from; // TODO span in color
    }

    tick(t, easing, begin, duration) {
        const expo = easing((t - begin) / duration);
        return this.span * expo + this.from;
    }
    end() {
        return this.to;
    }
}

const heart = {
    name: 'heart',
    props: {
        config: Object,
        // fill: String
    },
    data: {
        stroke: 'black',
        strokeWidth: 3,
        fill: 'green',
    },
    handlers: {
        mouseenter(){
            console.log('enter')
            this.$data.fill = 'red';
        },
        mouseleave(){
            console.log('leave')
            this.$data.fill = 'green';
        }
    },
    render(g){
        const {
            config
        } = this;
        const {
            stroke, fill, strokeWidth
        } = this.$data;
        const k = config.k
        const d = config.d;
        g.clear()
            .setStrokeStyle(strokeWidth)
            .beginStroke(stroke)
            .beginFill(fill)
            .moveTo(k, k + d / 4)
            .quadraticCurveTo(k, k, k + d / 4, k)
            .quadraticCurveTo(k + d / 2, k, k + d / 2, k + d / 4)
            .quadraticCurveTo(k + d / 2, k, k + d * 3/4, k)
            .quadraticCurveTo(k + d, k, k + d, k + d / 4)
            .quadraticCurveTo(k + d, k + d / 2, k + d * 3/4, k + d * 3/4)
            .lineTo(k + d / 2, k + d)
            .lineTo(k + d / 4, k + d * 3/4)
            .quadraticCurveTo(k, k + d / 2, k, k + d / 4)
    },
    mounted(){
        let p = false
        let tween = null;
        let begin = null;
        let end = null;
        let duration = 500;

        const animate = (t) => {
            if (!begin) {
                begin = t;
                end = t + duration;
            }
            if(t > end){
                begin = null;
                end = null;
                tween.end();
                return;
            }
            this.$geometry.scaleX = this.$geometry.scaleY = tween.tick(t, easeInOutQuad, begin, duration);
            window.requestAnimationFrame(animate);
        }

        // setInterval(() => {

        //     tween = p ? new Tweenlet(1.5, 1): new Tweenlet(1, 1.5);
        //     p = !p;
        //     window.requestAnimationFrame(animate);
        // }, 1000);
        // setInterval(() => {
        //     this.stroke = p?'white':'black';
        //     this.fill = p? 'red':'green';
        //     p = !p;
        // }, 400);
    }
}
const app = new Vego({
    name: 'background',
    data: {
        stroke: 'green',
        fill: 'yellow',
        rect: {
            x: 0,
            y: 0,
            w: 200,
            h: 200,
        },
        heart: {
            k: 25,
            d: 150,
        },
        heartsmall: {
            k: 5,
            d: 50,
        }
    },
    children(){
        return [
            {
                comp: heart,
                attrs: {
                    config: this.$data.heart,
                }
            },
            {
                comp: heart,
                attrs: {
                    config: this.$data.heartsmall,
                }
            }
        ]
    },
    render(g){
        const {
            stroke, fill, rect
        } = this.$data;
        g.clear().setStrokeStyle(1).beginStroke(stroke).beginFill(fill).drawRect(rect.x, rect.y, rect.w, rect.h);
    },
    mounted(){

    }
});

app.$mount('app');
