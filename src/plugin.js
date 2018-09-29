import Vue from 'vue';
// import Vuex from 'vuex';
import {findCanvas, findContainer, isCanvasVnode} from './util/common.js';
import './canvas.vue';


const VNODE = Symbol('_vCanvasNode');
const VCTX = Symbol('_vCanvasContext');
const VSTACK = Symbol('_vStack');
const VCACHE = Symbol('_vCache');
const VCACHECTX = Symbol('_vCacheContext');
const noop = () => {};


const _cvs = document.createElement("canvas"); 
const _hitTestContext = _cvs.getContext('2d');
_cvs.width = _cvs.height = 400;
document.body.appendChild(_cvs)
_cvs.style.position = "absolute";
_cvs.style.right = "0";
_cvs.style.top = "0";
_cvs.style.border = "1px solid red";

// 非透明的元素
function _testHit(ctx){
	return ctx.getImageData(0, 0, 1, 1).data[3] > 1;
}

const plugin = {
	install(Vue, options){

		Vue.mixin({
			created(){
				if(this.$options.draw){
					this.parentMatrix = findContainer(this).matrix;
				}
			},
			mounted(){
				const vm = this;
				if(isCanvasVnode(vm)){
					this.$nextTick(() => {
						const parent = findCanvas(this); // TODO find parent util canvas
						const container = findContainer(this);
						this[VCTX] = parent.$el.getContext('2d')
						this[VSTACK] = container.stack;

						
						if(this.tween){
							console.log(this._renderCtx)
							_paintInTween.call(this, this._renderCtx, this.$options.draw, this[VSTACK]);
							//draw = this.$options.
						}else{
							_paint.call(this, this.$options.draw, this[VSTACK]);	
						}
						
									
						const canvas = this._hitTestCanvas = document.createElement("canvas"); 
						this._hitTestContext = canvas.getContext("2d");
						canvas.width = canvas.height = 1;

						// TODO cache stable drawing
						// this[VCACHE] = document.createElement("canvas"); 
						// this[VCACHECTX] = this[VCACHE].getContext('2d');
						// this[VCACHE].width = parent.width;
						// this[VCACHE].height = parent.height;
					})
				
				}

			},
			// updated(){
			// 	const vm = this;
			// 	if(isCanvasVnode(vm)){
			// 		_paint.call(vm, vm.$options.draw, this[VSTACK])
			// 	}				
			// },
			// updated(){
			// 	this[VCACHECTX]
			// },
			destroyed(){
				if(isCanvasVnode(this)){
					this[VCTX] = null;
					this[VNODE] = null;
					this[VSTACK].rm(this._uid);
				}
			},
			methods: {
				_hitTest(x, y){ 
					// can i just save some results until properties change ??? 
					const ctx = this._hitTestContext;
					const m = this.parentMatrix.clone().prependTransform(-x,-y,1,1);
					ctx.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
					//ctx.translate(-x, -y);
					this.$options.draw.call(this, ctx);
					
					const hit = _testHit(ctx);
					ctx.setTransform();
					ctx.clearRect(0, 0, 2, 2);

					_hitTestContext.clearRect(0, 0, 400, 400);
					//const m = mtx.clone().prepend(1,0,0,1,-x,-y);
					_hitTestContext.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
					//_hitTestContext.translate(-x, -y);
					this.$options.draw.call(this, _hitTestContext);
					_hitTestContext.setTransform();

					return hit;
				}
			}
		});

		const p = Vue.prototype._render;
		Vue.prototype._render = function(){
			const vm = this;
			if(isCanvasVnode(vm)){
				const vnode = this.$options.render.call(this._renderProxy, this.$createElement)
				vm[VNODE] = vnode;
				
				if(vm._e && !vnode.data.attrs.hasOwnProperty('canvascontainer')){
					return vm._e(); // createEmptyNode
				}
				return vnode;
			}else{
				return p.call(vm);
			}
		}

	}
}

// function _render(render, ctx){
// 	this.
// }
function _paintInTween(renderCtx, render, stack){
	const vnode = this[VNODE];
	const ctx = this[VCTX];
	const bindedFUNC = render.bind(renderCtx, ctx);
	bindedFUNC.type = render.type;
	stack.set(this._uid, bindedFUNC)
}

function _paint(render, stack){

	const vnode = this[VNODE];

	//if(el.getContext){
	const ctx = this[VCTX];
	// console.log(vnode)
	// const props = vnode.data.attrs;
	// const {
	// 	width,
	// 	height
	// } = this.$props

	const bindedFUNC = render.bind(this, ctx);
	bindedFUNC.type = render.type;
	
	stack.set(this._uid, bindedFUNC)
	//}
}




export default plugin;