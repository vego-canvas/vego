import Vego from './index';


const eclipse = new Vego({
    props: {
        config: Object,
        fill: String
    },
    data: {
        stroke: 'black'
    },
    render(g){
        const {
            stroke, fill, config
        } = this;
        g.beginStroke(stroke).beginFill(fill).drawCircle(config.x, config.y, config.r);
    }
})
const instance = new Vego({
    name: 'background',
    data: {
        stroke: 'red',
        fill: 'blue',
        rect: {
            x: 0,
            y: 0,
            w: 200,
            h: 200,
        },
        circle: {
            x: 100,
            y: 100,
            r: 50,
        }
    },
    children: [
        {
            comp: eclipse,
            attrs: {
                config: this.circle,
                fill: this.a,
            }
        }
    ],
    render(g){
        const {
            stroke, fill, rect
        } = this;
        g.beginStroke(stroke).beginFill(fill).drawRect(rect.x, rect.y, rect.w, rect.h);
    }
});


// instance.$mount('canvas');