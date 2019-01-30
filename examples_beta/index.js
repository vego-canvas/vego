import Vue from 'vue';
import index from './demos/simple.vue';

import canvasPlugin from '@/plugin';

Vue.use(canvasPlugin, {
    enableMouseOver: 5,
    enableTouch: true,
});

new Vue(index).$mount('#app');
