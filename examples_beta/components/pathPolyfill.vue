<template>
    <div :color="color"></div>
</template>

<script>

const randomColor = () => {
    const r = `rgb(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)})`;
    return r;
};
export default {
    props: {
        topo: Object,
    },
    data() {
        return {
            color: randomColor(),
        };
    },
    mounted() {
        const color = this.color;
        this.vegoDisplayObject.$regist('mouseenter', (payload) => {
            this.color = 'black';
        });
        this.vegoDisplayObject.$regist('mouseleave', (payload) => {
            this.color = color;
        });
        // console.log(this.topo);
    },
    draw(g) {
        g.beginPath();
        this.geoPath(g, this.topo);
        // this.path.context(g)(this.topo);
        g.setFillStyle(this.color).fill();
    },
};
</script>

<style>

</style>
