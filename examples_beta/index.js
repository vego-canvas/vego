import Vue from 'vue';
import index from './demos/chart.vue';

import canvasPlugin from '@/plugin';

Vue.use(canvasPlugin);

new Vue(index).$mount('#app');
