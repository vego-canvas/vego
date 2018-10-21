<template>
	<circle :x="x" :y="y" :r="r" :color="color">
	</circle>
</template>
<script>
import tweenMixin from '../proto/tweenMixin.js';
// import Vue from 'vue';
export default {
	name: 'my-circle',
	mixins: [ tweenMixin ],
	props: ['x', 'y', 'r', 'color'],
	dataKeysInDraw: ['x', 'y', 'r', 'color'],
	draw(ctx){
		const {
			x, y, r, color
		} = this;

		ctx.beginPath();
		ctx.save();
		ctx.fillStyle = color;
		ctx.arc(x, y, r, 0, 2 * Math.PI);
		ctx.fill();
		ctx.restore();		
	},
};
</script>