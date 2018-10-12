<template>
	<div>
		<div>
			<a href="#" @click.prevent="setComp('solar')">solar</a>
			<a href="#" @click.prevent="setComp('tweentest')">tweentest</a>
			<a href="#" @click.prevent="setComp('chart')">chart</a>
			<a href="#" @click.prevent="setComp('drift')">drift</a>
			<a href="#" @click.prevent="setComp('bouncing')">bouncing</a>
			<a href="#" @click.prevent="setComp('spritesheet')">spritesheet</a>
		</div>
		<components :is="comp">
		</components>
	</div>
</template>
<script>
import tweentest from './tweentest.vue';
import solar from './solar.vue';
import chart from './chart.vue';
import drift from './drift.vue';
import bouncing from './bouncing.vue';
import spritesheet from './spriteSheet.vue';

const comps = {tweentest, solar, chart, drift, bouncing, spritesheet}
// import Vue from 'vue';
export default {
	name: 'my-index',
	data(){
		return {
			comp: spritesheet
		}
	},
	methods:{
		setComp(comp){
			this.comp = comps[comp]
		}
	}
};
</script>