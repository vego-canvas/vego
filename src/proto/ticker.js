
function Ticker(run){
	const nextFrame = (t) => {
		const elapsedTime = t - Ticker._lastTime;
		Ticker._lastTime = t;
		if(Ticker._pause){
			Ticker._pausedTime += elapsedTime;
		}
		run(t - Ticker._pausedTime);
		window.requestAnimationFrame(nextFrame)
	};
	window.requestAnimationFrame(nextFrame);
}
Ticker._pause = false;
Ticker._pausedTime = 0;
Ticker._lastTime = 0;


export default Ticker;