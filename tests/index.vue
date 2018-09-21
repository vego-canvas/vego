<template>
	<div>
		<div>
			<a href="#" @click.prevent="setComp('solar')">solar</a>
			<a href="#" @click.prevent="setComp('tweentest')">tweentest</a>
			<a href="#" @click.prevent="setComp('chart')">chart</a>
		</div>
		<components :is="comp">
		</components>
	</div>
</template>
<script>
import tweentest from './tweentest.vue';
import solar from './solar.vue';
import chart from './chart.vue';

const comps = {tweentest, solar, chart}
// import Vue from 'vue';
export default {
	name: 'my-index',
	data(){
		return {
			comp: solar
		}
	},
	methods:{
		setComp(comp){
			this.comp = comps[comp]
		}
	}
};
</script>