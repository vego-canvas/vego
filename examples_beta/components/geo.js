const width = 960;
const height = 500;
export const projection = window.d3.geo.albersUsa().scale(1070).translate([width / 2, height / 2]);
// const path = d3.geo.path().projection(projection);

export const path = window.d3.geoPath()
    .projection(projection)
    .pointRadius(2);
