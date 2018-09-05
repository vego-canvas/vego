
function Render(ctx, vnode){
	const data = vnode.data;
	const {
		x, y, r, color
	} = data;
	ctx.beginPath();
	ctx.save();
	ctx.fillStyle = color;
	ctx.arc(x, y, r, 0, 2 * Math.PI);
	ctx.fill();
	ctx.restore();

}
export default Render;