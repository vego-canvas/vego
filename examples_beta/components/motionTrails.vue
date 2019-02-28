<template>
    <div></div>
</template>

<script>
export default {
    props: {
        trailLength: Number,
        radius: Number,
        x: Number,
        y: Number,
        name: String,
    },
    data() {
        return {
            positions: [],
        };
    },
    methods: {
        storePosition(x, y) {
            this.positions.push({
                x,
                y,
            });

            if (this.positions.length > this.trailLength)
                this.positions.shift();
        },
    },
    draw(g) {
        this.storePosition(this.x, this.y);
        const positionsLen = this.positions.length;
        for (let i = 0; i < positionsLen; i++) {
            let transparency;
            let circleScaleFactor;

            const scaleFactor = i / positionsLen;

            if (i === positionsLen - 1) {
                transparency = 1;
                circleScaleFactor = 1;
            } else {
                transparency = scaleFactor / 2;
                circleScaleFactor = scaleFactor;
            }

            g.beginPath()
                .arc(
                    this.positions[i].x,
                    this.positions[i].y,
                    circleScaleFactor * this.radius,
                    0,
                    2 * Math.PI
                );
            g.setFillStyle(`rgb(0, 12, 153, ${transparency})`)
                .fill();
        }
        if (this.name) {
            g.fillText(this.name, this.x + 12, this.y + 4);
        }
    },
};
</script>

<style>

</style>
