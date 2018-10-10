<template>
	<circle :x="x" :y="y" :r="r" :color="color">

	</circle>
</template>
<script>
// import Vue from 'vue';
export default {
	name: 'my-arc',
	props: ['x', 'y', 'r', 'color'],
	draw(ctx, p){
		const {
			x, y, r, color
		} = this;

		ctx.beginPath();
		ctx.save();
		ctx.strokeStyle = color;
		ctx.arc(x, y, r, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.restore();		
	},
};
</script>