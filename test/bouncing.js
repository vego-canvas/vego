import Vego from '../index';
import Ease from '../src/utils/Easing';

const ball = new Vego({
    data(){
        return {
            width: 50,
            height: 50,
        }
    },
    render(g){
        g.clear()
            .setStrokeStyle(5, "round", "round")
				.beginStroke("#000000")
				.beginFill("#F24828")
				.drawCircle(0, 0, 55)
				.setStrokeStyle(1, "round", "round")
				.beginStroke("#000000")
				.moveTo(0, 0)
				.lineTo(55, 0);
    },
    mounted(){
        this.$geometry.x = 80;
        this.$geometry.y = 150
        this.animateLoop();
    },
    methods: {
        animateLoop(){
            this.$to({
                $geometry: {
                    y: 700,
                    rotation: 90
                }
            }, 2000, Ease.bounce).then(() => {
                return this.$to({
                    $geometry:{
                        x: 720,
                        rotation: 180
                    }
                }, 1200, Ease.easeOutBounce);
            }).then(() => {
                return this.$to({
                    $geometry:{
                        scaleX: 1.5,
                        scaleY: 1.5,
                    }
                }, 500, Ease.easeOutExpo);
            }).then(() => {
                return this.$to({
                    $geometry:{
                        scaleX: 1,
                        scaleY: 1,
                    }
                }, 500, Ease.easeOutExpo);
            }).then(() => {
                return this.$to({
                    $geometry:{
                        y: 150,
                        rotation: 270
                    }
                }, 1200, Ease.bouncePast);
            }).then(() => {
                return this.$to({
                    $geometry:{
                        x: 80,
                        rotation: 360
                    }
                }, 1200, Ease.easeInOutBack);
            }).then(this.animateLoop)
        }
    }
});
ball.$mount('app');