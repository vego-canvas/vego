import Vue from 'vue';

const vm1 = Vue.component('my-circle', {
	props: ['x', 'y', 'r', 'color'],
	draw(ctx, data){
		console.log('draw')
		const {
			x, y, r, color
		} = data;
		ctx.beginPath();
		ctx.save();
		ctx.fillStyle = color;
		ctx.arc(x, y, r, 0, 2 * Math.PI);
		ctx.fill();
		ctx.restore();		
	},
	mounted(){
		//console.log(this.$parent.$el);
	},
	render(c){
		return c('circle', {
			props:{
				x: this.x,
				y: this.y,
				r: this.r,
				color: this.color
			}
		})
	}
});

// const vm2 = Vue.component('my-rectangle', {
// 	props: ['x', 'y', 'w', 'h', 'color'],
// 	mounted(){
// 		//console.log('mounted');
// 	},
// 	renderCanvas(c){
// 		return c('rectangle', {
// 			x: this.x,
// 			y: this.y,
// 			w: this.w,
// 			h: this.h,
// 			color: this.color
// 		})
// 	}
// });
