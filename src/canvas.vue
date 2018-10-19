<template>
	<canvas :width="width | toPx" :height="height | toPx" @click="onclick" @mousemove="onMouseMove" @mousedown="onMouseDown" @mouseup="onMouseUp">
		<slot></slot>
	</canvas>
</template>

<script type="text/javascript">
	import Vue from 'vue';
	import Stack from './proto/stack';
	import Ticker from './proto/ticker';
	import Matrix2D from './util/Matrix2D';
	// import mouseEventVM from './proto/mouseEvent';

	import EventDispatcher from './proto/event.js'; 
	// import EventStore from './proto/event.js';

	export default Vue.component('vego-canvas', {
		name: 'vego-canvas',
		props: {
			width: {
				type: Number,
	  			default: 400,
			}, 
			height: {
				type: Number,
	  			default: 400,
			},
			pause: {
				type: Boolean,
				default:false
			}
		},
		filters: {
			toPx(num){
				return `${num}px`
			}
		},
		watch: {
			pause(val){
				Ticker._pause = val;
			}
		},
		// created(){
		// 	this.stack = new Stack();
		// 	this.ticker = new Ticker();
		// },
		created(){
			const {width, height} = this;
			this.stack = new Stack();
			this.ratio = window.devicePixelRatio || 1;
			this.matrix = new Matrix2D();
			this.matrix.scale(this.ratio, this.ratio);
			this.eventDispacher = new EventDispatcher();
		},
		mounted(){
			const {width, height} = this;
			const ctx = this.$el.getContext('2d');
			const ratio = this.ratio;
			this.scaleCanvas(this.$el, width, height);

			const m = this.matrix;//.scale(ratio, ratio);
			this.stack.setPre(this._uid, () => {
				//ctx.scale(ratio, ratio);
				 ctx.setTransform(m.a,m.b,m.c,m.d,m.tx, m.ty);
			});
			this.stack.setAfter(this._uid, () => {
				 ctx.setTransform();
				//ctx.scale()
			});
			//const ctx = this.scaleCanvas(this.$el, width, height);
			const stack = this.stack;
			// setTimeout(() => {
			// 	ctx.clearRect(0, 0, width * ratio, height * ratio);
			// 	stack.iterator((render) => {
			// 		render();
			// 	})
			// }, 500)
			const width_actual = width * ratio;
			const height_actual = height * ratio;

			Ticker((t) => {
				
				ctx.clearRect(0, 0, width_actual, height_actual);

				this.$emit('tick', t);
				stack.iterator((render) => {
					render();
				})
			});
			//console.log(this.$children)
			// this.mvvmCanvas = {
			// 	target: this.$el,
			// 	ctx: this.$el.getContext('2d'),
			// 	width: this.width,
			// 	height: this.height,
			// }
		},
		methods:{
			wrapEvt(e){
				return {
					_sourceevt: e,
					_source: this,				
				} 
			},
			onclick(e){
				this.eventDispacher.dispatch('click', this.wrapEvt(e));
				this.$emit('click', e);
			},
			onMouseDown(e){
				this.eventDispacher.dispatch('mousedown', this.wrapEvt(e));				
			},
			onMouseMove(e){
				const { offsetX, offsetY } = e;
				const pos = {
					x: offsetX,
					y: offsetY
				}

				//console.log(e);
				// this.$store.commit('mousemove', pos)
				// mouseEventVM.mouse = pos;

				this.eventDispacher.dispatch('pressmove', this.wrapEvt(e));
				this.eventDispacher.dispatch('mouseenter', this.wrapEvt(e));
				this.eventDispacher.dispatch('mouseleave', this.wrapEvt(e));
				this.eventDispacher.dispatch('mousemove', this.wrapEvt(e));
				
				this.$emit('mousemove', pos)
				// const { clientX, clientY } = e;
				// console.log(clientX, clientY);
				// this.$broadcast('canvasmousemove', e); 
			},
			onMouseUp(e){
				this.eventDispacher.dispatch('mouseup', this.wrapEvt(e));	
			},
			scaleCanvas(canvas, width, height) {
			  // assume the device pixel ratio is 1 if the browser doesn't specify it
			  // const devicePixelRatio = window.devicePixelRatio || 1;
			  const context = canvas.getContext('2d');

			  // determine the 'backing store ratio' of the canvas context
			  // const backingStoreRatio = (
			  //   context.webkitBackingStorePixelRatio ||
			  //   context.mozBackingStorePixelRatio ||
			  //   context.msBackingStorePixelRatio ||
			  //   context.oBackingStorePixelRatio ||
			  //   context.backingStorePixelRatio || 1
			  // );

			  // determine the actual ratio we want to draw at
			  const ratio = this.ratio;

			  if (devicePixelRatio !== 1) {
			    // set the 'real' canvas size to the higher width/height
			    canvas.width = width * ratio;
			    canvas.height = height * ratio;

			    // ...then scale it back down with CSS
			    canvas.style.width = width + 'px';
			    canvas.style.height = height + 'px';
			  }
			  else {
			    // this is a normal 1:1 device; just scale it simply
			    canvas.width = width;
			    canvas.height = height;
			    canvas.style.width = '';
			    canvas.style.height = '';
			  }

			  // scale the drawing context so everything will work at the higher ratio

			  // context.scale(ratio, ratio);
			  return ratio;
			}
		}
	});
</script>
<style type="text/css">
	.canvas{
		
	}
</style>