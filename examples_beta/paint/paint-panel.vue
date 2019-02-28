<template>
    <div>
        <slot
            :width="width"
            :height="height"
            :pressd="record"
            :pressmove="move"></slot>
        <template v-if="focus">
            <panel-btn
                :source="closeImage"
                :reg-x="btnW2"
                :reg-y="btnW2"
                :geox="width"
                :geoy="0"
                :width="btnW"
                :height="btnW"
                @pressd="deleteOwn"></panel-btn>
            <panel-btn
                :source="resizeImage"
                :reg-x="btnW2"
                :reg-y="btnW2"
                :geox="width"
                :geoy="height"
                :width="btnW"
                :height="btnW"
                @pressd="record"
                @pressmove="resize"></panel-btn>
            <panel-btn
                :source="rotateImage"
                :reg-x="btnW2"
                :reg-y="btnW2"
                :geox="0"
                :geoy="height"
                :width="btnW"
                :height="btnW"
                @pressd="record"
                @pressmove="rotate"></panel-btn>
        </template>
    </div>
</template>

<script>
import VegoComponent from '@/core/VegoComponent.js';
const closeImage = require('../assets/operation/close.png');
const resizeImage = require('../assets/operation/resize.png');
const rotateImage = require('../assets/operation/rotate.png');

import panelBtn from './panel-btn.vue';
import { getAngle } from './util.js';

export default {
    components: {
        panelBtn,
    },
    mixins: [VegoComponent],
    props: {
        initialWidth: Number,
        initialHeight: Number,
        focus: Boolean,
    },
    data() {
        console.log(this.initialWidth / 2);
        console.log(this.initialHeight / 2);
        return {
            width: this.initialWidth,
            height: this.initialHeight,
            btnW: 50,
            btnW2: 25,
            closeImage,
            resizeImage,
            rotateImage,
            lastWH: {},
        };
    },
    computed: {
        halfw() {
            return this.width / 2;
        },
        halfh() {
            return this.height / 2;
        },
        rotationBtnAngle() {
            return Math.atan(this.height / this.width) / Math.PI * 180;
        },
    },
    watch: {
        width(val) {
            this.vegoDisplayObject.$geometry.regX = val / 2;
        },
        height(val) {
            this.vegoDisplayObject.$geometry.regY = val / 2;
        },
        focus(val) {
            console.log(val);
        },
    },
    mounted() {
        this.vegoDisplayObject.$geometry.regX = this.width / 2;
        this.vegoDisplayObject.$geometry.regY = this.height / 2;
        console.log(this);
    },
    draw(g) {
        if (!this.focus)
            return;
        const {
            width, height,
        } = this;
        g.beginPath()
            .moveTo(0, 0)
            .lineTo(width, 0)
            .lineTo(width, height)
            .lineTo(0, height)
            .closePath()
            .setLineWidth(3)
            .setStrokeStyle('orange')
            .setLineDash([5, 5])
            .stroke();
    },
    methods: {
        record(payload) {
            const {
                x, y,
            } = payload;
            this.lastWH = {
                w: this.width,
                h: this.height,
                x: this.vegoDisplayObject.$geometry.x,
                y: this.vegoDisplayObject.$geometry.y,
                angle: getAngle(this.vegoDisplayObject.$geometry.x, y, this.vegoDisplayObject.$geometry.y, x, y) + 90 + this.rotationBtnAngle,
            };
            this.$emit('onfocus');
        },
        resize(payload) {
            const {
                vecX,
                vecY,
            } = payload;
            this.width = this.lastWH.w + vecX * 2;
            this.height = this.lastWH.h + vecY * 2;
        },
        move(payload) {
            const {
                vecX,
                vecY,
            } = payload;
            this.vegoDisplayObject.$geometry.x = this.lastWH.x + vecX;
            this.vegoDisplayObject.$geometry.y = this.lastWH.y + vecY;
        },
        rotate(payload) {
            const {
                x,
                y,
            } = payload;

            this.vegoDisplayObject.$geometry.rotation = getAngle(this.lastWH.x, this.lastWH.y, x, y) + 90 + this.rotationBtnAngle;
        },
        deleteOwn() {
            this.$emit('dismiss');
        },
    },
};
</script>

<style>

</style>
