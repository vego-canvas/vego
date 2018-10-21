import Vue from 'vue';
import {findCanvas, findContainer, isCanvasVnode, isCanvasComponentGen} from './util/common.js';
import './canvas.vue';
import './core/container.vue';
import EventDispatcher from './proto/eventDispatcher.js'; 
import DrawStack from './proto/drawStack.js';

const VNODE = Symbol('_vCanvasNode');
const VCTX = Symbol('_vCanvasContext');
const VSTACK = Symbol('_vStack');
const VCACHE = Symbol('_vCache');
const VCACHECTX = Symbol('_vCacheContext');
const VCRASH = Symbol('_vcrash')
const noop = () => {};

// 非透明的元素
function _testHit(ctx){
	return ctx.getImageData(0, 0, 1, 1).data[3] > 1;
}

const plugin = {
	install(Vue, options){

		Vue.mixin({
			mixins: [EventDispatcher, DrawStack],
			created(){
				this.isCanvasComponent = isCanvasComponentGen();
			},
			mounted(){
				console.log(this.isCanvasComponent(this))
				if(this.isCanvasComponent(this)){
					const canvas = this._hitTestCanvas = document.createElement("canvas"); 
					this._hitTestContext = canvas.getContext("2d");
					canvas.width = canvas.height = 1;
				}

			},
			destroyed(){
				if(this.isCanvasComponent(this)){
					this._hitTestCanvas = null;
					this._hitTestContext = null;
				}
			},
			methods: {

				_hitTest(x, y){ 
					const ratio = window.devicePixelRatio || 1;

					const ctx = this._hitTestContext;
					let m = this.$parent.matrix.clone().prepend(1,0,0,1,-x * ratio,-y * ratio);
					ctx.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
					this.$options.draw.call(this, ctx);
					
					const hit = _testHit(ctx);
					ctx.setTransform();
					ctx.clearRect(0, 0, 2, 2);

					return hit;
				}
			}
		});

		const p = Vue.prototype._render;
		Vue.prototype._render = function(){
			const vm = this;
			if(this.isCanvasComponent(vm)){
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
	const ctx = this[VCTX];

	const bindedFUNC = render.bind(this, ctx);
	bindedFUNC.type = render.type;
	
	stack.set(this._uid, bindedFUNC)
}




export default plugin;