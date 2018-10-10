import Vue from 'vue';
// import home from './tests/tweentest.vue';
//import home from './tests/solar.vue';
//import home from './tests/chart.vue';
//import home from './index.vue';
import index from './demos/index.vue'

import '@/core/circle.vue';
import canvasPlugin from '@/plugin';

Vue.use(canvasPlugin);

new Vue(index).$mount("#app");
