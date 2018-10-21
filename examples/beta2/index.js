import Vue from 'vue';
import index from './index.vue'

import canvasPlugin from '@/plugin';

Vue.use(canvasPlugin);

new Vue(index).$mount("#app");
