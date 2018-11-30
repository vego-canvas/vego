import textTag from './textTag'
const step = 30;
export default {
    name: 'rectangle',
    props: {
        x: Number,
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
            const t = {
                ...this.$data.text,
                x: this.x,
                color: this.color,
                text: this.data,
            }
            console.log('focused')
            return [
                {
                    key: this.data,
                    comp: textTag,
                    attrs: t
                }
            ]
        }else{
            console.log('unfocus')
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
            .drawRoundRectComplex(this.x, -this.height, 20, this.height, 5, 5, 0, 0)
        // .moveTo(radius2*cos,radius2*sin)
        //     .lineTo(radius*cos,radius*sin)
        //     .arc(0,0,radius,startAngle,endAngle,0)
        //     .lineTo(radius2*cos2,radius2*sin2)
        //     .arc(0,0,radius2,endAngle,startAngle,1)
    },
    mounted(){
        // this.$geometry.rotation = 180;
        this.$geometry.y = 300;
        this.$geometry.regY = 150;
        this.$data.text.y = -this.height - 30;
    }
};