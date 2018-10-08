<template>
	<div>
		<div>
			<button class="btn" @click="openfile">file</button>
			<button class="btn" @click="chooseBtn">bubble</button>
		</div>
		<div class="scroll-row">
			<div v-for="icon in bubblesIcon">
				<img class="bubble" :src="icon" @click="addBubble(icon)">
			</div>
		</div>
		<my-canvas :width="canvasWidth" :height="canvasHeight" @mousedown="noEdit">
			<container v-if="bgImage" :x="panel.x" :y="panel.y" :regX="panel.regX" :regY="panel.regY" :rotation="panel.rotation">
				<targetImage :dx="0" :dy="0" :dwidth="panel.width" :dheight="panel.height" :src="bgImage" @pressmove="move" @mousedown="prepare"/>
			</container>
			<container v-for="bb in bubbles"  :x="bb.x" :y="bb.y" :regX="bb.regX" :regY="bb.regY" :rotation="bb.rotation">
				<targetImage :dx="0" :dy="0" :dwidth="bb.width" :dheight="bb.height" :src="bb.img" @pressmove="move" @mousedown="prepare($event, bb)"/>
			</container>
			<container v-if="editing" :x="panel.x" :y="panel.y" :regX="panel.regX" :regY="panel.regY" :rotation="panel.rotation">
				<controlRect :x="0" :y="0" :width="panel.width" :height="panel.height"/>
				<controlPoint :dx="panel.width - 25" :dy="panel.height - 25" :dwidth="50" :dheight="50" :src="resizeIcon" @pressmove="resize" @mousedown="prepare"/>
				<controlPoint :dx="panel.width - 25" :dy="-25" :dwidth="50" :dheight="50" :src="closeIcon" @click="deleteimg"/>
				<controlPoint :dx="-25" :dy="panel.height - 25" :dwidth="50" :dheight="50" :src="rotateIcon" @pressmove="rotate" @mousedown="prepare"/>
			</container>
		</my-canvas>
		<input ref="picfilereader" type="file" name="pic" accept="image/*, image/png, image/jpeg, image/gif, image/jpg, .png, .jpg, .jpeg" class="diyfile" @change="fileChanged" />
	</div>
</template>
<script>
	import Rbitmap from '@/core/Rbitmap.vue';
	import bitmap from '@/core/bitmap.vue';
	import rect from '@/core/Rectangle.vue';
	import container from '@/core/container.vue';
	const resizeIcon = require('./assets/resize.png');
	const closeIcon = require('./assets/close.png');
	const rotateIcon = require('./assets/rotate.png');

	const bubbles = Array(10).fill(1).map((i, idx) => require(`./assets/bubble/${idx+1}.png`))
	
	export default {
		name: 'drift',
		components: {
			"controlPoint": Rbitmap,
			"controlRect": rect,
			"targetImage": bitmap,
			container
		},
		data(){
			return {
				canvasWidth: 800,
				canvasHeight: 800,
				bubblesIcon: bubbles,

				bubblePanel: {
					x: 400/2,
					y: 400/2,
					width: 200,
					height: 200,
					regX: 100,
					regY: 100,
					rotation: 0,					
				},

				bubbles: [],

				panel: {
					x: 400/2,
					y: 400/2,
					width: 200,
					height: 200,
					regX: 100,
					regY: 100,
					rotation: 0,
				},
				resizeIcon,
				closeIcon,
				rotateIcon,

				editing: false,

				bgImage: undefined,
			}
		},
		watch:{
			bgImage(val){
				if(val){
					console.log(val)
					this.editing = true;
				}
			}
		},
		methods: {
			addBubble(icon){
				const panel = {
					x: 400/2,
					y: 400/2,
					width: 200,
					height: 200,
					regX: 100,
					regY: 100,
					rotation: 0,
					img: icon					
				}
				this.bubbles.push(panel);
				this.panel = panel

			},
			chooseBtn(){

			},
			prepare(e, bubble){
				this.editing = true;
				if(bubble){
					this.preparePanle = {
						...bubble
					};
					this.panel = bubble;
				}else{
					this.preparePanle = {
						...this.panel
					}
				}

				this.rotateOffset = 180* (Math.atan2(this.preparePanle.height/2,this.preparePanle.width/2) - Math.PI/2) / Math.PI
				console.log(this.rotateOffset);
			},
			resize(e){
				const {
					anchorX, anchorY,
					x, y
				} = e;
				const vecx = x - anchorX;
				const vecy = y - anchorY;
				
				this.panel.width = this.preparePanle.width + vecx * 2 ;
				this.panel.height = this.preparePanle.height + vecy * 2;
				this.panel.regX = this.panel.width / 2;
				this.panel.regY = this.panel.height / 2;
			},
			rotate(e){
				const {
					anchorX, anchorY,
					x, y
				} = e;

				const dx = x - this.preparePanle.x;
				const dy = y - this.preparePanle.y;

				const theta = 180*(Math.atan2(dy, dx) - Math.PI /2)/Math.PI + this.rotateOffset

				this.panel.rotation = theta;

			},
			move(e){
				const {
					anchorX, anchorY,
					x, y
				} = e;
				const vecx = x - anchorX;
				const vecy = y - anchorY;
				this.panel.x = this.preparePanle.x + vecx;
				this.panel.y = this.preparePanle.y + vecy;
			},
			openfile(){
				this.$refs.picfilereader.click();
			},
			fileChanged(e){
				let file = this.$refs.picfilereader.files[0];
				if(file){
					const fileReader = new FileReader();
	      			fileReader.onload = (evt) => {
				        this.bgImage = evt.target.result;
	      			}
					fileReader.readAsDataURL(file);					
				}
			},
			deleteimg(){
				this.editing = false;
				this.bgImage = null;
			},
			toEdit(){
				this.editing = true;
			},
			noEdit(){
				this.editing = false;
			}
		}
	}
</script>
<style module>
	.diyfile{
		display: none;
	}
	.btn{

	}
	.bubble{
		height: 100px;
		width: auto;
	}
	.scroll-row{
		display: flex;
		flex-direction: row;
		overflow: scroll;
	}
</style>