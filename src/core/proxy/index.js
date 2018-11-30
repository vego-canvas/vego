import Dep from './dep';
import Watcher from './watcher';
import { isFunction } from '../../utils/index';
import Vego from '../../../index'
import { queueWatcher } from '../queue';

function addOBProxy(obj, shallow){
    const isA = Array.isArray(obj);
    const isObj = (obj.constructor && obj.constructor === Object);
    if(!isA && !isObj) return obj;

    // const dp = new Dep()
    const dp = {};
    if(!shallow){
        let i = 0;
        if(isA){
            for(; i < obj.length; i++){
                obj[i] = addOBProxy(obj[i]);
            }
        }
        if(isObj){
            const keys = Object.keys(obj);
            for(; i < keys.length; i++){
                obj[keys[i]] = addOBProxy(obj[keys[i]]);
            }
        }
    }
    // get的时候要区分dep!!!!
    const observeHandlers = {
        get: function(obj, prop){
            if(!obj.hasOwnProperty(prop)) return obj[prop];
            if(!dp[prop])
                dp[prop] = new Dep();
            dp[prop].depend();
            return obj[prop]
        },
        set: function(obj, prop, value){
            const oldValue = obj[prop];
            if(value !== oldValue){
                obj[prop] = addOBProxy(value);
                dp[prop].notify();
            }
            return true
        }
    }
    return new Proxy(obj, observeHandlers);
}
export default addOBProxy;
export function initWatcher(Vego){
    Vego.prototype.unbindAllWatcher = function () {
        let watcher = null;
        while (watcher = this._watchers.pop()) {
            watcher.del();
        }
        this._mainWatcher.del();
        this._mainGeomWatcher.del();
    }
    Vego.prototype.$watch = function(target, f){
        new Watcher({
            vm: this,
            cb: f,
            getter: () => {
                return target()
            },
            shallow: true,
        });
       // this._watchers.push(w);
    }
}
export function initData(vm){
    const proxy = addOBProxy(vm.$options.data);
    vm.$data = proxy;
     // Object.assign(vm, proxy);
}
export function initGeometry(vm){
    const proxy = addOBProxy(vm._geometry);
    vm.$geometry = proxy;
}

function observeChild (child){
    const comp = child.comp instanceof Vego ? child.comp: new Vego(child.comp)
    const attrs = child.attrs;
    const key = child.key;
    comp.$parent = this;

    const props = Object.keys(comp.$options.props);
    if(props.length){

        props.forEach((prop) => {
            Object.defineProperty(comp, prop, {
                get(){
                    return attrs[prop];
                }
            });
        });
        new Watcher({
            vm: comp,
            cb: function() {
                this._update();
                //comp._mainWatcher.get();???
            },
            getter: function() {
                return attrs
            }
        });
    }
    comp._update();
    return {
        key: key || comp._uid,
        comp
    }
}


export function initChildren(vm) {
    const children = vm.$options.children;
    if(Array.isArray(children)){
        vm.$children = children.map((child) => {
            observeChild.call(vm,child);
        });
    }
    if(isFunction(children)){
        let queue = null;
        const pp = new Watcher({
            vm,
            cb: function(){
                // 当children改变时，比较新旧children
                const oldChildren = vm.$children.slice();
                const oldKeys = oldChildren.map(({key}) => key);
                // 删除之前的依赖
                pp.del();
                // 更新当前新的依赖
                let newArr = pp.get();

                // 比较新旧的区别
                const recycle = [];
                const recycleKey = [];
                const newChildren = newArr.map(({key}, idx) => {
                    // 判断节点是否需要创建
                    // true 需要创建
                    const needNew = (oldKeys.indexOf(key) === -1);
                    if(!needNew){
                        recycle.push(idx)
                        recycleKey.push(key);
                    }

                    return needNew ? observeChild.call(vm, newArr[idx]) : oldChildren[idx]
                });

                // 销毁不需要的节点的watcher
                oldChildren.forEach(({key, comp}) => {
                    // 如果不属于recycle，销毁
                    if (recycleKey.indexOf(key) === -1){
                        comp.unbindAllWatcher()
                    }
                });

                // 对新的子节点重新绑定watcher
                vm.$children = newChildren;
                vm.$children.forEach((child, idx) => {
                    // 如果属于recycle
                    if(recycle.indexOf(idx) !== -1){
                        // console.log(Dep.currWatcher)
                        child.comp._update();
                    }
                })
                // 更新视图
                queueWatcher(vm._mainWatcher)
            },
            getter: function(){
                queue = children();
                return queue;
            },
            shallow: true
        });
        // vm._childrenWatcher = childrenWatcher;
        vm.$children = queue.map((child) => {
            return observeChild.call(vm,child);
        });
        // observeChildren(queue, vm);
        // childrenComp = observeChildren(queue, vm);
    }

    // vm.$children = addOBProxy(childrenComp, true);
}

// export function initWatchers(vm){
//     const watchers = vm.$options.watch;
//     for(let k in watchers){
//         const f = watchers[k];

//     }
// }
export function initProps(vm){
    const keys = Object.keys(vm.$options.props);
    const props = {};
    // keys.forEach(k => {
    //     props[keys] = (function(){
    //         this.$parent[keys];
    //     }).bind(vm);
    // })
    // Object.assign(vm, props)
}
// function initData(vm) {
//     log('initData start');
//     vm._dataProxy = addObserveProxy(vm.data);
//     log('initData end');
// }

// function initRender(vm){
//     log('initRender start');
//     const g = vm._graphic = new Graphic(vm);
//     vm._renderWatcher = new Watcher({
//         vm,
//         cb: () => {
//             vm.render.call(vm._dataProxy, g);
//         },
//         getter(){
//             return vm._dataProxy;
//         }
//     });
//     log('initRender end');
// }

// function initLifeCycle(vm) {
//     log('initLifeCycle start');
//     vm.$mount = function(el){
//         log('$mount', vm._dataProxy)
//         vm._ctx = el.getContext('2d')
//         vm.render.call(vm, vm.graphic);
//     }
//     log('initLifeCycle end');
// }

// class Vego {
//     constructor({
//         data,
//         render,
//     }){
//         this.data = data;
//         this.render = (g) => {
//             render.call(this._dataProxy, g);
//             g.run();
//         }
//         initLifeCycle(this);
//         initData(this);
//         initRender(this);
//     }
// }
// class Vego {
//     constructor({
//         data,
//         render
//     }){
//         Object.assign(this, addOBProxy(data));
//     }
// }
// export default Vego;
function observeChildren(children, needChange, vm) {
    return children.map(child => {
        const comp = child.comp instanceof Vego ? child.comp: new Vego(child.comp)
        const attrs = child.attrs;
        const key = child.key;
        comp.$parent = this;
        // comp.$parentMatrix = this.$matrix;
        // TODO 嵌套的Props解析
        const props = Object.keys(comp.$options.props);
        if(props.length){
            // let defaultVal;
            // const getters = {};
            props.forEach((prop) => {
                console.log(prop);
                // const getter = attrs[prop];
                // if(!vm.hasOwnProperty(key)){
                //     defaultVal = props[prop].default;
                //     if(defaultVal){
                //         comp[prop] = defaultVal;
                //         return
                //     }
                //     assert(`attr ${key} is not found in parent and it has no default value!`);
                //     return;
                // }
                // 一些校验逻辑

                Object.defineProperty(comp, prop, {
                    get(){
                        return attrs[prop];
                    }
                });
                // getters[prop] = getter.bind(vm);
            });
            const watcher = new Watcher({
                vm: comp,
                cb: function() {
                    this._update();
                    comp._mainWatcher.get();
                    // Vego.Engine.run();
                },
                getter: function() {
                    return attrs
                    // const obj = {};
                    // for (const key in getters) {
                    //     if (getters.hasOwnProperty(key)) {
                    //         const getter = getters[key];
                    //         obj[key] = getter();
                    //     }
                    // }
                    // return obj;
                }
            });
            comp._watchers.push(watcher)
        }
        return {
            key: key || comp._uid,
            comp
        }
    })
}
