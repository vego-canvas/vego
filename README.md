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
import canvasPlugin from 'vego/plugin';
Vue.use(canvasPlugin);

// other initialize
```

#### Step 2. Create a canvas component

```vue
<template>
	<circle :x="x" :y="y" :r="r" :color="color">
	</circle>
</template>
<script>
// arc.vue
    
export default {
	name: 'my-arc',
	props: ['x', 'y', 'r', 'color'],
    /* 
     * function draw is same like render function in Vue
     * @params {CanvasRenderingContext2D} ctx - passing from canvas
     */
	draw(ctx){
		const {
			x, y, r, color
		} = this;

		ctx.beginPath();
		ctx.save();
		ctx.strokeStyle = color;
		ctx.arc(x, y, r, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.restore();		
	},
};
</script>

```

#### Step 3. Apply canvas component within tag vego-canvas

```vue
<template>
	<div class="root">
		<vego-canvas :width="canvasWidth" :height="canvasHeight">
			<my-arc :x="x" :y="y" :r="r" :color="color"/>
		</vego-canvas>
    </div>
</template>

<script>
	import circle from './arc.vue'; 
	export default {
		components: { "my-arc": circle },
		data(){
			return {
				canvasWidth: 200,
				canvasHeight: 200,
				x: 50,
				y: 50,
				r: 40,
				color: 'red',
			}
		},
	}
</script>

```



## Supports

Demo: './examples'

building...



## Key features

**vego-canvas**: canvas wrapper. It has width, height properties and basic events emiters. And it can fit different devicePixelRatio. All components within this tag must implement draw function which named as  *canvas components*. 

**eventMixin**: a mixin mimic mouse event, like mouseenter ,mouseleave, mousedown or mouseup, when mixin into *canvas components*. 

**tweenMixin**: a mixin used to calculate tweening when declared data changed.

**spriteSheet**: a *canvas component* to display a sprite sheet.

**container**:  a *canvas component* to contain other *canvas components* and it has own coordiantes start from left top.

**stack**: drawing commands stack composed by hierachy of  *canvas components*.

**ticker**: a internal ticker drive stack to draw graphics.



## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2018-present Tony Wang