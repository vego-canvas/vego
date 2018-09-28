<template>
	<div 
		:x="x" :y="y" :dw="width" :dh='height' >
	</div>
</template>
<script type="text/javascript">
	export default {
		name: 'rectangle',
		props: ['x', 'y', 'width', 'height'],
		draw(ctx){
			const {
				x, y, width, height
			} = this;


			ctx.beginPath();
			ctx.save();
			ctx.setLineDash([15, 5]);
			ctx.strokeStyle = "yellow";
			ctx.lineWidth = 3;
			ctx.strokeRect(x, y, width, height);
			ctx.restore();		
		}
	}
</script>
<style>

</style>