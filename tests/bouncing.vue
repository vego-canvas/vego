<template>
	<div>
		<my-canvas @tick="tick" :width="canvasWidth" :height="canvasHeight">
			<container :key="ball.key" v-for="ball in balls" :x="ball.x" :y="ball.y" >
				<ball :x="0" :y="0" :r="ball.radius" :color="ball.color"/>
			</container>
		</my-canvas>
	</div>
</template>
<script>
	import ball from './ball.vue';
	import container from '@/core/container.vue';

	function randomNum(m, n) {
      	return Math.floor(Math.random() * (n - m + 1) + m);
    }
    function randomColor() {
		var r = randomNum(0, 255);
		var g = randomNum(0, 255);
		var b = randomNum(0, 255);
		return "rgb(" + r + "," + g + "," + b + ")";
    }
	export default {
		name: "bouncingbox",
		components: {
			ball: ball,
			container: container
		},
		data(){
			return {
				canvasWidth: 800,
				canvasHeight: 800,

				balls: [],

				lastT: 0,
			}
		},
		mounted(){
			for (var i = 0; i < 20; i++) {
				this.createBall(i)
			}
		},
		methods:{
			tick(t){
				
				const gravity = .3;
				const elasticity = .6;
				const elasticitx = .5;
				const friction = .008;
				const bottom = this.canvasHeight;
				const right = this.canvasWidth;

				var angle = 285;
				this.balls.forEach(ball => {
					ball.vx = ball.vx - ( ball.vx*friction);
					ball.vy += gravity;
					if ((ball.y + ball.radius) > bottom) {
					   ball.vy = -(ball.vy)*elasticity;
					   ball.y = bottom - ball.radius;
					}
					if((ball.x - ball.radius) < 0){
						ball.vx = -(ball.vx) * elasticitx;
						ball.x = ball.radius;
					}
					if((ball.x + ball.radius) > right){ 
						ball.vx = -(ball.vx) * elasticitx;
						ball.x = right - ball.radius;
					}
					if(Math.abs(ball.vy) < 0.5 && ball.y > bottom - ball.radius - 1){
						ball.vy = 0;
					}

					ball.x += ball.vx;
					ball.y += ball.vy;
					// const right = this.canvasWidth;
					// const left = 0;
					// const bottom = this.canvasHeight;
					// const top = 0;
					// const gravity = 0.2;
					// const damping = 0.9;
					// const traction = 0.8;
					// const bounce = -0.8;
					// const {
					// 	angle
					// } = ball;



			  //       if (ball.x + ball.radius > right) {
			  //         const dx = ball.x - (right - ball.radius);
			  //         const dy = Math.tan(angle) * dx;
			  //         ball.x = right - ball.radius;
			  //         ball.y += dy;
			  //         ball.vx *= bounce;
			  //       } else if (ball.x - ball.radius < left) {
			  //         const dx = ball.x - (left + ball.radius);
			  //         const dy = Math.tan(angle) * dx;
			  //         ball.x = left + ball.radius;
			  //         ball.y += dy;
			  //         ball.vx *= bounce;
			  //       }
			  //       if (ball.y + ball.radius > bottom) {
			  //         const dy = ball.y - (bottom - ball.radius);
			  //         const dx = dy / Math.tan(angle);
			  //         ball.y = bottom - ball.radius;
			  //         ball.x += dx;
			  //         ball.vy *= bounce;
			  //       } else if (ball.y - ball.radius < top) {
			  //         const dy = ball.y - (top + ball.radius);
			  //         const dx = dy / Math.tan(angle);
			  //         ball.y = top + ball.radius;
			  //         ball.x += dx;
			  //         ball.vy *= bounce;
			  //       }

					// ball.vy += gravity	

					// ball.x += ball.vx;
					// ball.y += ball.vy;					
				});
			},
			createBall(k){
				const speed = 12;
				const angle = randomNum(180, 360);
				const radians = angle * Math.PI/ 180;
				const x = this.canvasWidth / 2;
				const y = 200;
				const vx = Math.cos(radians) * speed;
				const vy = Math.sin(radians) * speed;
				this.balls.push({
					key: k,
					x, y,
					radius: 50,
					color: randomColor(),
					vx,
					vy,
				})
			},
		}
	}
</script>
<style>

</style>