import EventDispatcher from '../event/EventDispatcher';
import { mat2d } from 'gl-matrix';
const DEG_TO_RAD = Math.PI / 180;
// let uid = 0;
export default class Layer extends EventDispatcher {
    constructor() {
        super();
        this.$matrix = mat2d.create();
        this.$geometry = {
            x: 0,
            y: 0,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            skewX: 0,
            skewY: 0,
            regX: 0,
            regY: 0,
        };
        if (!this.$children)
            this.$children = [];
    }

    _applyTransform(ctx) {
        const mtx = this.$matrix;
        ctx.save();
        ctx.transform(mtx[0], mtx[1], mtx[2], mtx[3], mtx[4], mtx[5]);
    }

    _applyTransformBack(ctx) {
        ctx.restore();
    }

    _appendTransform() {
        const {
            x, y, rotation, scaleX, scaleY, regX, regY,
        } = this.$geometry;
        let {
            skewX, skewY,
        } = this.$geometry;
        let cos;
        let sin;
        const mtx = mat2d.create();
        if (rotation % 360) {
            const r = rotation * DEG_TO_RAD;
            cos = Math.cos(r);
            sin = Math.sin(r);
        } else {
            cos = 1;
            sin = 0;
        }
        if (skewX || skewY) {
            // TODO: can this be combined into a single append operation?
            skewX *= DEG_TO_RAD;
            skewY *= DEG_TO_RAD;
            mat2d.multiply(mtx, mtx, [Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y]);
            mat2d.multiply(mtx, mtx, [cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0]);
        } else {
            mat2d.multiply(mtx, mtx, [cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y]);
        }

        if (regX || regY) {
            // append the registration offset:
            mtx[4] -= regX * mtx[0] + regY * mtx[2];
            mtx[5] -= regX * mtx[1] + regY * mtx[3];
        }
        mat2d.copy(this.$matrix, mtx);
    }

    _render(ctx) {
        /*
         * 父组件先与子组件绘制
         * console.log(`${this.name} graphics ${this.$graphic.instructions.length}`)
         */
        this._applyTransform(ctx);

        this.$graphic && this.$graphic.draw(ctx);
        // 保证绘制时子节点增多不会造成问题
        // console.log(this.$children)
        if (this.$children.length > 0) {
            const children = this.$children.slice();
            children.forEach((comp) => {
                // 子组件绘制按写入顺序
                comp._render(ctx);
            });
        }

        this._applyTransformBack(ctx);
    }

    _getTargets({
        x, y, targets, condition,
    }, currentLayer, mtx) {
        currentLayer = currentLayer || 0;
        const currentLayerMtx = mat2d.create();
        if (!mtx)
            mat2d.copy(currentLayerMtx, this.$matrix);
        else
            mat2d.multiply(currentLayerMtx, mtx, this.$matrix);
        const children = this.$children;
        if (condition(x, y, currentLayerMtx, this.$graphic)) {
            targets.push(this);
        }
        children.forEach(( comp ) => {
            comp._getTargets({
                x, y, targets, condition,
            }, currentLayer + 1, currentLayerMtx);
        });
    }
}
