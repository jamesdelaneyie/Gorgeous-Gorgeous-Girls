let getPositionOnLine = function(pencil, line, percent) {
  bezierPoints = createBezierPoints(pencil, line);
  pointOnLine = bezierPoints.length * percent;
  return bezierPoints[Math.floor(pointOnLine)];
}

var findBezierPoint = function(t, p0, p1, p2, p3) {
  var t2 = t * t;
  var t3 = t2 * t;
  return (p0 * (t3 * 6) + p1 * (t2 * 3) + p2 * 3 + p3) / 6;
};

let createBezierPoints = function(pencil, line) {

  let cp1Local = line.x + line.cp1
  let cp2Local = line.y + line.cp2

  let newEndX = line.x + line.endX
  let newEndY = line.y + line.endY

  let cp3Local = line.x + line.cp3
  let cp4Local = line.y + line.cp4

  var bezier = [{x: line.x, y: line.y}, {x: cp1Local, y: cp2Local}, {x: cp3Local, y:cp4Local}, {x:newEndX, y:newEndY}]

  var bezierPoints = findCBezPoints(bezier, pencil.density);

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

function findCBezPoints(b, density=500) {
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



///NEW CODE 

class line {
  constructor({x,y,cp1,cp2,endX,endY,cp3,cp4}) {
      this.x = x;
      this.y = y;
      this.cp1 = cp1;
      this.cp2 = cp2;
      this.endX = endX;
      this.endY = endY;
      this.cp3 = cp3;
      this.cp4 = cp4;
  }
}

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

function p0(){
    var t0 = parseFloat(document.getElementById('t0').value);
    if(isNaN(t0) === true || t0>1 || t0<0){
      $('#calcB').click();
    }
    else{
      t0 = parseFloat((Math.min(1,t0+.005)).toFixed(3));
      document.getElementById('t0').value = t0;
      $('#calcB').click();
    }
}

function m0(){
    var t0 = parseFloat(document.getElementById('t0').value);
    if(isNaN(t0) === true || t0>1 || t0<0){
      $('#calcB').click();
    }
    else{
      t0 = parseFloat((Math.max(0,t0-.005)).toFixed(3));
      document.getElementById('t0').value = t0;
      $('#calcB').click();
    }
}

function p1(){
    var t1 = parseFloat(document.getElementById('t1').value);
    if(isNaN(t1) === true || t1>1 || t1<0){
      $('#calcB').click();
    }
    else{
      t1 = parseFloat((Math.min(1,t1+.005)).toFixed(3));
      document.getElementById('t1').value = t1;
      $('#calcB').click();
    }
}

function m1(){
    var t1 = parseFloat(document.getElementById('t1').value);
    if(isNaN(t1) === true || t1>1 || t1<0){
      $('#calcB').click();
    }
    else{
      t1 = parseFloat((Math.max(0,t1-.005)).toFixed(3));
      document.getElementById('t1').value = t1;
      $('#calcB').click();
    }
}


function conv(){
    var cp1x = parseFloat(document.getElementById('cP1x').value);
    var cp2x = parseFloat(document.getElementById('cP2x').value);
    var cp3x = parseFloat(document.getElementById('cP3x').value);
    var cp1y = parseFloat(document.getElementById('cP1y').value);
    var cp2y = parseFloat(document.getElementById('cP2y').value);
    var cp3y = parseFloat(document.getElementById('cP3y').value);

    var values = [cp1x,cp2x,cp3x,cp1y,cp2y,cp3y];
    
    var k = 0;

    
   for(i=0; i<values.length; i++){
       if(isNaN(values[i]) === true){
            k = 1;
       }
    }


    if(k === 0){

    var cq1x = parseFloat((cp1x).toFixed(2));
    var cq2x = parseFloat(((cp1x+2*cp2x)/3).toFixed(2));
    var cq3x = parseFloat(((cp3x+2*cp2x)/3).toFixed(2));
    var cq4x = parseFloat((cp3x).toFixed(2));
    
    var cq1y = parseFloat((cp1y).toFixed(2));
    var cq2y = parseFloat(((cp1y+2*cp2y)/3).toFixed(2));
    var cq3y = parseFloat(((cp3y+2*cp2y)/3).toFixed(2));
    var cq4y = parseFloat((cp3y).toFixed(2));
    
    $('#cQ1x').html('&nbsp;'+cq1x);
    $('#cQ2x').html('&nbsp;'+cq2x);
    $('#cQ3x').html('&nbsp;'+cq3x);
    $('#cQ4x').html('&nbsp;'+cq4x);
    $('#cQ1y').html('&nbsp;'+cq1y);
    $('#cQ2y').html('&nbsp;'+cq2y);
    $('#cQ3y').html('&nbsp;'+cq3y);
    $('#cQ4y').html('&nbsp;'+cq4y);
    
    }
    
    if(k === 1){
      $('#Cwarning').remove();
      $Cwarn = $('<span id="Cwarning" style="color:red">&nbsp;&nbsp;Enter all fields!</span>');
      $('#convert').append($Cwarn);
      $Cwarn.fadeOut(3000);
    }
}



