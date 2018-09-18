import Vuex from 'vuex';
import Vue from 'vue';
const eventStore = {
  state: {
	x: 0,
	y: 0,
  },
  getters: {
    mouse: state => {
		return {
			x: state.x,
			y: state.y
		}
    }
  },
  mutations: {
    mousemove (state, payload) {
		state.x = payload.x;
		state.y = payload.y;
    },
    click (state, payload) {
		state.x = payload.x;
		state.y = payload.y;
    }
  }
};

export default eventStore;

// export default {
// 	methods:{
// 		onmousemove(e){
			
// 		}
// 	}
// }