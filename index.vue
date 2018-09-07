<template>
	<div>
		<h1>{{title}}</h1>
		<my-canvas @tick="tick">
			<my-container :x="px" :y="py">
				<my-circle :x="x2" :y="y2" :r="r" :color="color2"/>
				<my-circle :x="x" :y="y" :r="r" :color="color"/>

			</my-container>
			
			
		</my-canvas>
	</div>
</template>

<script type="text/javascript">
	import circle from './src/core/circle.vue';
	import container from './src/core/container.vue';
	export default {
		components:{
			"my-circle": circle, 
			"my-container": container,
		},
		data(){
			return {
				title: 'MVVM Canvas',
				x: 30,
				y: 30,
				r: 20,
				x2: 50,
				y2: 30,
				color: 'red',
				color2: 'green',
				px: 0,
				py: 0
			}
		},
		methods:{
			tick(t){
				const r = 20;
				const v = Math.PI*2 / 1000;
				const x0 = 50;
				const y0 = 50;
				const theta = v*t % (Math.PI*2);
				const deltaX = r*Math.sin(theta);
				const deltaY = r*Math.cos(theta);
				const newx = x0 + deltaX;
				const newy = y0 + deltaY;

				const x2 = 100;
				const y2 = 100;
				const r2 = 50;
				const v2 = Math.PI*2 / 5000;
				const theta2 = v2*t % (Math.PI*2);
				const deltaX2 = r2*Math.sin(theta2);
				const deltaY2 = r2*Math.cos(theta2);
				const newxp = x2 + deltaX2;
				const newyp = y2 + deltaY2;

				this.x = newx;
				this.y = newy;
				this.px = newxp;
				this.py = newyp;
			}
		},
		mounted(){

		}
	}
</script>