export default {
    props: {
        geox: {
            type: Number,
            default: 0,
        },
        geoy: {
            type: Number,
            default: 0,
        },
        rotation: {
            type: Number,
            default: 0,
        },
        scaleX: {
            type: Number,
            default: 1,
        },
        scaleY: {
            type: Number,
            default: 1,
        },
        skewX: {
            type: Number,
            default: 0,
        },
        skewY: {
            type: Number,
            default: 0,
        },
        regX: {
            type: Number,
            default: 0,
        },
        regY: {
            type: Number,
            default: 0,
        }
    },
    watch: {
        geox(val) {
            this.vegoDisplayObject.$geometry.x = val;
        },
        geoy(val) {
            this.vegoDisplayObject.$geometry.y = val;
        },
        rotation(val) {
            this.vegoDisplayObject.$geometry.rotation = val;
        },
        scaleX(val) {
            this.vegoDisplayObject.$geometry.scaleX = val;
        },
        scaleY(val) {
            this.vegoDisplayObject.$geometry.scaleY = val;
        },
        skewX(val) {
            this.vegoDisplayObject.$geometry.skewX = val;
        },
        skewY(val) {
            this.vegoDisplayObject.$geometry.skewY = val;
        },
        regX(val) {
            this.vegoDisplayObject.$geometry.regX = val;
        },
        regY(val) {
            this.vegoDisplayObject.$geometry.regY = val;
        },
    },
    mounted(){
        this.vegoDisplayObject.$geometry.x = this.geox;
        this.vegoDisplayObject.$geometry.y = this.geoy;
        this.vegoDisplayObject.$geometry.rotation = this.rotation;
        this.vegoDisplayObject.$geometry.scaleX = this.scaleX;
        this.vegoDisplayObject.$geometry.scaleY = this.scaleY;
        this.vegoDisplayObject.$geometry.skewX = this.skewX;
        this.vegoDisplayObject.$geometry.regX = this.regX;
        this.vegoDisplayObject.$geometry.regY = this.regY;
    },
    draw(g){

    }
}