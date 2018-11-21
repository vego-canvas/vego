export function observable(obj){
    return Array.isArray(obj) || (obj.constructor && obj.constructor === Object);
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