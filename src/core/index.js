import normalize from './normalize';
import { initData, initChildren, initGeometry } from './proxy';
import initRender, {Engine} from './render';
import lifecycle, { callhook } from './lifecycle';
import { initEvent } from './event'
import Watcher from './proxy/watcher';
import {nextTick} from './queue/nextTick';
let uid = 0;
function initialize(Vego){
    const p = Vego.prototype;
    p._init = _init;
    Vego.Engine = new Engine();
}
function _init(config){
    // 实例不要走一开始创建，会导致uid自增，然后导致绘制顺序出错
    this._uid = uid++;
    const Engine = this.constructor.Engine;
    this._watchers = [];
    normalize(this, config);

    initEvent(this);
    initRender(this);
    initData(this);
    initChildren(this);
    initGeometry(this);
    lifecycle(this);
    callhook('created', this);
    this._mainWatcher = new Watcher({
        vm: this,
        cb: function() {
            this._update();
            Engine.run();
        },
        getter: function() {
            return this.$data;
        }
    }, true);
    // new Watcher({
    //     vm: this,
    //     cb: function() {
    //         Engine.run();
    //     },
    //     getter: function() {
    //         return this.$children;
    //     }
    // });
    this._mainGeomWatcher = new Watcher({
        vm: this,
        cb: function () {
            this._appendTransform();
            Engine.run();
        },
        getter: function(){
            return this.$geometry;
        }
    })
    nextTick(() => {
        callhook('mounted', this);
    }, this);

}
export default initialize;