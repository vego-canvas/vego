import { mat2d } from 'gl-matrix';

export function injectTransform(vm){
    vm.$matrix = mat2d.create();
    vm._geometry = {
        x: 0,
        y: 0,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        skewX: 0,
        skewY: 0,
        regX: 0,
        regY: 0
    };
}
const DEG_TO_RAD = Math.PI/180;
export default function transformMixin(Vego){
    Vego.prototype._applyTransform = function(ctx){
        const mtx = this.$matrix;
        ctx.save();
        ctx.transform(mtx[0], mtx[1], mtx[2], mtx[3], mtx[4], mtx[5]);
    }

    Vego.prototype._applyTransformBack = function (ctx) {
        ctx.restore();
    }
    Vego.prototype._appendTransform = function(){
        const {
           x, y, rotation, scaleX, scaleY, skewX, skewY, regX, regY
        } = this._geometry;
        const mtx = mat2d.create();
        if (rotation%360) {
			var r = rotation * DEG_TO_RAD;
			var cos = Math.cos(r);
			var sin = Math.sin(r);
		} else {
			cos = 1;
			sin = 0;
        }
        if (skewX || skewY) {
			// TODO: can this be combined into a single append operation?
			skewX *= DEG_TO_RAD;
			skewY *= DEG_TO_RAD;
			mat2d.multiply(mtx, mtx, [Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y]);
			mat2d.multiply(mtx, mtx, [cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, 0, 0]);
		} else {
			mat2d.multiply(mtx, mtx, [cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, x, y]);
		}

		if (regX || regY) {
			// append the registration offset:
			mtx[4] -= regX*mtx[0]+regY*mtx[2];
			mtx[5] -= regX*mtx[1]+regY*mtx[3];
        }
        mat2d.copy(this.$matrix, mtx);
    }
}