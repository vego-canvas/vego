import Vue from 'vue';
import index from './demos/demo.vue';
// import index from './demos/simple.vue';
import canvasPlugin from '@/plugin';

Vue.use(canvasPlugin, {
    enableMouseOver: 5,
    enableTouch: false,
});

new Vue(index).$mount('#app');
