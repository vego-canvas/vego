function Stack(){
	this._stack = {}
	this._pre = {};
	this._after = {};
}
// normal drawing instructions
Stack.prototype.get = function(id){
	return this._stack[id];
}
Stack.prototype.set = function(id, thing){
	this._stack[id] = thing;
}
Stack.prototype.rm = function(id){
	this._stack[id] = null;
}

// before nomal drawing instructions
Stack.prototype.setPre = function(id, thing){
	this._pre[id] = thing;
}
Stack.prototype.rmPre = function(id){
	this._pre[id] = null;
}

// after nomal drawing instructions
Stack.prototype.setAfter = function(id, thing){
	this._after[id] = thing;
}
Stack.prototype.rmAfter = function(id){
	this._after[id] = null;
}

Stack.prototype.iterator = function(it){

	const _stack = this._stack;
	const _pre = this._pre;
	const _after = this._after;

	Object.keys(_pre).forEach(k => {
		if(_pre[k])
			it(_pre[k]);
	});

	Object.keys(_stack).forEach(k => {
		if(_stack[k]){
			if(_stack[k].type === "container"){
				_stack[k]().iterator(it)
			}else{
				it(_stack[k]);
			}
		}
	});

	Object.keys(_after).forEach(k => {
		if(_after[k])
			it(_after[k]);
	});
}

export default Stack;
