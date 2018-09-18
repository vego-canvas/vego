import { mapGetters } from 'vuex'

export default {
	computed: mapGetters(['mouse']),
	watch:{
 		mouse(val){
 			const { x, y } = val;
 			const r = this._hitTest(x, y);
 			if(r){
 				this.$emit('mouseenter');
 			}else{
 				this.$emit('mouseleave')
 			}
 			
 			
 		}
 	},
}