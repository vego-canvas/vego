<template>
	<div>
		<vego-canvas>
			<my-circle :config="circle1" 
				@click="onclick('circle1', $event)"
				@mousemove="onmousemove('mousemove circle1')"/>
			<my-circle :config="circle2"
				@click="onclick('circle2', $event)"
				@mousemove="onmousemove('mousemove circle2')"/>
			<container :x="x" :y="y" 
				@click="onclick('circle3 or 4', $event)" 
				@mousemove="onmousemove('mousemove circle3 or 4')">
				<my-circle :config="circle3" />
				<my-circle :config="circle4" @mousemove="onmousemovecircle4"/>				
			</container>
		</vego-canvas>
	</div>
</template>
<script>
	import container from '@/core/containerWithEvent.vue'
	import circle from './components/circleWithDispatcherMixin.vue';
	export default {
		components: { 
			"my-circle": circle,
			"container": container
		},
		data(){
			return {
				circle1: {
					x: 50,
					y: 50,
					r: 50,
					color: 'red',
				},
				circle2: {
					x: 80,
					y: 50,
					r: 50,
					color: 'blue',
				},
				x: 100,
				y: 50,
				circle3: {
					x: 0,
					y: 0,
					r: 50,
					color:'yellow',
				},
				circle4: {
					x: 40,
					y: 0,
					r: 50,
					color:'green',
				},				
			}
		},
		methods: {
			onclick(which, event){
				console.log(which, event);
			},
			onmousemove(which){
				console.log(which)
			},
			onmousemovecircle4(event){
				event.stopPropagation();
			}
		}
	}
</script>
