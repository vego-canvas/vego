<template>
	<div canvascontainer :x="x" :y="y" :regX="regX" :regY="regY">
		<slot></slot>
	</div>
</template>

<script>
import Stack from '../proto/stack';
import { findContainer } from '../util/common.js';
import Matrix2D from '../util/Matrix2D';
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
		regX: {
			type: Number,
			default: 0,
		},
		regY: {
			type: Number,
			default: 0,
		}
	},
	draw(ctx){
		const m = this.matrix;
		const pm = this.parentMatrix;
		this.stack.setPre(this._uid, () => {
			ctx.setTransform(m.a,m.b,m.c,m.d,m.tx,m.ty);
		});
		this.stack.setAfter(this._uid, () => {
			ctx.setTransform(pm.a,pm.b,pm.c,pm.d,pm.tx,pm.ty);
		});
		return this.stack;
	},
	updated(){
		const x = this.x - this.regX;
		const y = this.y - this.regY;
		this.matrix.copy(this.parentMatrix.clone().append(1,0,0,1,x,y));
	},
	created(){
		this.stack = new Stack();
		this.parentMatrix = findContainer(this).matrix;
		const x = this.x - this.regX;
		const y = this.y - this.regY;
		this.matrix = this.parentMatrix.clone().append(1,0,0,1,x,y);
		this.$options.draw.type = "container";
	},
}
</script>