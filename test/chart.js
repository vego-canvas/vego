import Vego from '../index';
import Pie from './comps/pie';
import Rect from './comps/rectangle';
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
    },
    children(){
        return [
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
            const sum = dt.reduce((accu, curr) => accu + curr.data, 0);
            let start = 0;
            let end = 0;
            let s = 0, p = 0;

            this.$data.origin = dt.map((portion) => {
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

            const biggest = dt.reduce((accu, curr) => curr.data > accu ? curr.data: accu, 0);
            const height = 200;
            const ratio = height/biggest;
            this.$data.rect = dt.map((portion, idx) => {
                return {
                    height: portion.data * ratio,
                    idx,
                    color: portion.color,
                    data: portion.data,
                    name: portion.name
                };
            })
            this.$geometry.x = this.$geometry.y = 150;
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
                this.$geometry.x = this.$geometry.y = 150;
                console.log(this.$data.origin);
            });
        }
    }
});
app.$mount('app');