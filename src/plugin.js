import Vue from 'vue';
import Render from './core/render.js';

const VNODE = Symbol('_vCanvasNode');
const VCTX = Symbol('_vCanvasContext');
const VSTACK = Symbol('_vStack');
const cachedCanvas = null;
const noop = () => {};

// const PaintStack = new Stack();

function findCanvas(vm){
	let t = vm.$parent;
	while(t && t.$el.tagName !== "CANVAS"){
		t = t.$parent;
	}
	return t;
}

function findStack(vm){
	let t = vm.$parent;
	while(t && !t.stack){
		t = t.$parent;
	}
	return t;
}

const plugin = {
	install(Vue, options){
		Vue.mixin({
			mounted(){
				const vm = this;
				if(isCanvasVnode(vm)){
					this.$nextTick(() => {
						console.log(this);
						const parent = findCanvas(this); // TODO find parent util canvas
						const container = findStack(this);
						this[VCTX] = parent.$el.getContext('2d')
						this[VSTACK] = container.stack;
						_paint.call(this, this.$options.draw, this[VSTACK]);				
					})
				}

			},
			updated(){
				const vm = this;
				if(isCanvasVnode(vm)){
					_paint.call(vm, vm.$options.draw, this[VSTACK])
				}				
			},
			destroyed(){
				if(isCanvasVnode(this)){
					this[VCTX] = null;
					this[VNODE] = null;
					this[VSTACK].rm(this._uid);
				}
			}
		});

		const p = Vue.prototype._render;
		Vue.prototype._render = function(){
			const vm = this;
			if(isCanvasVnode(vm)){
				const vnode = this.$options.render.call(this._renderProxy, this.$createElement)
				vm[VNODE] = vnode;
				// if(vm._e){
				// 	return vm._e(); // createEmptyNode
				// }
				return vnode;
			}else{
				return p.call(vm);
			}
		}

	}
}



function _paint(render, stack){

	const vnode = this[VNODE];

	//if(el.getContext){
	const ctx = this[VCTX];
	// console.log(vnode)
	const props = vnode.data.attrs;
	const {
		width,
		height
	} = this.$props

	const bindedFUNC = render.bind(this, ctx);
	bindedFUNC.type = render.type;
	
	stack.set(this._uid, bindedFUNC)
	//}
}

function isFunction(t){
	return t && Object.prototype.toString.call(t) === '[object Function]';
}

function isCanvasVnode(vm){
	return vm.$options.draw && isFunction(vm.$options.draw)
}

export default plugin;