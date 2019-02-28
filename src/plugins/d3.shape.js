import axisd3 from './components/shapes/axis.vue';
import lined3 from './components/shapes/line.vue';
import aread3 from './components/shapes/area.vue';
import pied3 from './components/shapes/pie.vue';
export default {
    global: {
        methods: {
            shapePath({ g, path, data }) {
                path.context(g)(data);
            },
        },
    },
    canvas: {

    },
    install(Vue) {
        Vue.component('axis-d3', axisd3);
        Vue.component('line-d3', lined3);
        Vue.component('area-d3', aread3);
        Vue.component('pie-d3', pied3);
    },
};
