import Vue from 'vue';

const vm1 = Vue.component('my-circle', {
	props: ['x', 'y', 'r', 'color'],
	mounted(){
		//console.log(this.$parent.$el);
	},
	renderCanvas(c){
		return c('circle', {
			x: this.x,
			y: this.y,
			r: this.r,
			color: this.color
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
