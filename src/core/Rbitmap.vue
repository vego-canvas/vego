<template>
	<div 
		:dx="dx" :dy="dy" :dw="dwidth" :dh='dheight'
		:src="src">
	</div>
</template>
<script>

import watcherMixin from '../proto/mouseEvtWatcherMixin';
// import Vue from 'vue';
export default {
	name: 'bitmap',
	mixins: [ watcherMixin ],
	props: ['dx', 'dy', 'dwidth', 'dheight','src'],
	data(){
		return {
			imageReady: false,
			scale: 1,
		}
	},
	draw(ctx){
		const {
			dx, dy, dwidth, dheight,
		} = this;
		
		ctx.beginPath();
		ctx.save();

		if(this.imageReady){

			ctx.translate(dx+dwidth/2, dy+dheight/2);
			ctx.scale(this.scale, this.scale)
			ctx.translate(-dwidth/2, -dheight/2);

			//ctx.translate(-dwidth, -dheight / 4);
			// ctx.translate(-dwidth/2, -dheight/2);
			ctx.drawImage(this.source, 0, 0, dwidth, dheight);
		}

		ctx.restore();		
	},
	watch: {
		src(val){
			this.imageReady = false;
			this.source = new Image();
			this.source.onload = () => {
				this.imageReady = true;
			}
			this.source.src = val;
		},
		'mouseEvt.hit':function(val) {
 			if(val){
 				this.scale = 1.5;
 			}else{
 				this.scale = 1;
 			}
 		}
	},
	mounted(){
		this.source = new Image();
		this.source.onload = () => {
			this.imageReady = true;
		}
		this.source.src = this.src;

	}
};
</script>