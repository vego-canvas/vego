<template>
    <div>
        <div>
            <img class="inline-image" v-for="i in sources"
                :src="i"
                :key="i"
                @click="chooseImage(i)">
        </div>
        <vego-canvas :width="canvasWidth" :height="canvasHeight">
            <paint-panel
                v-for="(img, idx) in images"
                :key="img.id"
                :initial-width="img.width"
                :initial-height="img.height"
                :geox="img.x"
                :geoy="img.y"
                :rotation="img.rotation"
                :focus="isFocus(img)"
                @dismiss="dismiss(img, idx)"
                @onfocus="onfocus(img)">
                <template slot-scope="panel">
                    <paint-target
                        :width="panel.width"
                        :height="panel.height"
                        :source="img.source"
                        @pressd="panel.pressd"
                        @pressmove="panel.pressmove">
                    </paint-target>
                </template>
            </paint-panel>
        </vego-canvas>
    </div>
</template>

<script>
import paintPanel from './paint-panel.vue';
import paintTarget from './paint-target.vue';
const sources = [];
for (let i = 1; i <= 6; i++) {
    sources.push(require(`../assets/charaters/c${i}.png`));
}
let uid = 0;
export default {
    components: {
        paintPanel,
        paintTarget,
    },
    data() {
        return {
            sources,
            images: [],
            target: undefined,
            canvasWidth: 800,
            canvasHeight: 600,
        };
    },

    methods: {
        isFocus(img) {
            return this.target === img;
        },
        chooseImage(i) {
            const img = new Image();
            img.onload = () => {
                const target = {
                    id: uid++,
                    width: img.width,
                    height: img.height,
                    x: this.canvasWidth / 2,
                    y: this.canvasHeight / 2,
                    rotation: 0,
                    source: i,
                    editing: true,
                };
                this.images.push(target);
                this.target = target;
            };
            img.src = i;
        },
        dismiss(img, idx) {
            console.log('dismiss', idx);
            this.images.splice(idx, 1);
            console.log(this.images);
        },
        onfocus(img) {
            this.target = img;
        },
        unfocus() {
            this.target = null;
        },
    },
};
</script>

<style>
.inline-image{
    display: inline-block;
    height: 100px;
}
</style>
