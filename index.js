import Vue from 'vue';
import home from './index.vue';
import './src/canvas.vue';
import './src/core/circle.js';
import canvasPlugin from './src/plugin';


Vue.use(canvasPlugin);

new Vue(home).$mount("#app");
