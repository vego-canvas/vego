import Vue from 'vue';
import home from './index.vue';
import './src/canvas.vue';
import './src/core/circle.vue';
import canvasPlugin from './src/plugin';


Vue.use(canvasPlugin);

new Vue(home).$mount("#app");
