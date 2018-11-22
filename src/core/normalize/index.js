import cloneDeep from 'lodash.clonedeep';
import { noop, isFunction } from  '../../utils'
import Vego from '../../../index';
function normalize(vm, config){

    // methods!
    const methods = config.methods || {};
    const options = {};
    Object.keys(methods).forEach(f => {
        vm[f] = methods[f].bind(vm);
    });

    // prop 校验
    options.props = config.props || {};
    // data
    // cloneDeep,
    // 避免重复引用一个组件设置时对应的是同一份data，是否可以拿来作为隐藏功能？
    options.data = cloneDeep(config.data) || {};
    // event handlers
    options.handlers = config.handlers || {};

    // children
    const children = config.children || [];
    if(isFunction(children)){
        options.children = children.bind(vm);
    }
    if(Array.isArray(children)){
        options.children = children.filter(child => child.comp && child.comp instanceof Vego)
    }


    // lifeCycle
    options.createdhook = config.created || noop;
    options.mountedhook = config.mounted || noop;

    // watch
    options.watch = config.watch || {};

    vm.$options = options;
    vm.$render = config.render;
    vm.name = config.name;

}
export default normalize;