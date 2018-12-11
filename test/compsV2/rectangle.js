import TextTag from './textTag'
import Ease from '../../src/utils/Easing';
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
        },
    },
    handlers: {
        mouseenter(){
            this.focus = true;
            this.$to({
                $geometry:{
                    scaleX: 0.8,
                    scaleY: 1.2
                }
            }, 500, Ease.bounce).then(() => {
                this.$to({
                    $geometry:{
                        scaleX: 1,
                        scaleY: 1,
                    }
                }, 500, Ease.bounce)
            })
        },
        mouseleave(){
            this.focus = false;
        }
    },
    children(){
        if(this.focus){
            const t = Object.assign({}, this.text, {
                color: this.color,
                text: this.data,
            });

            return [
                {
                    comp: TextTag,
                    scope: t
                },
            ]
        }else{
            return [];
        }
    },
    render(g){
        if(this.height === 0 ) {
            g.clear();
            return;
        }
        g.clear().beginFill(this.color)
            .drawRoundRectComplex(0, -this.height, 20, this.height, 5, 5, 0, 0)
    },
    mounted(){
        this.$geometry.y = 300;
        this.$geometry.x = this.x + 210;
        this.$geometry.regX = 10
        this.text.y =  -this.height - 30;
    }
};