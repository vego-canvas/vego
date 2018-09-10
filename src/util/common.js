export function findContainer(vm){
	let t = vm.$parent;
	while(t && !t.stack){
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
