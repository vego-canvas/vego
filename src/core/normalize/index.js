import cloneDeep from 'lodash.clonedeep';
import { noop, isFunction } from  '../../utils'
import Vego from '../../../index';
function normalize(vm, config){

    // methods!
    const methods = config.methods || {};
    const options = {};

    // 一开始不绑定作用作用域好了
    // Object.keys(methods).forEach(f => {
    //     vm[f] = methods[f].bind(vm);
    // });
    options.methods = methods;

    // prop 校验 TODO
    // array? object?
    options.props = config.props || {};

    // data
    // cloneDeep,
    // 避免重复引用一个组件设置时对应的是同一份data，是否可以拿来作为隐藏功能？
    if(isFunction(config.data)){
        options.data = config.data;
    }else{
        const data = cloneDeep(config.data);
        options.data = function() {
            return data;
        }
    }

    // event handlers
    options.handlers = config.handlers || {};

    // children
    const children = config.children || function(){return []}
    if(isFunction(children)){
        //暂时不绑定
        //options.children = children.bind(vm);
        options.children = children;
    }else{
        throw 'children is a function return an Array!';
    }
    // if(Array.isArray(children)){
    //     options.children = children.filter(child => child.comp && child.comp instanceof Vego)
    // }


    // lifeCycle
    options.createdhook = config.created || noop;
    options.mountedhook = config.mounted || noop;

    // watch
    options.watch = config.watch || {};

    // render
    if(!config.render){
        throw 'render function is needed!';
    }
    options.render = config.render;
    options.name = config.name;
    return options;
    // vm.$options = options;
    // vm.$render = config.render;
    // vm.name = config.name;

}
export default normalize;