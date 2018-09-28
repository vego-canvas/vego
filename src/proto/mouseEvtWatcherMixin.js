import mouseEventVM from './mouseEvent';

export default {
	data(){
		return {
			mouseEvt:{
				hit: false,
				
			}
		}
	},
	mounted(){
		console.log(this);
		mouseEventVM.$watch('mouse', (newVal) => {
			const { x, y } = newVal;
			//console.log(x, y)
			this.mouseEvt.hit = this._hitTest(x, y);
		});
	},
	updated(){
		console.log(this.uuid)
	},
	watch:{
 		'mouseEvt.hit':function(val) {
 			if(val){
 				this.$emit('mouseenter');
 			}else{
 				this.$emit('mouseleave');
 			}
 		}
 	},
}