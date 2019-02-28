export function getAngle(px, py, mx, my) {
    let angle, x, y;
    x = px - mx;
    y = py - my;
    angle = Math.atan2(x, y);
    angle = (180 / Math.PI * angle) * -1;
    return angle;
}
