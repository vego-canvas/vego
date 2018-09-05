<template>
	<canvas :width="width | toPx" :height="height | toPx">
		<slot></slot>
	</canvas>
</template>

<script type="text/javascript">
	import Vue from 'vue';

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
			}
		},
		filters: {
			toPx(num){
				return `${num}px`
			}
		},
		mounted(){
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