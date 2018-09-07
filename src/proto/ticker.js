
function ticker(run){
	const nextFrame = (t) => {
		run(t);
		window.requestAnimationFrame(nextFrame)
	};
	window.requestAnimationFrame(nextFrame);
}

export default ticker;