// export function observable(obj){
//     return Array.isArray(obj) || (obj.constructor && obj.constructor === Object);
// }
export function observable(obj){
    return obj.__isProxy__;
}
export function addProxyTag(obj){
    Object.defineProperty(obj, '__isProxy__', {
        value: true,
        configurable: false,
        enumerable: false,
    })
}
export function reservedAttrs(key){
    return [
        '$parent',
        '$graphic',
        '$matrix',
        '$render',
        'created',
        'mounted',
        '_listeners',
        '_mainWatcher',
        '_uid',
        '_watchers',
        '__isProxy__',
        '_getProps',
    ].indexOf(key) !== -1;
}
export function shallowAttrs(key){
    return ['$children'].indexOf(key) !== -1;
}
export function noop(){}

// export function compN(funcs) {
//     return funcs.reduce(function(g, f) {
//         return function(x) {
//             return g(f(x));
//         };
//     }, id);
// }

export function getNewCanvas(){
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    return {
        canvas,
        ctx
    };
}
export function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}
export function isPureObject(obj){
    return (obj.constructor && obj.constructor === Object);
}