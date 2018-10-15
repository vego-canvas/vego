<template>
	<div canvascontainer :x="x" :y="y" :regX="regX" :regY="regY">
		<slot></slot>
	</div>
</template>

<script>
import Stack from '../proto/stack';
import eventMixin from '../proto/eventMixin'
import { findContainer } from '../util/common.js';
import Matrix2D from '../util/Matrix2D';

const VCACHE = Symbol('_vCache');
const VCACHECTX = Symbol('_vCacheContext');

export default {
	mixins: [eventMixin],
	data(){
		return {
			hit: false,
			hasUpdated: false,
		}
	},
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
		},
		rotation: {
			type: Number,
			default: 0
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

		this.matrix.copy(this.parentMatrix.clone().appendTransform(this.x, this.y, 1, 1, this.rotation, 0, 0, this.regX, this.regY) );
	},
	created(){
		this.stack = new Stack();
		this.parentMatrix = findContainer(this).matrix;

		console.log(this.x, this.y, this.rotation)
		this.matrix = this.parentMatrix.clone().appendTransform(this.x, this.y, 1, 1, this.rotation, 0, 0, this.regX, this.regY) 

		this.$options.draw.type = "container";
	},
	// watch:{
	// 	hit(val, oldVal){
	// 		if(val){
	// 			this.$emit('mouseenter', val);
	// 		}else{	
	// 			this.$emit('mouseleave', oldVal);
	// 		}
	// 	}
	// },
	mounted(){
		// cache components
		// const canvas = this[VCACHE] = document.createElement("canvas"); 
		// this[VCACHECTX] = canvas.getContext("2d");
		// canvas.width = 


		// console.log(this._events);
		// this.regist('mouseenter');
		// this.regist('mouseleave');

		// this.$on('mouseinboundcheck', e => {
			
		// })
	}
}
</script>