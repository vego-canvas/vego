import Dep from './dep';
import Watcher from './watcher';
import { isFunction } from '../../utils/index';
import Vego from '../../../index'

let bind = true
function addOBProxy(obj, shallow){
    const isA = Array.isArray(obj);
    const isObj = (obj.constructor && obj.constructor === Object);
    if(!isA && !isObj) return obj;

    const dp = new Dep()
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
    const observeHandlers = {
        get: function(obj, prop, value){
            bind ? dp.depend(): dp.undepend();
            return obj[prop]
        },
        set: function(obj, prop, value){
            const oldValue = obj[prop];
            if(value !== oldValue){
                obj[prop] = addOBProxy(value);
                dp.notify();
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

function observeChildren(children, vm) {
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


export function initChildren(vm) {
    const children = vm.$options.children;
    if(Array.isArray(children)){
        vm.$children = observeChildren(children, vm);
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
                const needChange = [];
                const needChangeKey = [];
                newArr = newArr.map(({key}, idx) => {
                    const changed = oldKeys.indexOf(key) === -1;
                    if(changed){
                        needChange.push(idx)
                        needChangeKey.push(key);
                    }
                    return changed ? newArr[idx] : oldChildren[idx]
                });
                // 销毁不需要的节点的watcher
                oldChildren.forEach(({key, comp}) => {
                    if (needChangeKey.indexOf(key) === -1){
                        comp.unbindAllWatcher()
                    }
                });

                // 对新的子节点重新绑定watcher
                vm.$children = observeChildren(newArr, vm);
                vm.$children.forEach((child, idx) => {
                    if(needChange.indexOf(idx) !== -1){
                        child.comp._update();
                    }
                })

                // 更新视图
                vm._mainWatcher.get();
                // 删除或添加的 vm.$children
                // Engine.run();
            },
            getter: function(){
                queue = children();
                return queue;
            },
            shallow: true
        });
        // vm._childrenWatcher = childrenWatcher;
        vm.$children = observeChildren(queue, vm);
        // childrenComp = observeChildren(queue, vm);
    }

    // vm.$children = addOBProxy(childrenComp, true);
}

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