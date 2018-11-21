
export default {
    name: 'pie',
    props: {
        start: Number,
        end: Number,
        color: String,
        data: String
    },
    data: {
        redius: 80,
        margin: 30,
        uuid: ~~(Math.random()*10),
    },
    handlers: {
        mouseenter(){
            this.$data.margin = 40;
        },
        mouseleave(){
            this.$data.margin = 30;
        }
    },
    render(g){
        const radius2 = this.$data.redius;
        const radius = this.$data.redius + this.$data.margin;
        const startAngle = this.start;
        const endAngle = this.end;
        //外側
        var cos=Math.cos(startAngle);
        var sin=Math.sin(startAngle);
        //内側
        var cos2=Math.cos(endAngle);
        var sin2=Math.sin(endAngle);
        //内からstart
        g.clear().beginFill(this.color).moveTo(radius2*cos,radius2*sin)
        .lineTo(radius*cos,radius*sin)
        .arc(0,0,radius,startAngle,endAngle,0)
        .lineTo(radius2*cos2,radius2*sin2)
        .arc(0,0,radius2,endAngle,startAngle,1)
    }
};