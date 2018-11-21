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

const data =  new Array(10).fill(0).map(() => ({
    data: ~~(Math.random() * 100),
    name: Math.random().toString(36).substr(2),
    color: getRandomColor()
}));

function getData(){
    return Promise.resolve(data);
}
const app = new Vego({
    name: 'background',
    data: {
        origin: [],
    },
    children(){
        return this.$data.origin.map((dt) => ({
            key: dt.name,
            comp: Chart,
            attrs: {
                start: function(){ return dt.start; },
                end: function(){ return dt.end; },
                color: function(){ return dt.color; },
                data: function(){ return dt.data; },
            }
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

        getData().then(dt => {

            const sum = dt.reduce((accu, curr) => accu + curr.data, 0);
            let start = 0;
            let end = 0;
            let s = 0, p = 0;
            dt.forEach((portion) => {
                s += portion.data;
                p = s / sum * Math.PI * 2;
                start = end;
                end = p > Math.PI * 2 ? Math.PI * 2 : p;
                this.$data.origin.push({
                    start,
                    end,
                    color: portion.color,
                    data: portion.data,
                    name: portion.name
                });
            });
            this.$geometry.x = this.$geometry.y = 150;
        });
    }
});
app.$mount('app');