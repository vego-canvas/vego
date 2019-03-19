import Vue from 'vue';

import index from './component/arc.vue';
import canvasPlugin from '@/plugin';

Vue.use(canvasPlugin, {
    enableMouseOver: 5,
    enableTouch: false,
    // plugins: [d3Geo],
});

new Vue(index).$mount('#app');
