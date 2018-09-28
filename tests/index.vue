<template>
	<div>
		<div>
			<a href="#" @click.prevent="setComp('solar')">solar</a>
			<a href="#" @click.prevent="setComp('tweentest')">tweentest</a>
			<a href="#" @click.prevent="setComp('chart')">chart</a>
			<a href="#" @click.prevent="setComp('drift')">drift</a>
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

const comps = {tweentest, solar, chart, drift}
// import Vue from 'vue';
export default {
	name: 'my-index',
	data(){
		return {
			comp: drift
		}
	},
	methods:{
		setComp(comp){
			this.comp = comps[comp]
		}
	}
};
</script>