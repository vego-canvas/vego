
export default {
    name: 'segments',
    props: {
        breaks: Array,
        color: String,
    },
    render(g){
        let l = this.breaks.length, i=0;
        const {
            x, y
        } = this.breaks[0]
        g = g.clear().beginStroke(this.color).moveTo(x, y);
        while(i++<l-1){
            const {
                x, y
            } = this.breaks[i]
            g.lineTo(x, y);
        }
    },
};