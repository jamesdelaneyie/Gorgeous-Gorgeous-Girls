var findBezierPoint = function(t, p0, p1, p2, p3) {
  var t2 = t * t;
  var t3 = t2 * t;
  return (p0 * (t3 * 6) + p1 * (t2 * 3) + p2 * 3 + p3) / 6;
};

let createBezierPoints = function(line) {

  let cp1Local = line.x + line.cp1
  let cp2Local = line.y + line.cp2

  let newEndX = line.x + line.endX
  let newEndY = line.y + line.endY

  let cp3Local = line.x + line.cp3
  let cp4Local = line.y + line.cp4

  var bezier = [{x: line.x, y: line.y}, {x: cp1Local, y: cp2Local}, {x: cp3Local, y:cp4Local}, {x:newEndX, y:newEndY}]

  var bezierPoints = findCBezPoints(bezier);

  return bezierPoints;
}

let getBezierPoint = function(points, x, y) {

    points[0] = points[1];
    points[1] = points[2];
    points[2] = { X:x, Y:y};

    if(points[0] == null)
        return 

    var p0 = points[0];
    var p1 = points[1];
    var p2 = points[2];

    var x0 = (p0.X + p1.X) / 2;
    var y0 = (p0.Y + p1.Y) / 2;

    return [x0, y0];

}

function findCBezPoints(b) {
	var pts = [b[0]];
	var lastPt = b[0];
	var tests = 5000;
	for (var t = 0; t <= tests; t++) {
		var pt = getCubicBezierXYatT(b[0], b[1], b[2], b[3], t / tests);
		var dx = pt.x - lastPt.x;
		var dy = pt.y - lastPt.y;
		var d = Math.sqrt(dx * dx + dy * dy);
		var dInt = parseInt(d);
		if (dInt > 0 || t == tests) {
			lastPt = pt;
			pts.push(pt);
		}
	}
	return pts;
}

function getCubicBezierXYatT(startPt, controlPt1, controlPt2, endPt, T) {
	var x = CubicN(T, startPt.x, controlPt1.x, controlPt2.x, endPt.x);
	var y = CubicN(T, startPt.y, controlPt1.y, controlPt2.y, endPt.y);
	return {
		x: x,
		y: y,
	};
}

function CubicN(T, a, b, c, d) {
	var t2 = T * T;
	var t3 = t2 * T;
	return (
		a +
		(-a * 3 + T * (3 * a - a * T)) * T +
		(3 * b + T * (-6 * b + b * 3 * T)) * T +
		(c * 3 - c * 3 * T) * t2 +
		d * t3
	);
}
