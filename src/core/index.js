import normalize from './normalize';
import { initData, initChildren, initGeometry } from './proxy';
import initRender, {Engine} from './render';
import lifecycle, { callhook } from './lifecycle';
import { initEvent } from './event'
import Watcher from './proxy/watcher';
let uid = 0;
function initialize(Vego){
    const p = Vego.prototype;
    p._init = _init;
    Vego.Engine = new Engine();
}
function _init(config){
    this._uid = uid++;
    const Engine = this.constructor.Engine;
    normalize(this, config);
    initEvent(this);
    initRender(this);
    initData(this);
    initChildren(this);
    initGeometry(this);
    lifecycle(this);

    new Watcher({
        vm: this,
        cb: function() {
            this._update();
            Engine.run();
        },
        getter: function() {
            return this.$data;
        }
    });
    // new Watcher({
    //     vm: this,
    //     cb: function() {
    //         Engine.run();
    //     },
    //     getter: function() {
    //         return this.$children;
    //     }
    // });
    new Watcher({
        vm: this,
        cb: function () {
            this._appendTransform();
            Engine.run();
        },
        getter: function(){
            return this.$geometry;
        }
    })
    callhook('mounted', this);
}
export default initialize;