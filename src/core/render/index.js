import Graphics from './graphics';
import transformMixin, { injectTransform } from './geometry';
// import injectCurrentTransform from './contextmtx';
export default function initRender(vmp, options){
    vmp.$graphic = new Graphics()
    // 绘制对象缓存
    // const graphicCache = getNewCanvas()
    // vm._graphicCacheCanvas = graphicCache.canvas;
    // vm._graphicCacheContext = graphicCache.ctx;
    vmp.$render = options.render.bind(vmp);
    // 自身变形矩阵
    injectTransform(vmp);

}

export function rendermixin(Vego){
    Vego.prototype._render = function(ctx){
        // 父组件先与子组件绘制
       // console.log(`${this.name} graphics ${this.$graphic.instructions.length}`)
        this._applyTransform(ctx);
        this.$graphic.draw(ctx);
        // 保证绘制时子节点增多不会造成问题
        if(this.$children.length > 0){
            const children = this.$children.slice();
            children.forEach(({comp}) => {
                // 子组件绘制按写入顺序
                comp._render(ctx);
            })
        }

        this._applyTransformBack(ctx);
    }

    Vego.prototype._update = function(){
        // TODO 能更细粒度的更改指令么？比如从不调用clear就能比较两次的指令差别，更改指定的指令？
        this.$render(this.$graphic);
    }
    transformMixin(Vego);
    // hitTestMixin(Vego);
}
class Engine {
    constructor(){
        this._canvas = undefined;
        this._ctx = undefined;
        this._render = undefined;
        this._width = undefined;
        this._height = undefined;
        this._ratio = undefined;
    }
    setCanvas(canvas, ratio){
        this._ratio = ratio;
        this._canvas = canvas;
        this._ctx = canvas.getContext('2d');
        this._width = this._canvas.width;
        this._height = this._canvas.height
        // injectCurrentTransform(this._ctx);
    }
    run(){
        const ctx = this._ctx;
        ctx.clearRect(0,0,this._width + 1, this._height + 1);
        ctx.save();
        ctx.scale(this._ratio, this._ratio);
        this._render(ctx);
        ctx.restore();
    }
}
export {
    Engine
}