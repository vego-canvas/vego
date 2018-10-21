<template>
	<circle :x="x" :y="y" :r="r" :color="color" :scaleY="scaleY">
	</circle>
</template>
<script>
import tweenMixin from '@/proto/tweenMixin.js';
// import Vue from 'vue';
export default {
	name: 'my-circle',
	mixins: [ tweenMixin ],
	props: ['x', 'y', 'r', 'color', 'scaleY'],
	dataKeysInDraw: ['x', 'y', 'r', 'color', 'scaleY'],
	draw(ctx, p){
		const {
			x, y, r, color, scaleY
		} = this;

		ctx.beginPath();
		ctx.save();
		ctx.fillStyle = color;
		ctx.scale(1, scaleY);
		ctx.arc(x, y, r, 0, 2 * Math.PI);
		ctx.fill();
		ctx.restore();		
	},
};
</script>