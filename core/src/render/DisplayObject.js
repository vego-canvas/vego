import Layer from './Layer';
import Graphics from './graphics';

export default class DisplayObject extends Layer {
    constructor(uid, render) {
        super();
        this.uid = uid;
        const graphic = new Graphics();
        Object.defineProperty(this, '$graphic', {
            value: graphic,
        })
        this.$render = render;
    }
    _update(){
        // TODO 能更细粒度的更改指令么？比如从不调用clear就能比较两次的指令差别，更改指定的指令？
        this.$render(this.$graphic);
    }
}
