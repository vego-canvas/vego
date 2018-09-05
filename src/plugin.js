import Vue from 'vue';
// import { createEmptyVNode } from 'vue/src/core/vdom/vnode';
import Render from './core/render.js';

const VNODE = Symbol('_vCanvasNode');
const cachedCanvas = null;
const noop = () => {};
const plugin = {
	install(Vue, options){
		Vue.mixin({
			mounted(){
				const vm = this;
				if(isCanvasVnode(vm)){
					_paint.call(vm, vm.$options.draw)
				}
			},
			updated(){
				const vm = this;
				if(isCanvasVnode(vm)){
					_paint.call(vm, vm.$options.draw)
				}				
			},
			destroyed(){
				if(isCanvasVnode(this)){
					this[VNODE] = null;
				}
			}
		})
	}
}

function _paint(render){
	const vm = this.$parent;
	const vnode = this[VNODE];
	const el = vm.$el;

	if(el.getContext){
		const ctx = el.getContext('2d');
		// console.log(vnode)
		const props = vnode.data.attrs;
		const {
			width,
			height
		} = vm.$props

		ctx.clearRect(0, 0, width, height);
		
		render.call(this, ctx);
	}
}

function isFunction(t){
	return t && Object.prototype.toString.call(t) === '[object Function]';
}

function isCanvasVnode(vm){
	return vm.$options.draw && isFunction(vm.$options.draw)
}

const p = Vue.prototype._render;
Vue.prototype._render = function(){
	const vm = this;
	if(isCanvasVnode(vm)){
		const vnode = this.$options.render.call(this._renderProxy, this.$createElement)
		vm[VNODE] = vnode;
		if(vm._e){
			return vm._e();
		}
		return vnode;
	}else{
		return p.call(vm);
	}
}

export default plugin;