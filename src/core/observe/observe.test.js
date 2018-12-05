const p = new Vego({
    data(){
        return {
            a: this.getA(),
            b: {
                t: 5
            }
        }
    },
    methods:{
        getA(){
            return 3;
        },
        add(){
            this.a ++ ;
        },
        minus(){
            this.b.t --;
        }
    }
});
class Dep {
    constructor(){
        this.deps = new Map();
    }

    depend(){
        if(Dep.currWatcher)
            this.targets.set(Dep.currWatcher.uid, Dep.currWatcher);
    }
    notify(){
        this.targets.forEach(watcher => {
            watcher.update();
        })
    }
}

Dep.currWatcher = null;
const targetStack = []

export function pushTarget (_target) {
  if (Dep.currWatcher) targetStack.push(Dep.currWatcher)
  Dep.currWatcher = _target
}

export function popTarget () {
  Dep.currWatcher = targetStack.pop()
}

function observe(target){
    const dep = new Dep()
    const handler = {
        get(target, property, receiver){
            // The handler.get method is a trap for getting a property value.
            // target 目标对象, property 对象属性名或Symbol, receiver
            dep.depend();
        },
        set(target, property, value, receiver){
            // The handler.set method is a trap for setting property value.
            // target 目标对象, property 对象属性名或Symbol, receiver 通常是proxy自己，但是set可以原型链被间接调用
            // The set method should return a boolean value. Return true to indicate that assignment succeeded. If the set method returns false, and the assignment happened in strict-mode code, a TypeError will be thrown
            dep.notify();
        },
        apply(target, thisArg, argumentsList){
            // target 目标对象, thisArg函数作用域, argumentsList 参数列表
            // The apply method can return any value.
            
        },
    }
}

function Vego(config){
    const _VegoContext = {};
    Object.assign(_VegoContext, config.methods)


    return observe(_VegoContext);
}