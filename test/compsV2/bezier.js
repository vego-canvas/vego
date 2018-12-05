
export default {
    name: 'bezier-segments',
    props: {
        points: Object,
        preColor: String,
        color: String
    },

    render(g){
        const {
            begin, cp1, cp2, end
        } = this.points
        g.clear()
            .setStrokeStyle(3)
            .beginLinearGradientStroke([this.preColor, this.color], [0, 1], 0, begin.y, 0, end.y )
            .moveTo(begin.x, begin.y)
            .bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
    },
    mounted(){
        this.$geometry.y = 0;
        this.$geometry.x = 210;
    }
};