// class EventDispatcher extends Map{
// 	constructor(){
// 		super();
// 	},
// 	addEventListener(type, listener){
// 		if(this.has(type)){
// 			this.get(type).push(listener);
// 		}else{
// 			this.set(type, [ listener ]);
// 		}	
// 	},
// 	removeEventListener(type, listener){
// 		if(this.has(type)){
// 			const listeners = this.get(type);
// 			const idx = listeners.indexOf(listener);
// 			if(idx !== -1){
// 				return listeners.splice(idx, 1);
// 			}
// 			return null;
// 		}else{
// 			return null;
// 		}
// 	},
// }

export const GETTARGETS = Symbol('_getTargets');

export default {
	methods: {
		_getTargets(x, y, targets, currentLayer){
			currentLayer = currentLayer || 0;
			const children = this.$children
			const l = children.length;
			for (var i = l-1; i >= 0; i--) {
				const child = children[i];
				
				if(child.$children.length > 0) {
					child._getTargets(x, y, targets, currentLayer + 1);
				}else{
					if(children[i]._hitTest(x, y)){
						targets.push(children[i]);
					}
				}
			}
		},
		_dispatch(event){
			this.$emit(event.type, event);
			if(event.bubble && !event.propagationStopped){

				this.$parent._dispatch(event)
			}
		}
	},

}