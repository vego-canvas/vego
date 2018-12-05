// import textTag from './textTag'
export default {
    name: 'rectangle',
    props: {
        x: Number,
        height: Number,
        idx: Number,
        color: String,
        data: String
    },
    data: {
        focus: false,
        text: {
            x: 0, y: 0
        }
    },
    handlers: {
        mouseenter(){
            this.focus = true;
        },
        mouseleave(){
            this.focus = false;
        }
    },
    render(g){
        if(this.height === 0 ) {
            g.clear();
            return;
        }
        g.clear().beginFill(this.color)
            .drawRoundRectComplex(this.x, -this.height, 20, this.height, 5, 5, 0, 0)
    },
    mounted(){
        // this.$geometry.rotation = 180;
        this.$geometry.y = 300;
        this.$geometry.x = 200;
    }
};