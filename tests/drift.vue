<template>
	<div>
		<my-canvas :width="canvasWidth" :height="canvasHeight">
			<container :x="panel.x" :y="panel.y" :regX="panel.regX" :regY="panel.regY" :rotation="panel.rotation">
				<controlRect :x="0" :y="0" :width="panel.width" :height="panel.height"/>
				<controlPoint :dx="panel.width - 25" :dy="panel.height - 25" :dwidth="50" :dheight="50" :src="resizeIcon" @pressmove="resize" @mousedown="prepare"/>
<!-- 				<controlPoint :dx="panel.width - 25" :dy="-25" :dwidth="50" :dheight="50" :src="panel.closeIcon"/> -->
				<controlPoint :dx="-25" :dy="panel.height - 25" :dwidth="50" :dheight="50" :src="rotateIcon" @pressmove="rotate" @mousedown="prepare"/>
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
				canvasWidth: 400,
				canvasHeight: 400,

				panel: {
					x: 400/2,
					y: 400/2,
					width: 200,
					height: 200,
					regX: 100,
					regY: 100,
					rotation: 30,
				},
				resizeIcon,
				closeIcon,
				rotateIcon
			}
		},
		methods: {
			prepare(e){
				this.preparePanle = {
					...this.panel
				}
			},
			resize(e){
				const {
					anchorX, anchorY,
					x, y
				} = e;
				const vecx = x - anchorX;
				const vecy = y - anchorY;
				
				this.panel.width = this.preparePanle.width + vecx * 2 ;
				this.panel.height = this.preparePanle.height + vecy * 2;
				this.panel.regX = this.panel.width / 2;
				this.panel.regY = this.panel.height / 2;
			},
			rotate(e){
				const {
					anchorX, anchorY,
					x, y
				} = e;

				const dx = x - this.preparePanle.x;
				const dy = y - this.preparePanle.y;

				const theta = -180*Math.atan2(dy, dx)/Math.PI;

				this.panel.rotation = theta;

			}
		}
	}
</script>
<style type="text/css">
	
</style>