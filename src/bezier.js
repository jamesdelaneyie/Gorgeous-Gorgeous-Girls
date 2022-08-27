import { makeNoise2D } from "open-simplex-noise";


const noise = makeNoise2D(Math.random());


function getPositionOnLine(move, percent) {
	let bezierPoints = createBezierPoints(move);
	let pointOnLine = bezierPoints.length * percent;
	return bezierPoints[Math.floor(pointOnLine)];
}


function getBezierPoint(points, x, y) {

    points[0] = points[1];
    points[1] = points[2];
    points[2] = { X: x, Y: y };

    if (points[0] == null)
        return;

    var p0 = points[0];
    var p1 = points[1];
    var p2 = points[2];

    var x0 = (p0.X + p1.X) / 2;
    var y0 = (p0.Y + p1.Y) / 2;

    return [x0, y0];

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

function findCBezPoints(b, density, straighten) {
	var pts = [b[0]];
	var lastPt = b[0];
	var tests = density;
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
	if(straighten > 0) {

		let lineArray = [];

		let speed_per_tick = straighten

		for (let i = 0; i < pts.length - 1; i++) {
			let delta_x = pts[i+1].x - pts[i].x
			let delta_y = pts[i+1].y - pts[i].y
			let distance = Math.sqrt(delta_x * delta_x + delta_y * delta_y)
			let ticks = Math.floor(distance / speed_per_tick)
			let tick_delta_x = delta_x / ticks
			let tick_delta_y = delta_y / ticks
			for (let j = 0; j < ticks; j++) {
				lineArray.push({
					x: pts[i].x + tick_delta_x * j,
					y: pts[i].y + tick_delta_y * j
				})
			}
		}
		return lineArray

		
	}
	return pts;
}

let createBezierPoints = function (line, noiseObject) {
	let cp1Local = line.x + line.cp1;
	let cp2Local = line.y + line.cp2;

	let newEndX = line.x + line.x2;
	let newEndY = line.y + line.y2;

	let cp3Local = line.x + line.cp3;
	let cp4Local = line.y + line.cp4;

	var bezier = [
		{ x: line.x, y: line.y },
		{ x: cp1Local, y: cp2Local },
		{ x: cp3Local, y: cp4Local },
		{ x: newEndX, y: newEndY },
	];

	var bezierPoints = findCBezPoints(bezier, line.density, line.straighten);

	if(noiseObject) {
		if(noiseObject.frequency != undefined && noiseObject.magnitude != undefined) {
		
			let frequency = noiseObject.frequency
			let magnitude = noiseObject.magnitude
			
			for (let i = 0; i < bezierPoints.length; i++) {
				let deformation = noise(bezierPoints[i].x * frequency, bezierPoints[i].y * frequency);
				let offset = 1 + (magnitude * deformation);
				bezierPoints[i].x += offset
				bezierPoints[i].y += offset
			}
		}
	}
		
	function chaikinSmooth(points) {
		var newPoints = [];
		for (var i = 0; i < points.length - 1; i++) {
			var pt = {
				x: (points[i].x + points[i + 1].x) / 2,
				y: (points[i].y + points[i + 1].y) / 2,
			};
			newPoints.push(pt);
		}
		return newPoints
	}

	//console.log(noi)
	if(noiseObject) {
		if(noiseObject.smoothing !== null) {
			for (let i = 0; i < noiseObject.smoothing; i++) {
				bezierPoints = chaikinSmooth(bezierPoints);
			}
		}
	}

	return bezierPoints;

};

function calculateBezierSection(line, t0, t1){
    var p1x = line.x
    var p2x = line.x + line.cp1
    var p3x = line.x + line.cp3
    var p4x = line.x + line.x2
    var p1y = line.y
    var p2y = line.y + line.cp2
    var p3y = line.y + line.cp4
    var p4y = line.y + line.y2

    var values = [p1x,p2x,p3x,p4x,p1y,p2y,p3y,p4y,t0,t1];
    
    var k = 0;
    
    for(i=0; i<values.length; i++){
       if(isNaN(values[i]) === true){
            k = 1;
       }
    }
    
    if((t0<0 || t1<0 || t0>1 || t1>1) & k != 1){
       k = 2;
    }
    
    if(k === 0){
    
    var u0 = 1-t0;
    var u1 = 1-t1;

    var q1x = parseFloat(((u0*u0*u0)*p1x+(t0*u0*u0+u0*t0*u0+u0*u0*t0)*p2x+(t0*t0*u0+u0*t0*t0+t0*u0*t0)*p3x+t0*t0*t0*p4x).toFixed(2));
    var q2x = parseFloat(((u0*u0*u1)*p1x+(t0*u0*u1+u0*t0*u1+u0*u0*t1)*p2x+(t0*t0*u1+u0*t0*t1+t0*u0*t1)*p3x+t0*t0*t1*p4x).toFixed(2));
    var q3x = parseFloat(((u0*u1*u1)*p1x+(t0*u1*u1+u0*t1*u1+u0*u1*t1)*p2x+(t0*t1*u1+u0*t1*t1+t0*u1*t1)*p3x+t0*t1*t1*p4x).toFixed(2));
    var q4x = parseFloat(((u1*u1*u1)*p1x+(t1*u1*u1+u1*t1*u1+u1*u1*t1)*p2x+(t1*t1*u1+u1*t1*t1+t1*u1*t1)*p3x+t1*t1*t1*p4x).toFixed(2));
    
    var q1y = parseFloat(((u0*u0*u0)*p1y+(t0*u0*u0+u0*t0*u0+u0*u0*t0)*p2y+(t0*t0*u0+u0*t0*t0+t0*u0*t0)*p3y+t0*t0*t0*p4y).toFixed(2));
    var q2y = parseFloat(((u0*u0*u1)*p1y+(t0*u0*u1+u0*t0*u1+u0*u0*t1)*p2y+(t0*t0*u1+u0*t0*t1+t0*u0*t1)*p3y+t0*t0*t1*p4y).toFixed(2));
    var q3y = parseFloat(((u0*u1*u1)*p1y+(t0*u1*u1+u0*t1*u1+u0*u1*t1)*p2y+(t0*t1*u1+u0*t1*t1+t0*u1*t1)*p3y+t0*t1*t1*p4y).toFixed(2));
    var q4y = parseFloat(((u1*u1*u1)*p1y+(t1*u1*u1+u1*t1*u1+u1*u1*t1)*p2y+(t1*t1*u1+u1*t1*t1+t1*u1*t1)*p3y+t1*t1*t1*p4y).toFixed(2));
    
    return {
      x:q1x,
      y:q1y,
      cp1:parseFloat((q1x - q2x).toFixed(2)) * -1,
      cp2:parseFloat((q1y - q2y).toFixed(2)) * -1,
      x2:parseFloat((q1x - q4x).toFixed(2)) * -1,
      y2:parseFloat((q1y - q4y).toFixed(2)) * -1,
      cp3:parseFloat((q1x - q3x).toFixed(2)) * -1,
      cp4:parseFloat((q1y - q3y).toFixed(2)) * -1,
    }
  }
    
    
}


export { createBezierPoints, getBezierPoint, getPositionOnLine };
