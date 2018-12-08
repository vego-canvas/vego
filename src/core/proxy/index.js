import Dep from './dep';
import Watcher from './watcher';
import { isFunction, addProxyTag, reservedAttrs, shallowAttrs } from '../../utils/index';
import Vego from '../../../index'
import { queueWatcher } from '../queue';

export function initWatcher(Vego){
    Vego.prototype.unbindAllWatcher = function () {
        let watcher = null;
        while (watcher = this._watchers.pop()) {
            watcher.del();
        }
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
    }
}

export function initMethods(vmp, options){
    const methods = options.methods;
    for(let f in methods){
        vmp[f] = methods[f].bind(vmp);
    }
}

export function initProps(vmp, options){
    const props = options.props;
    vmp._getProps = function(){
        // console.log(this)
        for(let k in props){
            if(!this.hasOwnProperty(k)){
                throw `${k} is not in parent scope!`
            }
            vmp[k] = this[k]
        }
        return this;
    }

}
export function initData(vmp, options){
    const data = options.data.call(vmp);
    Object.assign(vmp, data);
    // const proxy = addOBProxy(data);
    //vm.$data = proxy;
}
export function initGeometry(vm){
    const proxy = addOBProxy(vm._geometry);
    vm.$geometry = proxy;
}

function observeChild (child){
    const comp = child.comp instanceof Vego ? child.comp: new Vego(child.comp, this)
    const scope = child.scope;
    const key = child.key;

    new Watcher({
        vm: comp,
        cb: function() {
            this._update();
        },
        getter: function() {
            return  this._getProps.call(scope);
        }
    });
    return {
        key: key || comp._uid,
        comp
    }
}
export function initChildren(vmp, options) {
    const children = options.children.bind(vmp);
    let queue;
    const pp = new Watcher({
        vm: vmp,
        cb: function(){
            // 当children改变时，比较新旧children
            const oldChildren = this.$children.slice();
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

                return needNew ? observeChild.call(this, newArr[idx]) : oldChildren[idx]
            });

            // 销毁不需要的节点的watcher
            oldChildren.forEach(({key, comp}) => {
                // 如果不属于recycle，销毁
                if (recycleKey.indexOf(key) === -1){
                    comp.unbindAllWatcher()
                }
            });

            // 对新的子节点重新绑定watcher
            this.$children = newChildren;
            this.$children.forEach((child, idx) => {
                // 如果属于recycle
                if(recycle.indexOf(idx) !== -1){
                    // console.log(Dep.currWatcher)
                    child.comp._update();
                }
            })
            // 更新视图
            queueWatcher(this._mainWatcher);
        },
        getter: function(){
            queue = children();
            return queue;
        },
        shallow: true
    });

    vmp.$children = queue.map((child) => {
        return observeChild.call(vmp, child, options);
    });
}

function addOBProxy(obj, shallow){
    const isA = Array.isArray(obj);
    const isPureObj = (obj.constructor && obj.constructor === Object);
    if((!isA && !isPureObj) || isFunction(obj) || obj.__isProxy__) return obj;
    addProxyTag(obj);
    if(!shallow){
        let i = 0;
        if(isA){
            for(; i < obj.length; i++){
                obj[i] = addOBProxy(obj[i], shallow);
            }
        }
        if(isPureObj){
            for(let key in obj){
                obj[key] = addOBProxy(obj[key], shallow)
            }
        }
    }
    return new Proxy(obj, createHandler());
}
function createHandler(){
    const deps = new Map();
    return {
        get(target, property, receiver){
            // if(!target.hasOwnProperty(property))
            //     throw `${property.toString()} is not in ${target}, please check your spell`;
            // if(isFunction(target[property])) return target[property];

            if(!isFunction(target[property]) && Dep.currWatcher){
                // console.log(Dep.currWatcher);
                const dp = deps.has(property) ? deps.get(property) : new Dep();
                deps.set(property, dp);
                dp.depend();
            }
            return Reflect.get(target, property, receiver);
        },
        set(target, property, value, receiver){
            if(!target.hasOwnProperty(property)){
                // 原来不存在
                if(!reservedAttrs(property)){
                    const py = addOBProxy(value);
                    target[property] = py;
                }else{
                    target[property] = value;
                }


            }else{
                // 已存在
                const oldValue = target[property];
                if(value !== oldValue){
                    if(!reservedAttrs(property)){
                        const py = addOBProxy(value);
                        target[property] = py;
                        deps.get(property).notify();
                    }
                }
            }
            return true;
        }
    }
}
export function initProxy(vm){
    const handler = createHandler();
    addProxyTag(vm);
    return new Proxy(vm, handler);
}