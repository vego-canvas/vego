import Vue from 'vue';
import Vuex from 'vuex';
// import home from './tests/tweentest.vue';
//import home from './tests/solar.vue';
//import home from './tests/chart.vue';
//import home from './index.vue';
import index from './tests/index.vue'
import './src/canvas.vue';
import './src/core/circle.vue';
import canvasPlugin from './src/plugin';
import eventStore from './src/proto/event';

Vue.use(Vuex)
Vue.use(canvasPlugin);

const store = new Vuex.Store(eventStore);

new Vue(Object.assign(index, {
	store
})).$mount("#app");
