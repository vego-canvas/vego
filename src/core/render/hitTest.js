import { getNewCanvas } from '../../utils'

const hitTestSpace = getNewCanvas()
const ctx = hitTestSpace.ctx;
hitTestSpace.canvas.width = hitTestSpace.canvas.height = 1;
export default function(x, y, mtx, g, ratio = 1){
  ctx.setTransform(1, 0, 0, 1, -x * ratio, -y * ratio);
  ctx.transform(mtx[0], mtx[1], mtx[2], mtx[3], mtx[4], mtx[5]);
  g.draw(ctx);
  const hit = ctx.getImageData(0, 0, 1, 1).data[3] > 1;
  ctx.setTransform();
  ctx.clearRect(0, 0, 2, 2);
  return hit;
}