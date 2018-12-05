import Vego from '../index';
import Pie from './compsV2/pie';
import Rect from './compsV2/rectangle';
import Bezier from './compsV2/bezier';
import { getData } from './util';
const app = new Vego({
    name: 'background',
    data(){
        return {
            pies: [],
            rects: [],
            beziers: [],
        }
    },
    children(){
        return [
            ...this.pies.map((dt) => ({
                key: dt.name,
                comp: Pie,
                scope: dt,
            })),
            ...this.rects.map((dt) => ({
                key: `rect_${dt.name}`,
                comp: Rect,
                scope: dt,
            })),
            ...this.beziers.map((dt) => ({
                key: `bezier_${dt.name}`,
                comp: Bezier,
                scope: dt,
            })),
        ]
    },
    created(){
        getData().then(this.handleData);
        const btn = document.createElement('button');
        btn.innerText = "click me!"
        document.body.append(btn);
        btn.addEventListener('click', () => {
            getData().then((dt) => {
                console.log('data then')
                this.handleData(dt)
            });
        })

        const change = document.createElement('button');
        change.innerText = "change!"
        document.body.append(change);
        change.addEventListener('click', () => {
            this.changePortion();
        })
    },
    render(g){
        g.clear()
    },
    mounted(){
        console.log(this);
    },
    methods: {
        mkPie(dt){
            const sum = dt.reduce((accu, curr) => accu + curr.data, 0) + 3 * (dt.length-1);
            let start = 0;
            let end = 0;
            let s = 0, p = 0;

            const portions = dt.map((portion) => {
                s += portion.data;
                p = s / sum * Math.PI * 2;
                start = end;
                end = p > Math.PI * 2 ? Math.PI * 2 : p;
                return {
                    start,
                    end,
                    color: portion.color,
                    data: portion.data,
                    name: portion.name
                };
            });

            const span = (Math.PI * 2 - portions[portions.length-1].end) / (dt.length);
            let accu = 0;
            this.pies = portions.map((portion) => {
                const s = portion.end - portion.start;
                accu += span;
                const p = {
                    ...portion,
                    start: accu,
                    end: accu + s,
                }
                accu += s;
                return p;
            })
        },
        mkHistogram(dt){
            const biggest = dt.reduce((accu, curr) => curr.data > accu ? curr.data: accu, 0);
            const height = 200;
            const left = 150;
            const ratio = height/biggest;
            const points = [];
            const step = 30;
            this.rects = dt.map((portion, idx) => {
                points.push({
                    x: idx * step + left,
                    y: -portion.data * ratio + 300,
                })
                return {
                    x: idx * step + left,
                    height: portion.data * ratio,
                    idx,
                    color: portion.color,
                    data: portion.data,
                    name: portion.name
                };
            });
            return points;
        },

        mkBezier(dt, points){
            this.beziers = this.bzCurve(points).map((pt, idx) => {
                return {
                    points: pt,
                    preColor: dt[idx] ? dt[idx].color: '#fff',
                    color: dt[idx+1].color,
                    data: dt[idx+1].data,
                    name: dt[idx+1].name
                }
            });
        },
        handleData(dt) {
            this.mkPie(dt);
            const points = this.mkHistogram(dt);
            console.log(this.bzCurve(points))
            this.mkBezier(dt, points);
        },
        changePortion(){
            const l = this.pies.length;
            getData(l).then((dt) => {
                console.log(dt);
                const sum = dt.reduce((accu, curr) => accu + curr.data, 0);
                let start = 0;
                let end = 0;
                let s = 0, p = 0;
                dt.forEach((portion, idx) => {
                    s += portion.data;
                    p = s / sum * Math.PI * 2;
                    start = end;
                    end = p > Math.PI * 2 ? Math.PI * 2 : p;
                    this.pies[idx] = {
                        start,
                        end,
                        color: portion.color,
                        data: portion.data,
                        name: portion.name
                    };
                });
            });
        },
        gradient(a, b) {
            return (b.y - a.y) / (b.x - a.x);
        },
        bzCurve(points, f, t) {
            if (typeof (f) === 'undefined')
                f = 0.3;
            if (typeof (t) === 'undefined')
                t = 0.6;
            let m = 0;
            let dx1 = 0;
            let dy1 = 0;
            let preP = points[0];
            let dx2;
            let dy2;
            const beziers = [];
            //beziers.push(preP);
            for (let i = 1; i < points.length; i++) {
                const curP = points[i];
                const nexP = points[i + 1];
                if (nexP) {
                    m = this.gradient(preP, nexP);
                    dx2 = (nexP.x - curP.x) * -f;
                    dy2 = dx2 * m * t;
                } else {
                    dx2 = 0;
                    dy2 = 0;
                }
                beziers.push({
                    begin: {
                        x: preP.x,
                        y: preP.y
                    },
                    cp1: {
                        x: preP.x - dx1,
                        y: preP.y - dy1,
                    },
                    cp2: {
                        x: curP.x + dx2,
                        y: curP.y + dy2,
                    },
                    end: {
                        x: curP.x,
                        y: curP.y,
                    },
                });
                dx1 = dx2;
                dy1 = dy2;
                preP = curP;
            }
            return beziers;
        },
    }
});
app.$mount('app');
// const app = new Vego({
//     name: 'test',
//     data(){
//         return {
//             x: 50,
//             y: 50,
//             r: 50,
//             color: '#336678'
//         }
//     },
//     handlers: {
//         mouseenter(){
//             console.log('enter')
//             this.color = '#000';
//             console.log(this);
//         },
//         mouseleave(){
//             console.log('leave')
//             this.color = '#336678';
//         }
//     },
//     render(g){
//         g.clear()
//             .beginFill(this.color)
//             .drawCircle(this.x, this.y, this.r);
//     },
// });

// app.$mount('app');