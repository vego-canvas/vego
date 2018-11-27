import textTag from './textTag'
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
    data: {
        focus: false,
        text: {
            x: 0, y: 0
        }
    },
    children(){
        if(this.$data.focus){
            console.log('focused')
            return [
                {
                    key: this.data,
                    comp: textTag,
                    attrs: Object.assign(this.$data.text, {
                        color: this.color,
                        text: this.data,
                    })
                }
            ]
        }else{
            return [];
        }
    },
    handlers: {
        mouseenter(){
            this.$data.focus = true;
            console.log(this.idx)
            // this.$dispatch('rectenter', {
            //     idx: this.idx,
            // });
        },
        mouseleave(){
            this.$data.focus = false;
            // this.$dispatch('rectleave', {
            //     idx: this.idx,
            // });
        }
    },
    render(g){
        if(this.height === 0 ) {
            g.clear();
            return;
        }
        // const padding = Math.PI/180;
        g.clear().beginFill(this.color)
            .drawRoundRectComplex(0, 20, 20, this.height, 0, 0, 5, 5)
        // .moveTo(radius2*cos,radius2*sin)
        //     .lineTo(radius*cos,radius*sin)
        //     .arc(0,0,radius,startAngle,endAngle,0)
        //     .lineTo(radius2*cos2,radius2*sin2)
        //     .arc(0,0,radius2,endAngle,startAngle,1)
    },
    mounted(){
        this.$geometry.x =  this.idx * step;
        this.$geometry.rotation = 180;
        this.$geometry.regX = 150;
        this.$geometry.regY = 150;
        this.$data.text.y = this.height + 50;
    }
};