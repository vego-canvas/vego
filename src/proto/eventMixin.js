import { findEventDispacher } from '../util/common.js';

export default {
	created(){
		this.evt = findEventDispacher(this).eventDispacher
	},
	methods:{
		regist(type){
			this.evt.push(type, this)
		}
	}
}