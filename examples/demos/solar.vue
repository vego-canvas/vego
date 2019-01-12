<template>
<div class="root">
    <div class="row">
        <div class="col-7 col">
            <vego-canvas :style="{backgroundColor: 'black'}" :pause="pause" @tick="tick" :width="canvasWidth" :height="canvasHeight">
                <sun :x="400" :y="400" :r="sun.sunburn" color="red" @mouseenter="onhit(sun)" @mouseleave="onhitlose(sun)"></sun>

                <container v-for="item in planets" :key="item.key" :x="item.x" :y="item.y">
                    <planet @mouseenter="onhit(item)" @mouseleave="onhitlose(item)" :x="0" :y="0" :r="item.r" :color="item.color"></planet>
                    <orbits v-if="item.children" :x="0" :y="0" :r="50" color="white"></orbits>
                    <container v-if="item.children" v-for="sata in item.children" :key="sata.key" :x="sata.x" :y="sata.y">
                        <satellite :x="0" :y="0" :r="sata.r" :color="sata.color"></satellite>
                    </container>
                </container>
                <orbits v-for="item in orbits" :key="item.key" :x="item.x" :y="item.y" :r="item.r" :color="item.color"></orbits>
            </vego-canvas>
        </div>
        <div class="col-5 col">
            <h1>Solar System!</h1>
            <p class="brief">
                {{ briefStory }}
            </p>
            <div class="img">
                <img v-if="breifImg" :src="breifImg">
            </div>

        </div>

    </div>
</div>
</template>
<script>
import circle from '@/components/circle.vue';
import container from '@/core/container.vue';
import arc from './arc.vue';

import ticker from '@/proto/ticker';
export default {
    components: {
        container,
        orbits: arc,
        planet: circle,
        satellite: circle,
        sun: circle,
    },
    data() {
        return {
            canvasWidth: 800,
            canvasHeight: 800,
            briefStory: '',
            breifImg: '',
            pause: false,
            pauseReason: undefined,

            orbits: [
                { key: 'p1ob', x: 400, y: 400, r: 300, color: 'white' },
                { key: 'p2ob', x: 400, y: 400, r: 200, color: '#d2d2d2' },
                { key: 'p3ob', x: 400, y: 400, r: 100, color: '#333' },
            ],
            sun: {
                sunburn: 60,
                briefStory: 'The Sun, at the heart of our solar system, is a yellow dwarf star, a hot ball of glowing gases. Its gravity holds the solar system together, keeping everything from the biggest planets to the smallest particles of debris in its orbit. Electric currents in the Sun generate a magnetic field that is carried out through the solar system by the solar wind—a stream of electrically charged gas blowing outward from the Sun in all directions.',
                breifImg: 'https://solarsystem.nasa.gov/system/stellar_items/image_files/1_sun.jpg',
            },
            planets: [
                {
                    key: 'p1', x: 0, y: 0, r: 25,
                    xc: 400, yc: 400, rc: 300,
                    color: 'blue', v: Math.PI * 2 / 15000,
                    children: [
                        {
                            key: 'p1s1', x: 0, y: 0, r: 5,
                            xc: 0, yc: 0, rc: 50,
                            color: 'white', v: Math.PI * 2 / 5000,
                        },
                    ],
                    briefStory: "Like the waistband of a couch potato in midlife, the orbits of planets in our solar system are expanding. It happens because the Sun’s gravitational grip gradually weakens as our star ages and loses mass. Recently, a team of NASA and MIT scientists indirectly measured the Sun's mass loss and other solar parameters by looking at changes in Mercury’s orbit.The smallest planet in our solar system and nearest to the Sun, Mercury is only slightly larger than Earth's moon. From the surface of Mercury, the Sun would appear more than three times as large as it does when viewed from Earth, and the sunlight would be as much as 11 times brighter.",
                    breifImg: 'https://solarsystem.nasa.gov/system/feature_items/images/68_epicearthmoonstill_800.png',
                },
                {
                    key: 'p2', x: 0, y: 0, r: 30,
                    xc: 400, yc: 400, rc: 200,
                    color: 'yellow', v: Math.PI * 2 / 10000,
                    briefStory: 'Venus may have had a shallow liquid-water ocean and habitable surface temperatures for up to 2 billion years of its early history, according to computer modeling of the planet’s ancient climate by scientists at NASA’s Goddard Institute for Space Studies (GISS) in New York. Second planet from the Sun and our closest planetary neighbor, Venus is similar in structure and size to Earth, but it is now a very different world. Venus spins slowly in the opposite direction most planets do. Its thick atmosphere traps heat in a runaway greenhouse effect, making it the hottest planet in our solar system—with surface temperatures hot enough to melt lead. Glimpses below the clouds reveal volcanoes and deformed mountains',
                    breifImg: 'https://solarsystem.nasa.gov/system/stellar_items/image_files/3_feature_1600x900_venus.jpg',
                },
                {
                    key: 'p3', x: 0, y: 0, r: 15,
                    xc: 400, yc: 400, rc: 100,
                    color: 'gold', v: Math.PI * 2 / 5000,
                    briefStory: "The newest addition to the Earth science fleet is now in orbit. NASA’s Ice, Cloud and land Elevation Satellite-2 (ICESat-2) successfully launched from California at 9:02 a.m. EDT Saturday, Sept. 15, embarking on its mission to measure the Earth's ice with unprecedented accuracy. Ground stations acquired signals from the spacecraft about 75 minutes after launch and reported the spacecraft is orbiting the globe, from pole to pole, at 17,069 mph (about 27,000 kph) from an average altitude of 290 miles (465 kilometers).",
                    breifImg: 'https://solarsystem.nasa.gov/system/stellar_items/image_files/2_feature_1600x900_mercury.jpg',
                },
            ],
        };
    },
    mounted() {
        ticker(this.tick);
    },
    methods: {
        tick(t) {
            this.planets.forEach((p) => {
                this.calcPos(t, p);
            });

            this.sun.sunburn = 60 + 8 * Math.cos(t / 500);
        },

        calcPos(t, planet) {
            const {
                xc, yc, rc, v,
            } = planet;
            const theta = v * t % (Math.PI * 2);
            const deltaX = rc * Math.sin(theta);
            const deltaY = rc * Math.cos(theta);
            const newx = xc + deltaX;
            const newy = yc + deltaY;
            planet.x = newx;
            planet.y = newy;
            if (planet.children) {
                planet.children.forEach((p) => {
                    this.calcPos(t, p);
                });
            }
        },
        onhit(item) {
            this.pauseReason = item;
            this.pause = true;
            this.briefStory = item.briefStory;
            this.breifImg = item.breifImg;
        },
        onhitlose(item) {
            if (item === this.pauseReason) {
                this.pause = false;
            }
        },
    },
};
</script>
<style>
.root{
    background-color: black;
    color: white;
}
.container{
    display: flex;
}
.canvas{
    width: 800px;
}
.flex{
    flex: 1;
}
.img{
    width: 100%;
    height: auto;
}
.img > img{
    width: 100%;
}
p {
    font-size: 1.25em;
    margin: 0 auto;
}

p::first-letter {
    color: #c69c6d;
    float: left;
    font-size: 5em;
    margin: 0 .2em 0 0;
}
</style>
