import Easing from '../util/Easing.js';
import Ticker from '../proto/ticker.js';

class Tweenlet {
	constructor(ob, from, to){
		this.from = from;
		this.to = to;
		this.ob = ob;
		this.span = to - from; // TODO span in color
	}

	tick(t, easing, begin, duration){
		const expo = easing((t - begin) / duration);
		// const p = {};
		// p[this.ob] = this.span * expo + this.from;
		return this.span * expo + this.from
	}
	end(){
		// const p = {};
		// p[this.ob] = this.to;
		return this.to;
	}
}

class Tween extends Map{
	constructor(callback, duration, easing){
		super()

		this.callback = callback;
		if(typeof easing === "string"){
			this.easing = Easing[easing];
		}else{
			this.easing = easing;
		}
		
		this.duration = duration;

		this.begin = undefined;
		this.end = undefined;
		this.pause = true;
		this.origin = undefined;
	}

	tick(t){
		if(this.pause) return

		if(!this.begin){
			this.begin = t;
			this.end = t + this.duration;
		}
		if(t > this.end) {
			this.reset();
			const newCtx = this.origin;
			this.forEach(tw => {
				// same
				const newV = tw.end();
				walkInTween(tw, newCtx, newV);
				//return Object.assign(newO, tw.end());
			});
			this.callback(newCtx, true);
			return 
		}
		const newCtx = this.origin;
		this.forEach(tw => {
			// same
			const newV = tw.tick(t, this.easing, this.begin, this.duration);
			walkInTween(tw, newCtx, newV);

			// keychain.reduce((accu, k, i) => {

			// 	if(/^\d+$/.test(k)){
			// 		if(!accu[k]) accu[k] = [];
			// 		return accu[k]
			// 	}
			// 	if(!accu[k]) accu[k] = {};
			// 	return accu[k]
				
			// }, newCtx);


			// return Object.assign(newO, tw.tick(t, this.easing, this.begin, this.duration))
		});
		this.callback(newCtx);
	}
	reset(){
		this.begin = undefined;
		this.end = undefined;
		this.pause = true;
	}
}

function walkInTween(tweenlet, ctx, newV){
	const keychain = tweenlet.ob.split('.');
	let i = 0, l = keychain.length - 1, k,
		accu = ctx, knext;
	for(;i<l;i++){
		k = keychain[i];
		knext = keychain[i+1];

		if(/^\d+$/.test(knext)){
			if(!accu[k]) accu[k] = [];
			accu = accu[k];
			continue;
		}
		if(!accu[k]) accu[k] = {};
		accu = accu[k];
	}

	accu[keychain[i]] = newV;
}

const _tweenPrefix = '_tweenProps_'
const genTweenProp = function(key){
	return `${_tweenPrefix}${key}`;
}
const TickInTweens = function(newCtx, flag){
	// console.log('tick')
	Object.keys(newCtx).forEach(k => this._renderCtx[k] = newCtx[k]);
	if(flag){
		this.$emit('tweenend')
	}
}

const TWEENID = Symbol('_tweenId');
const TWEEN = Symbol('_tween');

const compare = function(a, b){
	if(typeof a === 'object' && typeof b === 'object'){
		return JSON.stringify(a) === JSON.stringify(b);
	}else{
		return a === b
	}
}
const clone = function(a){
	if(typeof a === 'object'){
		return JSON.parse(JSON.stringify(a))
	}else{
		return a;
	}
}

function iterateObject(prop, callback){
	if(typeof prop  === 'object'){

	}else{
		callback(prop);
	}
}

// const genTweenLets = function(name, target, toVal){
// 	if(typeof target === 'object'){
// 		// object or array
// 		if(Array.isArray(target)){

// 		}else{
// 			target.
// 		}
// 	}else{
// 		const t = new Tweenlet(k, drawCtx[k], val);
// 		this[TWEEN].set(k, t);
// 		this[TWEEN].pause = false;
// 	}
// }

function watch(vm, target, lastKey){
	if(typeof target === 'object'){

		if(Array.isArray(target)){
			target.forEach((k, i) => {
				watch(vm, k, `${lastKey}.${i}`)
			})			
		}else{
			for(let k of Object.keys(target)){
				watch(vm, target[k], `${lastKey}.${k}`);
			}
		}
	}else{
		vm.$watch(lastKey, (val, oldval) => {
			// console.log(lastKey, val)
			const t = new Tweenlet(lastKey, oldval, val);
			vm[TWEEN].set(lastKey, t);
			vm[TWEEN].pause = false;
	 	});
	}
}

export default {
	props: [ "tween" ],	
	mounted(){
		const {
			duration,
			easing,
			observe,

		} = this.tween;
		this[TWEEN] = new Tween(TickInTweens.bind(this), duration, easing);
		
		const drawCtx = {};

		this.$options.dataKeysInDraw.forEach((k) => {
			drawCtx[k] = clone(this[k]);

			// console.log(drawCtx, k);
			if(observe.indexOf(k) !== -1){
				watch(this, drawCtx[k], k);
			}else{
				this.$watch(k, (val, oldval) => {
					drawCtx[k] = val;
				});
				
			}



			// this.$watch(k, (val, oldval) => {
			// 	console.log('compare ' + k, JSON.stringify(val), JSON.stringify(oldval))
			// 	if(compare(val, oldval)) {
			// 		console.log('same')
			// 		this[TWEEN].pause = true;
			// 		return 
			// 	};
			// 	if(observe.indexOf(k) !== -1){
			// 		console.log('Tweenlet')
			// 		const t = new Tweenlet(k, drawCtx[k], val);
			// 		this[TWEEN].set(k, t);
			// 		this[TWEEN].pause = false;
			// 	}else{
			// 		console.log('reset')
			// 		drawCtx[k] = val;
			// 	}
			// });
		});
		this[TWEEN].origin = drawCtx;
		// observe.forEach(ob => {
		// 	console.log(ob);
		// 	this.$watch(ob, (val, oldval) => {
		// 		const t = new Tweenlet(ob, oldval, val);
		// 		this[TWEEN].set(ob, t);
		// 		this[TWEEN].pause = false;
		// 	});
		// });
		Ticker.regist(this[TWEEN]);
		this._renderCtx = drawCtx;
	}

}