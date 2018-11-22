import Vego from '../index';
import Chart from './comps/pie';
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
    },
    children(){
        return this.$data.origin.map((dt, idx) => ({
            key: dt.name,
            comp: Chart,
            attrs: dt
            // (){
            //     return {

            //     }
            //     start: function(){ console.log(idx); return this.$data.origin[idx].start; },
            //     end: function(){ return this.$data.origin[idx].end; },
            //     color: function(){ return this.$data.origin[idx].color; },
            //     data: function(){ return this.$data.origin[idx].data; },
            // }
        }));
    },
    render(g){
        // const {
        //     stroke, fill, rect
        // } = this;
        g.clear()//.setStrokeStyle(1).beginStroke(stroke).beginFill(fill).drawRect(rect.x, rect.y, rect.w, rect.h);
    },
    mounted(){
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
                    this.$data.origin[idx].start = start;
                    this.$data.origin[idx].end = end;
                    this.$data.origin[idx].color = portion.color;
                    this.$data.origin[idx].data = portion.data;
                    this.$data.origin[idx].name = portion.name;
                    // this.$data.origin[idx] = {
                    //     start,
                    //     end,
                    //     color: portion.color,
                    //     data: portion.data,
                    //     name: portion.name
                    // };
                });
                console.log(this.$data.origin);
            });
        }
    }
});
app.$mount('app');