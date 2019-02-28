import { queueUpdate } from '../util/Engine';

import * as d3 from 'd3';

let projection = null;
export default {
    global: {
        methods: {
            geoPath(g, data) {
                if (projection) {
                    projection.context(g)(data);
                }
            },
        },
    },
    canvas: {
        props: {
            projectionD3: {
                type: Function, // d3 geo projection
                required: true,
            },
        },
        mounted() {
            const {
                projectionD3,
            } = this;
            for (const p in projectionD3) {
                const func = projectionD3[p];
                projectionD3[p] = (...params) => {
                    queueUpdate(this.vegoRenderWatcher);
                    return func(...params);
                };
            }
            projection = d3.geoPath().projection(this.projectionD3);
        },
    },
};
