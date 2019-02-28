<template>
    <vego-canvas :width="canvasWidth" :height="canvasHeight">
        <motion-trails
            v-for="mass in masses"
            :key="mass.name"
            :trail-length="trailLength"
            :radius="radius"
            :name="mass.name"
            :x="mass.x"
            :y="mass.y"></motion-trails>
    </vego-canvas>
</template>

<script>
import { NBodyProblem } from './nbodyproblem.js';
import motionTrails from '../components/motionTrails.vue';
const scale = 100;
const radius = 4;
const trailLength = 35;

export default {
    components: {
        motionTrails,
    },
    data() {
        return {
            canvasWidth: 800,
            canvasHeight: 600,
            scale,
            radius,
            trailLength,
            masses: [],
        };
    },
    mounted() {
        const masses = [{
            name: 'Sun', // We use solar masses as the unit of mass, so the mass of the Sun is exactly 1
            m: 1,
            x: -1.50324727873647e-6,
            y: -3.93762725944737e-6,
            z: -4.86567877183925e-8,
            vx: 3.1669325898331e-5,
            vy: -6.85489559263319e-6,
            vz: -7.90076642683254e-7,
            xc: 0,
            yc: 0,
        },
        {
            name: 'Mercury',
            m: 1.65956463e-7,
            x: -0.346390408691506,
            y: -0.272465544507684,
            z: 0.00951633403684172,
            vx: 4.25144321778261,
            vy: -7.61778341043381,
            vz: -1.01249478093275,
            xc: 0,
            yc: 0,
        },
        {
            name: 'Venus',
            m: 2.44699613e-6,
            x: -0.168003526072526,
            y: 0.698844725464528,
            z: 0.0192761582256879,
            vx: -7.2077847105093,
            vy: -1.76778886124455,
            vz: 0.391700036358566,
            xc: 0,
            yc: 0,
        },
        {
            name: 'Earth',
            m: 3.0024584e-6,
            x: 0.648778995445634,
            y: 0.747796691108466,
            z: -3.22953591923124e-5,
            vx: -4.85085525059392,
            vy: 4.09601538682312,
            vz: -0.000258553333317722,
            xc: 0,
            yc: 0,
        },
        {
            m: 3.213e-7,
            name: 'Mars',
            x: -0.574871406752105,
            y: -1.395455041953879,
            z: -0.01515164037265145,
            vx: 4.9225288800471425,
            vy: -1.5065904473191791,
            vz: -0.1524041758922603,
            xc: 0,
            yc: 0,
        }];

        const g = 39.5;
        const dt = 0.008; // 0.005 years is equal to 1.825 days
        const softeningConstant = 0.15;
        const innerSolarSystem = new NBodyProblem({
            g, dt, softeningConstant, masses,
        });
        // const innerSolarSystem = new NBodyProblem({
        //     g,
        //     dt,
        //     masses: JSON.parse(JSON.stringify(masses)),
        //     softeningConstant,
        // });
        const {
            canvasWidth, canvasHeight, scale,
        } = this;
        const masslocal = innerSolarSystem.masses.map((massI) => ({
            x: canvasWidth / 2 + massI.x * scale,
            y: canvasHeight / 2 + massI.y * scale,
            name: massI.name,
        }));
        this.masses = masslocal;

        const animate = () => {
            /*
            * Advance our simulation by one step
            */

            innerSolarSystem
                .updatePositionVectors()
                .updateAccelerationVectors()
                .updateVelocityVectors();
            const massesLen = innerSolarSystem.masses.length;
            for (let i = 0; i < massesLen; i++) {
                const massI = innerSolarSystem.masses[i];
                const massILocal = this.masses[i];
                const x = massILocal.x = canvasWidth / 2 + massI.x * scale;
                const y = massILocal.y = canvasHeight / 2 + massI.y * scale;
                if (x < radius || x > canvasWidth - radius)
                    massI.vx = -massI.vx;

                if (y < radius || y > canvasHeight - radius)
                    massI.vy = -massI.vy;
            }

            requestAnimationFrame(animate);
        };
        animate();
    },

};
</script>

<style>

</style>
