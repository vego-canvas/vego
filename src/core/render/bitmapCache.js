import { getNewCanvas } from '../../utils'
class bitmapCache {
    constructor(x, y, width, height){
        const cached = getNewCanvas();
        this.cachedctx = cached.ctx;
        this.cachedcanvas = cached.canvas;
        this.cache = null;
        this.bound = {
            x, y, width, height
        }
    }

}