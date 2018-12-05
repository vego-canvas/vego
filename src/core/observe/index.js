

const handler = {
    get(target, property, receiver){
        // The handler.get method is a trap for getting a property value.
        // target 目标对象, property 对象属性名或Symbol, receiver
        
    },
    set(target, property, value, receiver){
        // The handler.set method is a trap for setting property value.
        // target 目标对象, property 对象属性名或Symbol, receiver 通常是proxy自己，但是set可以原型链被间接调用
        // The set method should return a boolean value. Return true to indicate that assignment succeeded. If the set method returns false, and the assignment happened in strict-mode code, a TypeError will be thrown

    },
    apply(target, thisArg, argumentsList){
        // target 目标对象, thisArg函数作用域, argumentsList 参数列表
        // The apply method can return any value.
        
    },
}

function observeObject(target){

    return new Proxy(target, handler);
}