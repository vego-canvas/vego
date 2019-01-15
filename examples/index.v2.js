import Vue from 'vue';
// import home from './tests/tweentest.vue';
import home from './demos/simple.vue';
// import home from './tests/chart.vue';
// import home from './index.vue';
// import index from './demos/index.vue';

import canvasPlugin from '@/plugin2';
console.log(canvasPlugin);

Vue.use(canvasPlugin);

new Vue(home).$mount('#app');
