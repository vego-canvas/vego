import Vue from 'vue';
// import index from './piechart.vue';
import index from './linechart.vue';
import canvasPlugin, { d3Shape } from '@/plugin';

Vue.use(canvasPlugin, {
    enableMouseOver: 5,
    enableTouch: false,
    plugins: [d3Shape],
});

new Vue(index).$mount('#app');
