

function Ticker(run){
	const nextFrame = (t) => {
		const elapsedTime = t - Ticker._lastTime;
		Ticker._lastTime = t;
		if(Ticker._pause){
			Ticker._pausedTime += elapsedTime;
		}
		const due = t - Ticker._pausedTime;
		run(due);
		Ticker.emit(due);
		window.requestAnimationFrame(nextFrame)
	};
	window.requestAnimationFrame(nextFrame);
}
const _listener = [];
Ticker.regist = function(tween){
	_listener.push(tween);
	return _listener.length - 1;
}
Ticker.unregist = function(idx){
	_listener.splice(idx, 1);
	return _listener.length;
}
Ticker.emit = function(span){
	_listener.forEach(tween => tween.tick(span));
}
Ticker._pause = false;
Ticker._pausedTime = 0;
Ticker._lastTime = 0;


export default Ticker;