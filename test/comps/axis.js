export default {
    name: 'axis',
    props: {
        width: Number,
        height: Number,
        ratioY: Number,
        ratioX: Number,
        x: Number,
        y: Number,
    },

    render(g){
        const {
            x, y, width, height
        } = this;
        g.clear()
            .beginStroke("#495a80")
            .setStrokeStyle(3)
            .moveTo(x, y)
            .lineTo(x + width, y)
            .moveTo(x, y)
            .lineTo(x, y - height);

    },
    mounted(){
        this.$geometry.y = 300;
        this.$geometry.regY = 150;
    }
};