# Vego

Vego is a Vue based library which apply MVVM (Model–view–viewmodel) to HTML5 canvas 2D programing. It provides a bunch of features allow you manipulate graphics like writing Vue components to manipulate DOMs. And it also provides a event mixin to mimic mouse interactions events.

It is designed for building reusable *canvas components* used for tiny games or simple data visualization or other requirements bringing canvas in Vue project.



## Install

```
npm install vego
```



## Quick Start

#### Step 1. Use plugin

```javascript

import Vego from 'vego';

Vue.use(Vego, {
    /*
     * mouseover firing frequency
     * set 0 to disable mouseover
     *
     * The larger the value, the smaller the CPU usage.
     * default: 20ms
     */
    enableMouseOver: 5,
     /*
     * Set true to enable touch and disable mouse event
     * default: false
     */
    enableTouch: false,
});


// other initialize
```

#### Step 2. Create a canvas component

```vue
<template>
    <div :r="r" :color="color">
    </div>
</template>
<script>
import VegoComponent from '@/core/VegoComponent.js';
export default {
    name: 'my-arc',
    mixins: [VegoComponent],
    props: { r: Number, color: String },
    mounted() {
        this.vegoDisplayObject.$regist('mouseenter', (payload) => {
            this.$emit('mouseenter', payload);
        });
        this.vegoDisplayObject.$regist('mouseleave', (payload) => {
            this.$emit('mouseleave', payload);
        });
        this.vegoDisplayObject.$regist('pressd', (payload) => {
            this.$emit('pressd', payload);
        });
        this.vegoDisplayObject.$regist('unpressed', (payload) => {
            this.$emit('unpressed', payload);
        });
        this.vegoDisplayObject.$regist('pressmove', (payload) => {
            this.$emit('pressmove', payload);
        });
    },
    draw(g) {
        const {
            r, color,
        } = this;
        g.beginPath()
            .setFillStyle(color)
            .arc(0, 0, r, 0, Math.PI * 2)
            .fill();
    },
};
</script>

```

#### Step 3. Apply canvas component within tag vego-canvas

```vue
<template>
<div>
    <vego-canvas :width="canvasWidth" :height="canvasHeight">
        <my-arc
            v-for="i in circles"
            :key="i"
            :geox="x"
            :geoy="y + 20*i "
            :reg-x="regX"
            :reg-y="regY"
            :rotation="rotation"
            :r="r"
            :color="color"
            @mouseenter="enterHandler"
            @mouseleave="leaveHandler"></my-arc>
    </vego-canvas>
</div>
</template>

<script>
	import circle from './circle.vue';
	export default {
		components: { 'my-arc': circle },
		data() {
			return {
				circles: 1,
				canvasWidth: 200,
				canvasHeight: 200,
				x: 50,
				y: 50,
				regX: 0,
				regY: 0,
				rotation: 0,
				r: 40,
				color: 'red',
			};
		},
		methods: {
			enterHandler() {
				this.color = 'blue';
			},
			leaveHandler() {
				this.color = 'red';
			},
		},
	}
</script>

```



## Supports

Demo: './examples_beta'



## Key features

**vego-canvas**: canvas wrapper. It has width, height properties and basic events emiters. And it can fit different devicePixelRatio. All components within this tag must implement draw function which named as  *canvas components*.

**VegoComponent**: canvas component mixin which mixin basic geometry properties into ordinary components.

**Graphic**: A thin wrapper for [CanvasRenderingContext2D](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D) API which implement method chaining pattern.

## vegocore
[vegocore](https://github.com/vego-canvas/vego-core)


## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2018-present Tony Wang