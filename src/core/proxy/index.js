import Dep from './dep';
import Watcher from './watcher';
import { assert } from '../../utils/logger';
import { isFunction } from '../../utils/index';
import { Engine } from '../render'
import Vego from '../../../index'

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
            dp.depend();
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

export function initData(vm){
    const proxy = addOBProxy(vm.$options.data);
    vm.$data = proxy;
     Object.assign(vm, proxy);
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
            props.forEach((prop) => {
                const getter = attrs[prop];
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
                new Watcher({
                    vm: comp,
                    cb: function() {
                        this._update();
                    },
                    getter: function() {
                        return getter.call(vm)
                    }
                });
                Object.defineProperty(comp, prop, {
                    get(){
                        return getter.call(vm);
                    }
                })
            });
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
        new Watcher({
            vm,
            cb: function(){
                const oldChildren = vm.$children.slice();
                const oldKeys = oldChildren.map(({key}) => key);
                let newArr = children();
                let needChange = [];
                newArr = newArr.map(({key}, idx) => {
                    const changed = oldKeys.indexOf(key) === -1;
                    if(changed){
                        needChange.push(idx)
                    }
                    return changed ? newArr[idx] : oldChildren[idx]
                });
                vm.$children = observeChildren(newArr, vm);
                vm.$children.forEach((child, idx) => {
                    if(needChange.indexOf(idx) !== -1){
                        child.comp._update();
                    }
                })
                // 删除或添加的 vm.$children
                // Engine.run();
            },
            getter: function(){
                children();
            },
            shallow: true
        });
        vm.$children = observeChildren(children(), vm);
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