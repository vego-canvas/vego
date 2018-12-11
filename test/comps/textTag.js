
export default {
    name: 'textTag',
    props: {
        text: String,
        x: Number,
        y: Number,
        color: String,
    },
    mounted(){
        this.$geometry.x = this.x;
        this.$geometry.y = this.y;
        // this.$geometry.rotation = 180;
        //console.log(this.x, this.y, this.color, this.text)
    },
    render(g){
        console.log(this.text);
        g.clear()
            .drawText(this.text, {color: this.color, font: '20px sans-serif'});
    },
};