import normalize from './normalize';
import { initData, initChildren, initProps, initProxy, initMethods } from './proxy';
import initRender, { Engine } from './render';
import initLifecycle, { callhook } from './lifecycle';
import { initEvent } from './event'
import Watcher from './proxy/watcher';
import { nextTick } from './queue/nextTick';
let uid = 0;
function initialize(Vego){
    const p = Vego.prototype;
    p._init = _init;
    Vego.Engine = new Engine();
}
function _init(config, parent){
    // 实例不要走一开始创建，会导致uid自增，然后导致绘制顺序出错
    this._uid = uid++;
    this._watchers = [];

    if(parent){
        this.$parent = parent;
    }
    let options = normalize(this, config);
    const _p = initProxy(this, options)
    initEvent(_p, options);
    initMethods(_p, options);
    initRender(_p, options);
    initData(_p, options);
    initProps(_p, options);
    initChildren(_p, options);
    // initGeometry(this);
    initLifecycle(_p, options);

    callhook('created', this);

    new Watcher({
        vm: _p,
        cb: function() {
            this._update();
            // Engine.run();
        },
        getter: function() {
            return this;
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
    new Watcher({
        vm: _p,
        cb: function () {
            this._appendTransform();
            // Engine.run();
        },
        getter: function(){
            return this.$geometry;
        }
    })
    nextTick(() => {
        callhook('mounted', this);
    }, this);
    options = null
    return _p;

}
export default initialize;