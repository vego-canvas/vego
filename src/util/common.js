function isFunction(t){
	return t && Object.prototype.toString.call(t) === '[object Function]';
}

export function findContainer(vm){
	let t = vm.$parent;
	while(t && !t.stack){
		t = t.$parent;
	}
	return t;
}
export function findEventDispacher(vm){
	let t = vm.$parent;
	while(t && !t.eventDispacher){
		t = t.$parent;
	}
	return t;
}

export function findCanvas(vm){
	let t = vm.$parent;
	while(t && t.$el.tagName !== "CANVAS"){
		t = t.$parent;
	}
	return t;
}
export function isCanvasVnode(vm){
	return vm.$options.draw && isFunction(vm.$options.draw)
}
