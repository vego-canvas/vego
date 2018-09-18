<template>
	<div :start="start" :stops="stops" :color="color">
	</div>
</template>
<script>

export default {
	name: 'my-bezier',
	props: ['start', 'stops', 'color'],
	draw(ctx, p){
		const {
			start, stops, color
		} = this;
		ctx.beginPath();
		ctx.save();
		ctx.strokeStyle = color;
		ctx.lineWidth = 2;
		ctx.lineJoin = "round"
		ctx.moveTo(start.x, start.y);

		stops.forEach(({cp1, cp2, end}) => {
			ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
		})
		ctx.stroke();
		ctx.restore();		
	},
};
</script>