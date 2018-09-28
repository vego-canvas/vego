<template>
	<bitmap 
	:dx="dx" :dy="dy" :dw="dwidth" :dh='dheight' 
	:sx="sx" :sy="sy" :sw="swidth" :sh='sheight' 
	:src="src">
		{{mouse}}
	</bitmap>
</template>
<script>

import watcherMixin from '../proto/mouseEvtWatcherMixin';
// import Vue from 'vue';
export default {
	name: 'my-circle',
	mixins: [ watcherMixin ],
	props: ['dx', 'dy', 'dwidth', 'dheight',
			'sx', 'sy', 'swidth', 'sheight',
	 'src'],
	draw(ctx, p){
		const {
			sx, sy, sWidth, sHeight,
			dx, dy, dWidth, dHeight,
		} = this;
		
		ctx.beginPath();
		ctx.save();
		ctx.drawImage(this.source, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
		ctx.restore();		
	},
	watch: {
		src(val){
			this.source = new Image();
			this.source.src = val;
		}
	},
	mounted(){
		this.source = new Image();
		this.source.src = this.src;
	}
};
</script>