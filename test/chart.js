import Vego from '../index';
import Pie from './comps/pie';
import Rect from './comps/rectangle';
import Bezier from './comps/bezierSegments';
import Axis from './comps/axis';
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }



function getData(l){
    return new Promise((resolve) => {
        setImmediate(() => {
            const data = new Array(l || ~~(Math.random() * 5 + 5)).fill(0).map(() => ({
                data: ~~(Math.random() * 100),
                name: Math.random().toString(36).substr(2),
                color: getRandomColor()
            }));
            resolve(data)
        });
    })
}
const app = new Vego({
    name: 'background',
    data: {
        origin: [],
        rect: [],
        bezier: [],
        axis: {},
    },
    children(){
        return [
            {
                comp: Axis,
                attrs: this.$data.axis
            },
            ...this.$data.origin.map((dt, idx) => ({
                key: dt.name,
                comp: Pie,
                attrs: dt
            })),
            ...this.$data.rect.map((dt, idx) => ({
                key: `rect-${dt.name}`,
                comp: Rect,
                attrs: dt
            })),
            ...this.$data.bezier.map((dt, idx) =>({
                key: `bezier-${dt.name}`,
                comp: Bezier,
                attrs: dt
            }))
        ]
    },
    render(g){
        g.clear()
    },
    created(){
        console.log(this);

        getData().then(this.handleData);
        const btn = document.createElement('button');
        btn.innerText = "click me!"
        document.body.append(btn);
        btn.addEventListener('click', () => {
            getData().then((dt) => {
                console.log('data then')
                this.handleData(dt, true)
            });
        })

        const change = document.createElement('button');
        change.innerText = "change!"
        document.body.append(change);
        change.addEventListener('click', () => {
            this.changePortion();
        })
    },
    handlers: {
        rectenter(event){
            event.stopPropagation();
            console.log(event.payload);
        },
        rectleave(event){
            event.stopPropagation();
            console.log(event.payload);
        },
        pieenter(event){
            event.stopPropagation();
            console.log(event.payload);
        },
        pieleave(event){
            event.stopPropagation();
            console.log(event.payload);
        }
    },
    methods: {
        handleData(dt, flag) {
            console.log(this);
            console.log(dt)
            // if(flag) return ;
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
            this.$data.origin = portions.map((portion) => {
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

            const biggest = dt.reduce((accu, curr) => curr.data > accu ? curr.data: accu, 0);
            const height = 200;
            const left = 150;
            const ratio = height/biggest;
            const points = [];
            const step = 30;
            this.$data.rect = dt.map((portion, idx) => {
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
            })

            this.$data.bezier = this.bzCurve(points).map((pt, idx) => {

                return {
                    points: pt,
                    preColor: dt[idx] ? dt[idx].color: '#fff',
                    color: dt[idx+1].color,
                    data: dt[idx+1].data,
                    name: dt[idx+1].name
                }
            });
            console.log(this.$data.bezier );

            this.$data.axis = {
                width: 300,
                height: height+50,
                ratioY: ratio,
                ratioX: 30,
                x: left,
                y: 0,
            }

            this.$geometry.x = this.$geometry.y = 200;


        },
        changePortion(){
            const l = this.$data.origin.length;
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
                    // this.$data.origin[idx].start = start;
                    // this.$data.origin[idx].end = end;
                    // this.$data.origin[idx].color = portion.color;
                    // this.$data.origin[idx].data = portion.data;
                    // this.$data.origin[idx].name = portion.name;
                    this.$data.origin[idx] = {
                        start,
                        end,
                        color: portion.color,
                        data: portion.data,
                        name: portion.name
                    };
                });

                const biggest = dt.reduce((accu, curr) => curr.data > accu ? curr.data: accu, 0);
                const height = 200;
                const ratio = height/biggest;
                dt.forEach((portion, idx) => {
                    this.$data.rect[idx] = {
                        height: portion.data * ratio,
                        idx,
                        color: portion.color,
                        data: portion.data,
                        name: portion.name
                    };
                })
                this.$geometry.x = this.$geometry.y = 200;
                console.log(this.$data.origin);
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