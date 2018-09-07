<template>
	<div :x="x" :y="y">
		<slot></slot>
	</div>
</template>

<script>
import Stack from '../proto/stack';

export default {
	name: 'my-container',
	props:{
		x: {
			type: Number,
			default: 0,
		}, 
		y: {
			type: Number,
			default: 0,
		},
	},
	
	draw(ctx){
		this.stack.setPre(this._uid, () => {
			ctx.setTransform(1,0,0,1,this.x, this.y);
		});
		this.stack.setAfter(this._uid, () => {
			ctx.setTransform();
		});
		return this.stack;
	},
	mounted(){
		console.log(this.$slots)
		const stack = this.stack = new Stack();
		this.$options.draw.type = "container";
	},
}
</script>