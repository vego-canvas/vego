const step = 30;
export default {
    name: 'rectangle',
    props: {
        height: Number,
        idx: Number,
        color: String,
        data: String
    },
    // data: {
    //     redius: 80,
    //     margin: 30,
    //     uuid: ~~(Math.random()*10),
    // },
    // handlers: {
    //     mouseenter(){
    //         this.$data.margin = 40;
    //     },
    //     mouseleave(){
    //         this.$data.margin = 30;
    //     }
    // },
    render(g){
        if(this.height === 0 ) {
            g.clear();
            return;
        }
        // const padding = Math.PI/180;
        const x = this.idx * step;
        g.clear().beginFill(this.color)
            .drawRoundRectComplex(x, 20, 20, this.height, 0, 0, 5, 5)
        // .moveTo(radius2*cos,radius2*sin)
        //     .lineTo(radius*cos,radius*sin)
        //     .arc(0,0,radius,startAngle,endAngle,0)
        //     .lineTo(radius2*cos2,radius2*sin2)
        //     .arc(0,0,radius2,endAngle,startAngle,1)
    },
    mounted(){
        this.$geometry.x = 200;
        this.$geometry.rotation = 180;
        this.$geometry.regX = 200;
        this.$geometry.regY = 150;
    }
};