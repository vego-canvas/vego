<template>
	<div>
		<h1>{{title}}</h1>
		<my-canvas>
			<my-circle :x="x" :y="y" :r="r" :color="color"/>
		</my-canvas>
	</div>
</template>

<script type="text/javascript">
	import circle from './src/core/circle.vue';
	export default {
		components:{"my-circle": circle},
		data(){
			return {
				title: 'MVVM Canvas',
				x: 30,
				y: 30,
				r: 20,
				color: 'red'
			}
		},
		mounted(){
			const r = 20;
			const v = Math.PI*2 / 1000;
			const x0 = 50;
			const y0 = 50;

			const nextFrame = (t) =>{
				const theta = v*t % (Math.PI*2);
				const deltaX = r*Math.sin(theta);
				const deltaY = r*Math.cos(theta);
				const newx = x0 + deltaX;
				const newy = y0 + deltaY;

				this.x = newx;
				this.y = newy;
				
				window.requestAnimationFrame(nextFrame)
			}
			window.requestAnimationFrame(nextFrame);
		}
	}
</script>