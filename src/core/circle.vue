<template>
	<circle :x="x" :y="y" :r="r" :color="color">
	</circle>
</template>
<script>

import eventMixin from '../proto/eventMixin'
// import Vue from 'vue';
export default {
	name: 'my-circle',
	mixins: [ eventMixin ],
	props: ['x', 'y', 'r', 'color'],
	draw(ctx, p){
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
	mounted(){
		this.regist('mouseenter');
		this.regist('mouseleave');
	}
};
</script>