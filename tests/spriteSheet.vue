<template>
	<div>
		<my-canvas :width="canvasWidth" :height="canvasHeight">
			<spiriteSheet :configs="conf" />
		</my-canvas>
	</div>
</template>
<script>
	export default{
		name: 'tweenlite',
		data(){
			return {
				canvasWidth: 800,
				canvasHeight: 800,

				conf: {
					framerate: 30,
					"images": [loader.getResult("grant")],
					"frames": {
						"regX": 82, "height": 292, "count": 64, "regY": 0, "width": 165},
					// define two animations, run (loops, 1.5x speed) and jump (returns to run):
					"animations": {
						"run": [0, 25, "run", 1.5],
						"jump": [26, 63, "run"]
					}
				}

			}
		}
	}
</script>
<style>

</style>