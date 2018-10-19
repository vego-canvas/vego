<template>
	<div>
		<vego-canvas @click="jump" @tick="tick" :width="canvasWidth" :height="canvasHeight">
			<container :x="x" :y="y">
				<spriteSheet :configs="conf" :pattern.sync="pattern" />
			</container>
			
		</vego-canvas>
	</div>
</template>
<script>
	import container from '@/core/container.vue';
	import spriteSheet from '@/core/spriteSheet.vue';
	const sheet = require('./assets/spritesheet_grant.png');

	export default{
		components: {
			spriteSheet,
			container,
			
		},
		data(){
			return {
				canvasWidth: 800,
				canvasHeight: 800,

				conf: {
					framerate: 30,
					image: sheet,
					frames: {
						width: 165,
						height: 292,
						count: 64,

					},
						// "regX": 82, "height": 292, "count": 64, "regY": 0, "width": 165},
					// define two animations, run (loops, 1.5x speed) and jump (returns to run):
					patterns: {
						run: {
							frame: [0, 25],
							next: 'run'
						},
						jump: {
							frame: [26, 63],
							next: 'run'
						}
					}
				},
				pattern:'run',

				velocity: 150,
				x: 0,
				y: 100,
			}
		},
		methods:{
			jump(){
				console.log('jump')
				this.pattern = 'jump'
			},
			tick(due){
				this.x = (this.velocity/1000 * due) % (this.canvasWidth + 165) - 165;
			}		
		}

	}
</script>
<style>

</style>