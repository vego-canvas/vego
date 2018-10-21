<template>
	<div class="rootchart">
		<div class="container">	
			
			<div class="canvas">
				<h1 style="font-size: 18px">{{title}}</h1>
				<vego-canvas :width="canvasWidth" :height="canvasHeight" @dommousemove="onmousemove"  @tick="tick">
					<container v-for="(ax, i) in yaxis" :key="ax" :x="xstart" :y="ystart + i*ystep">
						<charttext :x="fontStartX" :y="5" :text="ax" fill="black" font="18px serif"/>
						<chartline :x="lineStartX" :y="0" :tx="lineEndX" :ty="0" color="#eee"/>
					</container>
					
					<charttext v-for="(dt, i) in data" :key="dt.week"
						:x="lineStartX + xstart + xstep*i - 20" 
						:y="ystart + yaxis.length * ystep" 
						:text="dt.week" fill="black" font="18px serif"/>
					<chartData v-for="(bz, i) in beziers" :key="bz.key" :stops="bz.bz" :color="color[i]" :tween="tween"/>
					
					<chartlineindicate v-if="mouseX>0" :x="mouseX" :y="ystart" :tx="mouseX" :ty="yend" :tween="tweenline"/>
					<container v-if="dataY" :x="mouseX" :y="yend - dataY.a * ydata2coord">
						<chartPoint :x="0" :y="0" :r="5" color="orange"/>
						<charttext :x="0" :y="-25" :text="`${dataY.week}  ${dataY.a}`" fill="black" font="18px serif"/>
					</container>

					<container v-if="dataY" :x="mouseX" :y="yend - dataY.b * ydata2coord">
						<chartPoint :x="0" :y="0" :r="5" color="blue"/>
						<charttext :x="0" :y="-25" :text="`${dataY.week}  ${dataY.b}`" fill="black" font="18px serif"/>
					</container>
				</vego-canvas>
			</div>

		</div>
	</div>
</template>
<script>
	import container from '@/core/container.vue';
	import line from '@/components/line.vue';
	import tweenline from '@/components/tweenline.vue';
	import text from '@/components/text.vue';
	import bezier from '@/components/bezier.vue';
	import circle from '@/components/circle.vue';

	export default {
		components:{ 
			'container': container,
			'chartline': line,
			'charttext': text,
			'chartData': bezier,
			'chartPoint': circle,
			'chartlineindicate': tweenline,
		},
		data() {
			return {
				title: '每星期访问量',
				series: ['a', 'b'],
				// data: [
				// 	{ week: '星期一', a: 150, b: 1200 },
				// 	{ week: '星期二', a: 300, b: 1200 },
				// 	{ week: '星期三', a: 28,  b: 1000 },
				// 	{ week: '星期四', a: 200, b: 2000 },
				// 	{ week: '星期五', a: 74,  b: 740 },
				// 	{ week: '星期六', a: 532, b:2000 },
				// 	{ week: '星期日', a: 420 ,b: 5000},
				// ],
				data: [
					{ week: '星期一', a: 0, b: 0},
					{ week: '星期二', a: 0, b: 0},
					{ week: '星期三', a: 0, b: 0},
					{ week: '星期四', a: 0, b: 0},
					{ week: '星期五', a: 0, b: 0},
					{ week: '星期六', a: 0, b: 0},
					{ week: '星期日', a: 0, b: 0},
				],
				color: ['orange','blue'],
				smooth: true,
				ylevel: 8,
				//yaxis:[],
				figures: [],
				//beziers: [],
				ydata2coord: 1,

				canvasWidth: 800,
				canvasHeight: 800,
				ystep: 50,
				ystart: 50,
				yend: 100,
				xstart: 50,
				fontStartX: 0,
				lineStartX: 50,
				lineEndX: 700,
				mouseX: 0,
				mouseY: 0,

				dataY: undefined,
				tween: {
					duration: 1000,
					easing: 'easeOutBounce',
					observe: ['start','stops'],
				},
				tweenline: {
					duration: 200,
					easing: 'linear',
					observe: ['x','tx'],
				},
				// tweenindicator: {
				// 	duration: 200,
				// 	observe: [
				// 		{
				// 			key: 'x',
				// 			easing: 'linear'
				// 		},
				// 		{
				// 			key: 'y',
				// 			easing: 
				// 		}
				// 	]
				// }
			}
		},
		computed:{
			xstep() {
				return (this.lineEndX - this.lineStartX)/ (this.data.length-1);
			},
			yaxis(){
				// console.log('yaxis');
				return this.calcyaxis();
			},
			beziers(){
				console.log('getbeziers')
				return this.calcbeziers();
			}
		},
		created(){
			this.$watch('beziers.0', (val, oldv)=>{
				console.log(val, oldv)
			})
		},
		mounted(){
			// this.yaxis = this.calcyaxis();
			// console.log(this.yaxis)

			// this.beziers = this.calcbeziers();
			this.$nextTick(() => {
				this.data = [
					{ week: '星期一', a: 150, b: 1200 },
					{ week: '星期二', a: 300, b: 1200 },
					{ week: '星期三', a: 28,  b: 1000 },
					{ week: '星期四', a: 200, b: 2000 },
					{ week: '星期五', a: 74,  b: 740 },
					{ week: '星期六', a: 532, b:2000 },
					{ week: '星期日', a: 420 ,b: 5000},
				]			
			})

			
		},	
		methods:{
			tick(){

			},
			calcyaxis(){
				const d = this.data;
				const s = this.series;

				const all = d.map(dt => s.map(k => dt[k])).reduce((accu, n) => accu.concat(n), []);

				all.sort((a,b)=> b - a);
				const top = Math.max(Math.ceil(all[0]/10)*10, 100);
				const bottom = 0;
				const step = Math.ceil((top - bottom) / this.ylevel);
				let p = top;
				this.ydata2coord = this.ystep / step; 
				this.yend = this.ystart + this.ystep * this.ylevel;

				return Array(this.ylevel).fill(0).map((x, i) => p - step*i).concat([0]);
			},
			calcbeziers(){
				const xstart = this.lineStartX + this.xstart;
				const yend = this.yend;
				const xstep = this.xstep;
				return this.series.map((s) => {
					const pts = this.data.map((l, i )=> {
						const dt = l[s];
						return {
							x: xstart + xstep * i,
							y: yend - this.ydata2coord * dt,
						}
					});
					return this.bzCurve(s, pts);
				})
			},
			gradient(a, b) {
	            return (b.y-a.y)/(b.x-a.x);
	        },
			bzCurve(key, points, f, t){
				if (typeof(f) == 'undefined') f = 0.3;
            	if (typeof(t) == 'undefined') t = 0.6;
            	var m = 0;
	            var dx1 = 0;
	            var dy1 = 0;
	            var preP = points[0];
	            var dx2, dy2;
	            var beziers = [];
	            beziers.push(preP);
	            for (var i = 1; i < points.length; i++) {
	                var curP = points[i];
	                var nexP = points[i + 1];
	                if (nexP) {
	                    m = this.gradient(preP, nexP);
	                    dx2 = (nexP.x - curP.x) * -f;
	                    dy2 = dx2 * m * t;
	                } else {
	                    dx2 = 0;
	                    dy2 = 0;
	                }
	                beziers.push({
	                	cp1: {
	                		x: preP.x - dx1,
	                		y: preP.y - dy1
	                	},
	                	cp2:{
	                		x: curP.x + dx2,
	                		y: curP.y + dy2,
	                	},
	                	end: {
	                		x: curP.x,
	                		y: curP.y
	                	}
	                });
	                dx1 = dx2;
	                dy1 = dy2;
	                preP = curP;
	            }
	            return {
	            	key,
	            	bz: beziers,
	            }
			},
			onmousemove(e){
				const {
					x, y
				} = e;
				if(x > this.lineEndX + this.xstart || x < this.xstart + this.lineStartX){
					this.mouseX = -1;
					this.dataY = undefined;
				}else{

					const step = this.xstep;
					const which = Math.ceil((x - step/2)/step);
					this.dataY = this.data[which - 1];
					this.mouseX = which * step - 10;
				}
			}
		}

	}
</script>
<style>
	.rootchart{
		background-color: white;
		color: black;
	}
	.container{
		display: flex;
	}
	.canvas{
		width: 800px;
	}
	.flex{
		flex: 1;
	}
	.img{
		width: 100%;
		height: auto;
	}
	.img > img{
		width: 100%;
	}
	p {
	  font-size: 1.25em;
	  margin: 0 auto;
	}

	p::first-letter {
	  color: #c69c6d;
	  float: left;
	  font-size: 5em;
	  margin: 0 .2em 0 0;
	}
</style>