<template>
	<circle :x="x" :y="y" :r="r" :color="color">
	</circle>
</template>
<script>

export default {
	name: 'my-circle',
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
};
</script>