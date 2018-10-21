<template>
	<div :stops="stops" :color="color">
	</div>
</template>
<script>
import tweenMixin from '../proto/tweenMixin.js';
export default {
	name: 'my-bezier',
	mixins:[tweenMixin],
	props: ['stops', 'color', 'tween'],
	dataKeysInDraw: [ 'stops', 'color'],
	draw(ctx){
		const {
			 stops, color
		} = this;
		ctx.beginPath();
		ctx.save();
		ctx.strokeStyle = color;
		ctx.lineWidth = 2;
		ctx.lineJoin = "round"
		

		stops.forEach(({cp1, cp2, end}, i) => {
			if(i === 0) 
				ctx.moveTo(stops[0].x, stops[0].y);
			else
				ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
		})
		ctx.stroke();
		ctx.restore();		
	},

};
</script>