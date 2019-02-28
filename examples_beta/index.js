import Vue from 'vue';
// import index from './demos/nbodygravity.vue';
// import index from './demos/d3chartbinding.vue';
// import index from './demos/d3geobinding.vue';
// import index from './demos/d3geobinding.vue';
// import index from './demos/spreads.vue';
// import index from './demos/chart.vue';
// import index from './demos/demo.vue';
// import index from './demos/simple.vue';
// import index from './demos/donuts.vue';
// import index from './demos/sprite.vue';
// import index from './demos/2ormorecanvas.vue';
import index from './paint/canvas-vego.vue';
import canvasPlugin, { d3Geo } from '@/plugin';

Vue.use(canvasPlugin, {
    enableMouseOver: 5,
    enableTouch: false,
    // plugins: [d3Geo],
});

new Vue(index).$mount('#app');
