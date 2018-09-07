<template>
	<canvas :width="width | toPx" :height="height | toPx">
		<slot></slot>
	</canvas>
</template>

<script type="text/javascript">
	import Vue from 'vue';
	import Stack from './proto/stack';
	import Ticker from './proto/ticker';

	export default Vue.component('my-canvas', {
		name: 'my-canvas',
		props: {
			width: {
				type: Number,
	  			default: 400,
			}, 
			height: {
				type: Number,
	  			default: 400,
			},
		},
		filters: {
			toPx(num){
				return `${num}px`
			}
		},
		// created(){
		// 	this.stack = new Stack();
		// 	this.ticker = new Ticker();
		// },
		mounted(){
			const {width, height} = this;
			const ctx = this.$el.getContext('2d');
			const stack = this.stack = new Stack();
			Ticker((t) => {
				ctx.clearRect(0, 0, width, height);
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
		}
	});
</script>
<style type="text/css">
	.canvas{
		background:red;
	}
</style>