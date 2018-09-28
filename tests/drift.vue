<template>
	<div>
		<my-canvas :width="canvasWidth" :height="canvasHeight">
			<container :x="panel.x" :y="panel.y" :regX="panel.regX" :regY="panel.regY">
				<controlRect :x="0" :y="0" :width="panel.width" :height="panel.height"/>
				<controlPoint :dx="panel.width - 25" :dy="panel.height - 25" :dwidth="50" :dheight="50" :src="panel.resizeIcon"/>
				<controlPoint :dx="panel.width - 25" :dy="-25" :dwidth="50" :dheight="50" :src="panel.closeIcon"/>
				<controlPoint :dx="-25" :dy="panel.height - 25" :dwidth="50" :dheight="50" :src="panel.rotateIcon"/>
				<controlPoint :dx="0" :dy="panel.height - 25" :dwidth="50" :dheight="50" :src="panel.rotateIcon"/>
			</container>
		</my-canvas>
	</div>
</template>
<script>
	import bitmap from '@/core/Rbitmap.vue';
	import rect from '@/core/Rectangle.vue';
	import container from '@/core/container.vue';
	const resizeIcon = require('./assets/resize.png');
	const closeIcon = require('./assets/close.png');
	const rotateIcon = require('./assets/rotate.png');
	export default {
		name: 'drift',
		components: {
			"controlPoint": bitmap,
			"controlRect": rect,
			container
		},
		data(){
			return {
				canvasWidth: 800,
				canvasHeight: 800,

				panel: {
					x: 800/2,
					y: 800/2,
					width: 200,
					height: 200,
					regX: 100,
					regY: 100,
					resizeIcon,
					closeIcon,
					rotateIcon
				}
			}
		},
		methods: {

		}
	}
</script>
<style type="text/css">
	
</style>