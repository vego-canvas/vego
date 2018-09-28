import Vue from 'vue';

// const mouseSymbol = Symbol("_vanillasmouseevent"); 

// class mouseEventStore {
// 	constructor(){
// 		this._vm = new Vue();
// 		this._store = {
// 			x: 0,
// 			y: 0
// 		}
// 		this._vm.$set(this._store, x, 0)
// 	}
// }

const mouseStore = {
	x: 0,
	y: 0,
}
const mouseEventVM = new Vue({
	data(){
		return {
			mouse: mouseStore
		}
	}
});

export default mouseEventVM;